"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export function LawyerLayout({ children }: Props) {
  const isLoading = useSelector((s: AppState) => s.app.isLoading);

  return (
    <section
      className={cn(
        "flex flex-col w-full min-h-screen",
        isLoading && "!pointer-events-none"
      )}
    >
      {children}
    </section>
  );
}
