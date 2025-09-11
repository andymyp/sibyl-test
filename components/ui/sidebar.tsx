"use client";

import { Folder, LayoutDashboardIcon, Plus } from "lucide-react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "./scroll-area";
import { User } from "@supabase/supabase-js";
import { Role } from "@/lib/generated/prisma";

const clientMenu = [
  {
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    link: "/client/dashboard",
  },
  {
    name: "New Case",
    icon: Plus,
    link: "/client/cases/new",
  },
] as const;

const LawyerMenu = [
  {
    name: "Marketplace",
    icon: LayoutDashboardIcon,
    link: "/lawyer/marketplace",
  },
  {
    name: "My Quotes",
    icon: Folder,
    link: "/lawyer/my-quotes",
  },
] as const;

interface Props {
  user: User;
  setMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ user, setMenuOpen }: Props) {
  const pathname = usePathname();

  const isActive = (link: string) => {
    return pathname.startsWith(link);
  };

  const isClient = user.user_metadata.role === Role.CLIENT;
  const menuList = isClient ? clientMenu : LawyerMenu;

  return (
    <aside className="sticky md:top-[65px] h-screen md:h-[calc(100vh-65px)] w-full sm:max-w-sm md:w-16 flex flex-col items-center justify-between border-r bg-background/80 backdrop-blur-sm">
      <ScrollArea className="flex-1 w-full min-h-0">
        <div className="flex flex-col flex-1">
          <div className="flex md:hidden h-16 px-3 md:p-0 items-center justify-start md:justify-center border-b">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium text-primary text-lg"
            >
              <Image
                src="/logo.svg"
                alt="LegalConnect"
                width={32}
                height={32}
                priority
              />
              LegalConnect
            </Link>
          </div>

          <nav className="flex flex-col flex-1 gap-2 p-2">
            <TooltipProvider>
              {menuList.map((item, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.link}
                      className="flex justify-center items-center"
                    >
                      <Button
                        variant={isActive(item.link) ? "secondary" : "ghost"}
                        size="icon"
                        className={cn(
                          "w-full md:w-12 h-12 justify-start md:justify-center px-3 rounded-md",
                          isActive(item.link) &&
                            "bg-accent hover:bg-accent text-primary shadow-sm"
                        )}
                        onClick={() => setMenuOpen?.(false)}
                      >
                        <item.icon className="!h-5 !w-5" />
                        <span className="flex md:hidden">{item.name}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
