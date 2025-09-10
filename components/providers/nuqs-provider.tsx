import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface Props {
  children: React.ReactNode;
}

export function NuqsProvider({ children }: Props) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
