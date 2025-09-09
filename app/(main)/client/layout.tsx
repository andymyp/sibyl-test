import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/generated/prisma";
import { MainLayout } from "@/components/layouts/main-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login", RedirectType.replace);
  }

  if (user.user_metadata.role !== Role.CLIENT) {
    return redirect("/lawyer/marketplace", RedirectType.replace);
  }

  return <MainLayout user={user}>{children}</MainLayout>;
}
