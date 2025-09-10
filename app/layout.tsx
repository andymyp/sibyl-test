import type { Metadata } from "next";

import "../styles/globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { NuqsProvider } from "@/components/providers/nuqs-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export const metadata: Metadata = {
  title: "LegalConnect",
  description: "Legal Marketplace App",
  keywords: "Legal, Connect, Marketplace, Legal Connect, Legal Marketplace",
  authors: [
    {
      name: "M. Yudistiandy Prabowo",
      url: "https://linkedin.com/in/andymyp",
    },
    {
      name: "M. Yudistiandy Prabowo",
      url: "https://github.com/andymyp",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="flex flex-auto w-full min-h-screen antialiased">
        <ReduxProvider>
          <NuqsProvider>
            <QueryProvider>
              <LoadingProvider>
                <ToastProvider>{children}</ToastProvider>
              </LoadingProvider>
            </QueryProvider>
          </NuqsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
