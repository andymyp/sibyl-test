import { MyCasePage } from "@/components/pages/my-case/page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <MyCasePage id={id} />;
}
