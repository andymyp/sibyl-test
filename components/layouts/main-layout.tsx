"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { MainHeader } from "../ui/main-header";
import { User } from "@supabase/supabase-js";
import { Sidebar } from "../ui/sidebar";
import { UserProvider } from "../providers/user-provider";

interface Props {
  user: User;
  children: React.ReactNode;
}

export function MainLayout({ user, children }: Props) {
  const isLoading = useSelector((s: AppState) => s.app.isLoading);

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
