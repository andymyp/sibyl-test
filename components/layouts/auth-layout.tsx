"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useCheckUser } from "@/hooks/use-check-user";
import { useRedirect } from "@/hooks/use-redirect";
import { PageLoader } from "../ui/page-loader";
import { Role } from "@/lib/generated/prisma";

interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  const isLoading = useSelector((s: AppState) => s.app.isLoading);

  const { userLoading, user } = useCheckUser();

  useRedirect(() => {
    if (!userLoading && !user) return null;
    if (user?.user_metadata.role === Role.CLIENT) return "/client/dashboard";
    if (user?.user_metadata.role === Role.LAWYER) return "/lawyer/marketplace";
    return null;
  });

  if (userLoading || user) return <PageLoader />;

  return (
    <section
      className={cn(
        "flex flex-col w-full min-h-screen justify-center items-center",
        isLoading && "!pointer-events-none"
      )}
    >
      {children}
    </section>
  );
}
