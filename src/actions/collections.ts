"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCollectionSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  season: z.string().optional(),
  description: z.string().optional(),
});

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createCollection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createCollectionSchema.safeParse({
    name: formData.get("name"),
    season: formData.get("season"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Usuário não autenticado." };
    }

    // Get the user's brand
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      include: {
        memberships: {
          include: { brand: true }
        }
      }
    });

    const brand = dbUser?.memberships?.[0]?.brand;

    if (!brand) {
      return { error: "O usuário não possui uma marca associada." };
    }

    await prisma.collection.create({
      data: {
        brandId: brand.id,
        name: parsed.data.name,
        season: parsed.data.season || null,
        description: parsed.data.description || null,
        status: "DRAFT",
      }
    });

    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { error: "Ocorreu um erro interno ao criar a coleção." };
  }
}

export async function deleteCollection(collectionId: string): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Usuário não autenticado." };
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { brand: { include: { members: true } } }
    });

    if (!collection) {
      return { error: "Coleção não encontrada." };
    }

    // Checking if user has permission
    const hasPermission = collection.brand.members.some(member => member.userId ===
      (collection.brand.members.find(m => m.user?.authId === user.id)?.userId || "")
    );
    // Actually, getting Prisma user ID is safer
    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser || !collection.brand.members.some(m => m.userId === dbUser.id)) {
      return { error: "Permissão negada." };
    }

    await prisma.collection.delete({
      where: { id: collectionId }
    });

    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { error: "Ocorreu um erro ao excluir a coleção." };
  }
}
