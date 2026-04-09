"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { GarmentType } from "@prisma/client";

const createGarmentSchema = z.object({
  collectionId: z.string().uuid("Collection ID inválido"),
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  referenceImage: z.string().url("A imagem de referência deve ser uma URL válida"),
  detectedType: z.string().optional(),
});

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createGarment(
  _prevState: ActionState,
  data: {
    collectionId: string;
    name: string;
    referenceImage: string;
    detectedType?: string;
  }
): Promise<ActionState> {
  const parsed = createGarmentSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Usuário não autenticado." };
    }

    // Checking if user has access to this collection
    const collection = await prisma.collection.findUnique({
      where: { id: parsed.data.collectionId },
      include: {
        brand: { include: { members: true } }
      }
    });

    if (!collection) {
      return { error: "Coleção não encontrada." };
    }

    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser || !collection.brand.members.some((m: any) => m.userId === dbUser.id)) {
      return { error: "Permissão negada." };
    }

    // Determine type, falling back to OUTRO if invalid
    let garmentType: GarmentType = "OUTRO";
    if (parsed.data.detectedType) {
      // Very basic loose mapping, in real life you'd validate against the GarmentType Enum explicitly
      const possibleType = parsed.data.detectedType.toUpperCase();
      // Ensure it matches Enum
      const validTypes = ["VESTIDO","BLUSA","CAMISA","CAMISETA","BLAZER","JAQUETA","CASACO","CALCA","SAIA","SHORT","MACACAO","CONJUNTO","BODY","CROPPED","CARDIGAN","COLETE","OUTRO"];
      if (validTypes.includes(possibleType)) {
        garmentType = possibleType as GarmentType;
      }
    }

    // Count existing garments for sortOrder
    const garmentCount = await prisma.garment.count({
      where: { collectionId: parsed.data.collectionId }
    });

    await prisma.garment.create({
      data: {
        collectionId: parsed.data.collectionId,
        name: parsed.data.name,
        referenceImage: parsed.data.referenceImage,
        detectedType: garmentType,
        sortOrder: garmentCount,
      }
    });

    // We can also update the collection's cover image if it's empty
    if (!collection.coverImageUrl) {
      await prisma.collection.update({
        where: { id: parsed.data.collectionId },
        data: { coverImageUrl: parsed.data.referenceImage }
      });
    }

    revalidatePath(`/collections/${parsed.data.collectionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating garment:", error);
    return { error: "Ocorreu um erro interno ao criar a peça." };
  }
}

export async function deleteGarment(garmentId: string, collectionId: string): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Usuário não autenticado." };
    }

    const garment = await prisma.garment.findUnique({
      where: { id: garmentId },
      include: {
        collection: {
          include: { brand: { include: { members: true } } }
        }
      }
    });

    if (!garment) {
      return { error: "Peça não encontrada." };
    }

    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser || !garment.collection.brand.members.some((m: any) => m.userId === dbUser.id)) {
      return { error: "Permissão negada." };
    }

    await prisma.garment.delete({
      where: { id: garmentId }
    });

    // NOTE: In a real app, we should also delete the file from Supabase Storage here.

    revalidatePath(`/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting garment:", error);
    return { error: "Ocorreu um erro ao excluir a peça." };
  }
}
