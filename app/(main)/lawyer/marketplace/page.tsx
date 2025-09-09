import { MarketplacePage } from "@/components/pages/marketplace/page";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login", RedirectType.replace);
  }

  return <MarketplacePage user={user} />;
}
