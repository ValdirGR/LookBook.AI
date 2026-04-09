"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const onboardingSchema = z.object({
  brandName: z.string().min(2, "Nome da marca deve ter pelo menos 2 caracteres"),
  brandSegment: z.enum(["streetwear", "luxury", "casual", "sportswear", "sustainable", "bridal", "kids", "plus_size", "other"]),
  role: z.enum(["designer", "photographer", "brand_owner", "agency", "freelancer", "other"]),
});

export type OnboardingState = {
  error?: string;
  success?: boolean;
};

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const parsed = onboardingSchema.safeParse({
    brandName: formData.get("brandName"),
    brandSegment: formData.get("brandSegment"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  try {
    // 1. Atualizar metadata no Supabase garantindo que marcamos como concluído
    await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        brand_name: parsed.data.brandName,
        brand_segment: parsed.data.brandSegment,
        role: parsed.data.role,
      },
    });

    // 2. Sincronização com o Prisma
    await prisma.$transaction(async (tx) => {
      // Verifica se o User existe
      let dbUser = await tx.user.findUnique({
        where: { authId: user.id },
      });

      if (!dbUser) {
        dbUser = await tx.user.create({
          data: {
            authId: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name || "",
            role: "USER",
          },
        });
      }

      // Verifica se há afiliação a marca
      const existingMembership = await tx.brandMember.findFirst({
        where: { userId: dbUser.id },
        include: { brand: true },
      });

      let brand;

      if (!existingMembership) {
        // Cria nova Brand
        const slugBase = parsed.data.brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const uniqueSuffix = Math.random().toString(36).substring(2, 6);
        const slug = `${slugBase}-${uniqueSuffix}`;

        brand = await tx.brand.create({
          data: {
            name: parsed.data.brandName,
            slug,
            creditsRemaining: 10,
            onboardingCompleted: true,
          },
        });

        // Conecta o User na Brand como Owner
        await tx.brandMember.create({
          data: {
            userId: dbUser.id,
            brandId: brand.id,
            role: "OWNER",
            joinedAt: new Date(),
          },
        });

        // Registro de 10 créditos grátis iniciais
        await tx.creditLedger.create({
          data: {
            brandId: brand.id,
            amount: 10,
            balance: 10,
            operation: "BONUS",
            description: "Créditos iniciais ao finalizar cadastro",
          }
        });
      } else {
        // Apenas marca como concluído se a marca já existia
        brand = existingMembership.brand;
        if (!brand.onboardingCompleted) {
          await tx.brand.update({
            where: { id: brand.id },
            data: { onboardingCompleted: true },
          });
        }
      }
    });

  } catch (error) {
    console.error("Erro na sincronização do onboarding com Prisma:", error);
    return { error: "Erro ao salvar dados finais de usuário na plataforma." };
  }

  redirect("/collections");
}
