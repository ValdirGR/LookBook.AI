import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
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
      <CollectionsClientView collections={collections} />
    </div>
  );
}
