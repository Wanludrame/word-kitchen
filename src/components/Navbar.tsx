"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, Warehouse, CookingPot, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: ChefHat },
  { href: "/pantry", label: "食材库", icon: Warehouse },
  { href: "/kitchen", label: "厨房", icon: CookingPot },
  { href: "/creations", label: "作品", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-warm-200 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-around md:justify-between h-16">
        <Link href="/" className="hidden md:flex items-center gap-2 font-bold text-lg text-warm-800">
          <ChefHat className="w-6 h-6 text-toast" />
          文字厨房
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                  active
                    ? "text-toast bg-warm-100 font-semibold"
                    : "text-warm-600 hover:text-warm-800 hover:bg-warm-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
