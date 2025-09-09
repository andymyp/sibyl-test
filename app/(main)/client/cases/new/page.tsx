import { NewCasePage } from "@/components/pages/new-case/page";
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

  return <NewCasePage user={user} />;
}
