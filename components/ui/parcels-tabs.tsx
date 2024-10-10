"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

export default function ParcelTabs({ searchParams }: { searchParams?: any }) {
  const currentPath = usePathname();
  const activeClassName = "border-b-2 border-blue-500 pb-2 font-bold text-lg";
  return (
    <div className="flex gap-4 mb-8">
      <Link
        href={{
          pathname: "/",
          query: searchParams,
        }}
        className={clsx(currentPath === "/" && activeClassName)}
      >
        {"Totals"}
      </Link>
      <Link
        href={{
          pathname: "/breakdown",
          query: searchParams,
        }}
        className={clsx(currentPath === "/breakdown" && activeClassName)}
      >
        {"Breakdown"}
      </Link>
      <Link
        href={{
          pathname: "/parcels",
          query: searchParams,
        }}
        className={clsx(currentPath === "/parcels" && activeClassName)}
      >
        {"Table"}
      </Link>
    </div>
  );
}
