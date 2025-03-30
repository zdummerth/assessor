"use client";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Search" },
    { href: "/parcels", label: "Parcels" },
    { href: "/appraisers", label: "Appraisers" },
    // { href: "/map", label: "Map" },
    // { href: "/sales/ratios", label: "Ratios" },
  ];

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-[50px]">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-all ${pathname === href ? "text-blue-500" : ""}`}
            >
              {label}
            </Link>
          ))}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
