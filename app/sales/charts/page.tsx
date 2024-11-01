import { Suspense } from "react";
import SalesCharts from "@/components/ui/sales-charts";
import SalesFilters from "@/components/ui/filters-sales";

export default async function ChartsPage({
  searchParams,
}: {
  searchParams?: {
    nbrhdcode?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  return (
    <div className="w-full flex gap-4">
      <div className="w-[500px] pr-2 border-r border-foreground overflow-x-hidden">
        <SalesFilters />
      </div>
      <div className="w-full">
        <Suspense fallback={<div>loading charts...</div>}>
          <SalesCharts filters={formattedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
