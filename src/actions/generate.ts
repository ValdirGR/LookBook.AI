"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fal } from "@fal-ai/client";
import type { Composition, FramingType, GenerationMode, VariationType } from "@prisma/client";

// This tells fal-ai where to find our key, usually it reads FAL_KEY automatically.
// Make sure FAL_KEY is in your environment variables.

const generateLookSchema = z.object({
  garmentId: z.string().uuid("ID de peça inválido"),
  prompt: z.string().min(5, "Descreva melhor o que você dejesa gerar.")
});

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function generateLookbook(
  _prevState: ActionState,
  data: { garmentId: string; prompt: string }
): Promise<ActionState> {
  const parsed = generateLookSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Usuário não autenticado." };
    }

    // 1. Verify Access and fetch Garment
    const garment = await prisma.garment.findUnique({
      where: { id: parsed.data.garmentId },
      include: {
        collection: {
          include: { brand: { include: { members: true } } }
        }
      }
    });

    if (!garment) {
      return { error: "Peça de roupa não encontrada." };
    }

    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser || !garment.collection.brand.members.some((m: any) => m.userId === dbUser.id)) {
      return { error: "Permissão negada." };
    }

    // Checking if they have enough credits (Optional MVP rule)
    if (garment.collection.brand.creditsRemaining < 1) {
      return { error: "Créditos insuficientes! Faça um upgrade no seu plano." };
    }

    // 2. We deduct a credit (Simple MVP logic without transactions for now)
    await prisma.brand.update({
      where: { id: garment.collection.brand.id },
      data: { creditsRemaining: { decrement: 1 } }
    });

    // 3. Create the Database Log & Placeholder
    const generatedImageId = crypto.randomUUID(); // Predetermining ID
    
    // We create a Pending state in the DB if we were doing async, but since we decided on SYNCHRONOUS:
    // We will just await the Fal.ai call to finish, then insert the COMPLETED state immediately.
    
    // 4. Call Fal.AI
    // Currently, typical Image-to-Image / VTO logic
    // Using fal-ai/flux-general or a generic endpoint that accepts image as reference for MVP.
    // Replace with `fal-ai/kolors-virtual-try-on` when going live with full fashion logic.
    
    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: `${parsed.data.prompt}, high fashion, editorial photography, 8k resolution`,
        image_size: "portrait_4_5",
        num_inference_steps: 4,
        num_images: 1,
        // if using an IP adapter or something similar, you'd pass garment.referenceImage 
        // e.g., image_url: garment.referenceImage
        enable_safety_checker: true
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    // Extract image URL from response
    const finalImageUrl = result.images[0].url;

    // 5. Store result in Prisma
    await prisma.generatedImage.create({
      data: {
        id: generatedImageId,
        garmentId: garment.id,
        imageUrl: finalImageUrl,
        promptUsed: parsed.data.prompt,
        status: "COMPLETED",
        composition: "FULL_BODY" as Composition, // Placeholder ENUM mappings
        generationMode: "TEXT_TO_IMAGE" as GenerationMode,
        framingType: "PORTRAIT" as FramingType,
        variationType: "PRIMARY" as VariationType,
        width: result.images[0].width || 1024,
        height: result.images[0].height || 1280,
      }
    });

    // Also Log it Request
    await prisma.generationLog.create({
      data: {
        brandId: garment.collection.brand.id,
        garmentId: garment.id,
        promptSent: parsed.data.prompt,
        status: "success",
        apiResponse: JSON.stringify(result)
      }
    });

    revalidatePath("/gallery");
    revalidatePath(`/collections/${garment.collectionId}`);

    return { success: true };
    
  } catch (error: any) {
    console.error("Error generating look:", error);
    
    // If we threw an error, we should probably refund the credit locally
    // For MVP, we skip the immediate refund complex saga pattern.
    return { error: error.message || "Erro de servidor ao bater na IA." };
  }
}
