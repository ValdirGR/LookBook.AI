import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  numImages?: number;
  seed?: number;
}

export interface GenerationResult {
  imageUrl: string;
  seed: number;
  width: number;
  height: number;
}

export async function generateImage(
  params: GenerationParams
): Promise<GenerationResult> {
  const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
    input: {
      prompt: params.prompt,
      image_size: "portrait_4_3",
      num_images: 1,
      seed: params.seed,
      enable_safety_checker: true,
    },
  });

  const image = result.data.images[0];

  return {
    imageUrl: image.url,
    seed: result.data.seed ?? 0,
    width: image.width,
    height: image.height,
  };
}

export async function generateLookbookSet(
  basePrompt: string,
  referenceImageUrl: string,
  variations: {
    variationType: string;
    composition: string;
    framingType: string;
  }[],
  seed?: number
): Promise<GenerationResult[]> {
  const promises = variations.map((variation) => {
    const prompt = `${basePrompt}, ${variation.variationType} angle, ${variation.composition} pose, ${variation.framingType} framing, fashion editorial photography, high-end magazine quality, professional studio lighting`;

    return generateImage({
      prompt,
      imageUrl: referenceImageUrl,
      seed,
      width: 2048,
      height: 2048,
    });
  });

  return Promise.all(promises);
}
