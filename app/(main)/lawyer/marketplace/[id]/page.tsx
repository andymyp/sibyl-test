import CaseQuotePage from "@/components/pages/marketplace/details/page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <CaseQuotePage id={id} />;
}
