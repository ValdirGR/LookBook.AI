import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { CollectionsClientView } from "./client-view";

export default async function CollectionsPage() {
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

  const collections = await prisma.collection.findMany({
    where: { brandId: brand.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            Suas Coleções
          </h1>
          <p className="text-sm text-[var(--color-warm-gray)] mt-1">
            Organize suas peças em coleções e gere lookbooks editoriais.
          </p>
        </div>
      </div>

      {collections.length === 0 ? (
        // Render Client View ONLY for the empty state or wrap everything in ClientView
        // Actually, we need the "New Collection" button up top no matter what, so it's better to pass the data to a Client Component.
        <CollectionsClientView collections={collections} />
      ) : (
        <CollectionsClientView collections={collections} />
      )}
    </div>
  );
}
