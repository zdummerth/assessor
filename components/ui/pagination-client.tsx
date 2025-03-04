"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export const createPageURL = (
  pageNumber: number,
  searchParams: any,
  pathname: string
) => {
  const params = new URLSearchParams(searchParams);
  params.set("page", pageNumber.toString());
  return `${pathname}?${params.toString()}`;
};

export const ArrowButton = ({
  direction,
  pageNumber,
  isDisabled,
}: {
  direction: "left" | "right";
  pageNumber: number;
  isDisabled: boolean;
}) => {
  "use client";
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const content =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
    }
  );

  return isDisabled ? (
    <div className={className}>{content}</div>
  ) : (
    <Link
      href={createPageURL(pageNumber, searchParams, pathname)}
      scroll={false}
    >
      <button type="button" className={className}>
        {content}
      </button>
    </Link>
  );
};

export const PaginationInput = ({ currentPage }: { currentPage: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const jumpToPage = (newPage: number) => {
    if (newPage < 1) newPage = 1;
    // if (newPage > totalPages) newPage = totalPages;
    router.replace(createPageURL(newPage, searchParams, pathname));
  };

  const handleInputBlur = () => {
    jumpToPage(Number(inputValue));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      jumpToPage(Number(inputValue));
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyDown}
      min={1}
      // max={totalPages}
      className="w-12 text-center border rounded-md p-[1px]"
    />
  );
};

export default function PaginationClient({
  totalPages,
}: {
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Jump to the new page (with clamping)
  const jumpToPage = (newPage: number) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    router.replace(createPageURL(newPage, searchParams, pathname));
  };

  // On blur or Enter key, trigger a jump to the page entered
  const handleInputBlur = () => {
    jumpToPage(currentPage);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      jumpToPage(currentPage);
    }
  };

  // Render arrow button. When disabled, we render a <div> instead of a Link.

  return (
    <div className="flex items-center space-x-2">
      <ArrowButton
        direction="left"
        pageNumber={currentPage - 1}
        isDisabled={currentPage <= 1}
      />

      <input
        type="number"
        defaultValue={currentPage}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        min={1}
        max={totalPages}
        className="w-16 text-center border rounded-md p-1"
      />

      <ArrowButton
        direction="right"
        pageNumber={currentPage + 1}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}
