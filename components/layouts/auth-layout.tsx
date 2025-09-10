"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  const isLoading = useSelector((s: AppState) => s.app.isLoading);

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
