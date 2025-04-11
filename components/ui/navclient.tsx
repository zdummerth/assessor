"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavClient = () => {
  const pathname = usePathname();
  const links = [
    { href: "/appeals", label: "Appeals" },
    { href: "/sales", label: "Sales" },
    { href: "/appraisers", label: "Appraisers" },
    { href: "/building-permits", label: "Permits" },
    { href: "/wards/summary/test", label: "Ward Summary" },
    { href: "/wards/test", label: "Ward Detail" },
  ];

  if (pathname === "/login") {
    return null;
  }

  return (
    <div className="text-sm mt-4 mb-1 lg:m-0 flex gap-5 items-center font-semibold w-full overflow-x-auto">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`transition-all ${pathname === href ? "text-blue-500" : ""} ${label === "Ward Detail" || label === "Ward Summary" ? "hidden lg:block" : ""} hover:text-blue-500 whitespace-nowrap`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default NavClient;
