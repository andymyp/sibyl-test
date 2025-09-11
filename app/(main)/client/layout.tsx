import { MainLayout } from "@/components/layouts/main-layout";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return <MainLayout page="client">{children}</MainLayout>;
}
