import type { Metadata } from "next";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: "LegalMarketplace",
  description: "Legal Marketplace App",
  keywords: "Legal, Marketplace, Legal Marketplace",
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
    <html lang="en">
      <body className="flex flex-auto w-full min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
