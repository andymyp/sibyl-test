import { LawyerCaseDetailPage } from "@/components/pages/my-case/lawyer/page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <LawyerCaseDetailPage id={id} />;
}
