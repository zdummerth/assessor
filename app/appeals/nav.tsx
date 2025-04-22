"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavClient = () => {
  const pathname = usePathname();
  const links = [
    { href: "/appeals/stats", label: "Summary" },
    { href: "/appeals", label: "Grid" },
  ];

  return (
    <div className="print:hidden">
      <h2 className="text-center text-lg my-4">Appeals</h2>
      <div className="text-sm mt-4 mb-1 flex gap-5 justify-center items-center font-semibold w-full">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`transition-all ${pathname === href ? "text-blue-500" : ""}  hover:text-blue-500 whitespace-nowrap`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavClient;
