import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get Brand
  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { memberships: { include: { brand: true } } }
  });

  const brand = dbUser?.memberships?.[0]?.brand;

  if (!brand) {
    redirect("/onboarding");
  }

  // Fetch all generated images for the brand's collections via Garment
  const looks = await prisma.generatedImage.findMany({
    where: {
      garment: {
        collection: {
          brandId: brand.id
        }
      }
    },
    include: {
      garment: {
        include: {
          collection: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Map to add `collection.name` explicitly
  const formattedLooks = looks.map((img) => ({
    ...img,
    collection: img.garment.collection
  }));

  return (
    <div className="gallery-page">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-2">
            Galeria
          </h1>
          <p className="text-sm text-[var(--color-warm-gray)]">
            Explore todos os lookbooks gerados através de suas coleções.
          </p>
        </div>
      </div>

      <div className="gallery-content">
        <GalleryGrid looks={formattedLooks as any} />
      </div>
    </div>
  );
}
