"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteLinks } from "@/config/siteLinks";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <header className="h-[64px] bg-slate-700 text-white font-bold">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        <Link href="/" className="text-xl font-bold">
          英語 × Notion
        </Link>

        {!isMobile ? (
          // Desktop/Laptop navigation
          <nav className="hidden md:flex items-center space-x-6">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-slate-300 ${
                  pathname === link.href
                    ? "text-white underline"
                    : "text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          // Mobile hamburger menu
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {siteLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="w-full cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
