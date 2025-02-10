import { Suspense } from "react";
import Pagination from "@/components/ui/pagination";
import { getPagesCount } from "@/lib/data";
import SalesTable from "@/components/ui/sales-table";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    occupnacy?: string;
    page?: string;
    saleColumns?: string;
    sort?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const currentPage = Number(searchParams?.page) || 1;

  const { totalPages } = await getPagesCount(formattedSearchParams, "sales");

  return (
    <div className="w-full flex gap-4">
      <div className="w-full">
        <Suspense fallback={<div>loading parcels...</div>}>
          <SalesTable
            filters={formattedSearchParams}
            currentPage={currentPage}
            sort={searchParams?.sort}
          />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          {/* <Pagination totalPages={totalPages} /> */}
        </div>
      </div>
    </div>
  );
}
