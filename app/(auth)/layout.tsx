import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthLayout } from "@/components/layouts/auth-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (user.role === "CLIENT") {
      return redirect("/client/dashboard", RedirectType.replace);
    }

    return redirect("/lawyer/marketplace", RedirectType.replace);
  }

  return <AuthLayout>{children}</AuthLayout>;
}
