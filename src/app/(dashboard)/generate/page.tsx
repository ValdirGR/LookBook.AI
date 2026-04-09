import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GenerationStudioClient } from "./client-view";

export default async function GeneratePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get Brand and Collections
  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { memberships: { include: { brand: true } } }
  });

  const brand = dbUser?.memberships?.[0]?.brand;

  if (!brand) {
    redirect("/onboarding");
  }

  // Fetch collections that have garments
  const collections = await prisma.collection.findMany({
    where: { brandId: brand.id },
    include: {
      garments: {
        orderBy: { sortOrder: 'asc' }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-4 sm:-m-8">
      {/* We use negative margins to make the studio full bleed to the padding of the dashboard Layout. */}
      {/* Then we constrain it nicely in the Client View */}
      <GenerationStudioClient collections={collections as any} credits={brand.creditsRemaining} />
    </div>
  );
}
