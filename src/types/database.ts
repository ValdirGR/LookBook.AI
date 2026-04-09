export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type BrandMemberRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
export type CollectionStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type GarmentStatus = "PENDING" | "ANALYZING" | "READY_TO_GENERATE" | "GENERATING" | "GENERATED" | "FAILED";
export type ImageStatus = "GENERATING" | "QUALITY_CHECK" | "READY" | "FAILED" | "REJECTED" | "REGENERATING";
export type VariationType = "FRONTAL" | "LATERAL" | "MOVIMENTO" | "CLOSE" | "PLANO_ABERTO" | "TRES_QUARTOS";
export type Composition = "WALKING" | "STANDING" | "INTERACTING" | "CLOSE_UP" | "SITTING" | "LEANING";
export type GenerationMode = "EDITORIAL" | "CLEAN" | "LIFESTYLE";
export type FramingType = "FULL_BODY" | "HALF_BODY" | "DETAIL" | "WIDE";
export type PlanType = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "PAUSED";
export type CreditOperation = "SUBSCRIPTION_RENEWAL" | "CREDIT_PURCHASE" | "GENERATION_DEBIT" | "REFUND" | "MANUAL_ADJUSTMENT" | "BONUS";
export type GarmentType = "VESTIDO" | "BLUSA" | "CAMISA" | "CAMISETA" | "BLAZER" | "JAQUETA" | "CASACO" | "CALCA" | "SAIA" | "SHORT" | "MACACAO" | "CONJUNTO" | "BODY" | "CROPPED" | "CARDIGAN" | "COLETE" | "OUTRO";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  instagram: string | null;
  defaultModelId: string | null;
  creditsRemaining: number;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  brandId: string;
  name: string;
  season: string | null;
  description: string | null;
  modelProfileId: string | null;
  moodPresetId: string | null;
  coverImageUrl: string | null;
  shareToken: string | null;
  status: CollectionStatus;
  createdAt: string;
  updatedAt: string;
  garments?: Garment[];
  _count?: { garments: number };
}

export interface Garment {
  id: string;
  collectionId: string;
  name: string;
  referenceImage: string;
  detectedType: GarmentType | null;
  detectedColor: string | null;
  detectedTexture: string | null;
  detectedStyle: string | null;
  customPrompt: string | null;
  sortOrder: number;
  status: GarmentStatus;
  createdAt: string;
  updatedAt: string;
  generatedImages?: GeneratedImage[];
}

export interface GeneratedImage {
  id: string;
  garmentId: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  variationType: VariationType;
  composition: Composition;
  generationMode: GenerationMode;
  framingType: FramingType;
  promptUsed: string;
  negativePrompt: string | null;
  seed: number | null;
  qualityScore: number | null;
  width: number;
  height: number;
  status: ImageStatus;
  rejectedReason: string | null;
  retryCount: number;
  generatedAt: string | null;
  createdAt: string;
}

export interface ModelProfile {
  id: string;
  brandId: string;
  name: string;
  referenceImages: string[];
  seedData: Record<string, unknown> | null;
  hairColor: string | null;
  eyeColor: string | null;
  skinTone: string | null;
  bodyType: string | null;
  ageRange: string | null;
  style: string | null;
  isBrandDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MoodPreset {
  id: string;
  brandId: string | null;
  name: string;
  slug: string;
  description: string | null;
  promptTemplate: string;
  scenarioHints: Record<string, unknown> | null;
  stylingHints: Record<string, unknown> | null;
  lightingHints: Record<string, unknown> | null;
  thumbnailUrl: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  brandId: string;
  plan: PlanType;
  creditsTotal: number;
  creditsUsed: number;
  billingCycleStart: string;
  billingCycleEnd: string;
  paymentProvider: string | null;
  externalSubscriptionId: string | null;
  externalCustomerId: string | null;
  priceInCents: number | null;
  status: SubscriptionStatus;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreditLedger {
  id: string;
  brandId: string;
  amount: number;
  balance: number;
  operation: CreditOperation;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
}

export interface GenerationLog {
  id: string;
  brandId: string;
  garmentId: string;
  provider: string;
  model: string | null;
  promptSent: string;
  negativePrompt: string | null;
  parameters: Record<string, unknown> | null;
  apiResponse: Record<string, unknown> | null;
  durationMs: number | null;
  creditsConsumed: number;
  error: string | null;
  status: string;
  createdAt: string;
}
