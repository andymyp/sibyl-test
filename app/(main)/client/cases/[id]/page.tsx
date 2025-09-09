import { MyCasePage } from "@/components/pages/my-case/page";
import { NewCasePage } from "@/components/pages/new-case/page";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login", RedirectType.replace);
  }

  return <MyCasePage id={id} user={user} />;
}
