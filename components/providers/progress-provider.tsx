"use client";

import React from "react";
import { useProgress } from "@bprogress/next";
import { useSelector } from "react-redux";
import { AppState } from "@/lib/store";

interface Props {
  children: React.ReactNode;
}

export function ProgressProvider({ children }: Props) {
  const { start, stop } = useProgress();

  const isLoading = useSelector((s: AppState) => s.app.isLoading);

  React.useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  return <>{children}</>;
}
