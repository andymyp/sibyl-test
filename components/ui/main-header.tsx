"use client";

import React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { ProfileMenu } from "./profile-menu";
import { User } from "@supabase/supabase-js";
import { Sidebar } from "./sidebar";
import { Badge } from "./badge";

interface Props {
  user: User;
}

export function MainHeader({ user }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-10 h-10 md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-sm md:w-16 p-0"
            >
              <SheetHeader className="hidden">
                <SheetTitle />
                <SheetDescription />
              </SheetHeader>
              <Sidebar user={user} setMenuOpen={setMenuOpen} />
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-3 font-bold text-lg text-primary">
              <Image
                src="/logo.svg"
                alt="LegalConnect"
                width={34}
                height={34}
                priority
              />
              LegalConnect
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{user.user_metadata.role}</Badge>
          <ProfileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
