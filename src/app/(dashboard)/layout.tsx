import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check Prisma for User and Brand
  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { memberships: { include: { brand: true } } },
  });

  const onboardingCompleted = dbUser?.memberships?.[0]?.brand?.onboardingCompleted;

  if (!dbUser || !onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <DashboardLayoutClient>{children}</DashboardLayoutClient>
  );
}
