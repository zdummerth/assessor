"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  const links = [
    // { href: "/appeals", label: "Appeals" },
    // { href: "/sales", label: "Sales" },
    // { href: "/appraisers", label: "Appraisers" },
    // { href: "/building-permits", label: "Permits" },
    { href: "/wards/summary/test", label: "Wards" },
    { href: "/cdas/summary", label: "CDAs" },
    { href: "/pdf-editor", label: "PDF Tools" },
    { href: "/notices/decision-letter", label: "Decision Letter" },
  ];

  return (
    <div className="text-sm mt-4 mb-1 lg:m-0 flex gap-5 items-center font-semibold w-full overflow-x-auto">
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </div>
  );
};

export default Page;
