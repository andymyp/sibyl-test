import { AuthLayout } from "@/components/layouts/auth-layout";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>;
}
