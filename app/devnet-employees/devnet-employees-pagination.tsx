"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DevnetEmployeesPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function DevnetEmployeesPagination({
  currentPage,
  totalPages,
}: DevnetEmployeesPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {currentPage > 2 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(createPageURL(1))}
            >
              1
            </Button>
            {currentPage > 3 && <span className="px-2">...</span>}
          </>
        )}

        {currentPage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageURL(currentPage - 1))}
          >
            {currentPage - 1}
          </Button>
        )}

        <Button variant="default" size="sm">
          {currentPage}
        </Button>

        {currentPage < totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageURL(currentPage + 1))}
          >
            {currentPage + 1}
          </Button>
        )}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(createPageURL(totalPages))}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
