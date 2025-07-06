"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeSwitcher } from "./mode-switcher";
import { Button } from "./ui/button";

const Nav = [
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo and menu */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-base font-medium">
              UI Registry
            </Link>

            <nav className="flex items-center gap-0.5">
              {Nav.map((navItem) => (
                <Button key={navItem.href} variant="ghost" size="sm" asChild>
                  <Link
                    href={navItem.href}
                    className={cn(pathname === navItem.href && "text-primary")}
                  >
                    {navItem.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          {/* Right side: Mode switcher */}
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
