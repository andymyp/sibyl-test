"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { MainHeader } from "../ui/main-header";
import { Sidebar } from "../ui/sidebar";
import { UserProvider } from "../providers/user-provider";
import { PageLoader } from "../ui/page-loader";
import { useCheckUser } from "@/hooks/use-check-user";
import { useRedirect } from "@/hooks/use-redirect";
import { Role } from "@/lib/generated/prisma";

interface Props {
  page: "client" | "lawyer";
  children: React.ReactNode;
}

export function MainLayout({ page, children }: Props) {
  const isLoading = useSelector((s: AppState) => s.app.isLoading);

  const { userLoading, user } = useCheckUser();

  useRedirect(() => {
    if (!userLoading && !user) return "/login";

    if (page === "client" && user && user.user_metadata.role !== Role.CLIENT) {
      return "/lawyer/marketplace";
    }

    if (page === "lawyer" && user && user.user_metadata.role !== Role.LAWYER) {
      return "/client/dashboard";
    }

    return null;
  });

  if (userLoading || !user) return <PageLoader />;

  return (
    <UserProvider user={user}>
      <section
        className={cn(
          "flex flex-col w-full min-h-screen",
          isLoading && "!pointer-events-none"
        )}
      >
        <MainHeader user={user} />

        <div className="flex flex-1 min-h-0">
          <div className="hidden md:block">
            <Sidebar user={user} />
          </div>

          <main className="flex flex-1 p-4 min-h-0 min-w-0 overflow-hidden">
            {children}
          </main>
        </div>
      </section>
    </UserProvider>
  );
}
