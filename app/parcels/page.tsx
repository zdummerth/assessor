import Filter from "@/components/ui/filter";
import { Suspense } from "react";
import ParcelsTable from "@/components/ui/parcels-table";
import Pagination from "@/components/ui/pagination";
import { getPagesCount } from "@/lib/data";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    landuse?: string;
    cda?: string;
    tif?: string;
    page?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await getPagesCount(formattedSearchParams);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full flex gap-4">
        <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
          <div className="border-b border-foreground py-8">
            <Suspense fallback={<div>loading filter...</div>}>
              <Filter label="Occupancy" urlParam="landuse" />
            </Suspense>
          </div>
          <div className="border-b border-foreground py-8">
            <Suspense fallback={<div>loading filter...</div>}>
              <Filter label="Neighborhood" urlParam="cda" />
            </Suspense>
          </div>
          <div className="border-b border-foreground pb-4">
            <h2 className="font-bold text-2xl mb-4">Filter Instructions</h2>
            <ul className="list-disc list-inside mt-4">
              <li>
                To select a filter, search for the desired value in the search
                bar.
              </li>
              <li>Selected filters will be displayed in blue.</li>
              <li>To remove a filter, click the blue selected filter.</li>
              <li>
                Ex. If 1110 and 1120 are selected for occupancy and Shaw is
                selected for neighborhood, it will return stats for parcels that
                are either 1120 or 1130 in Shaw.
              </li>
              <li>
                Ex. If 1110 and 1120 are selected for occupancy and Shaw and
                Boulevard Heights are selected for neighborhood, it will return
                stats for parcels that are either 1110 or 1120 in Shaw or
                Boulevard Heights.
              </li>
              <li>If no filters are selected, all parcels will be returned.</li>
            </ul>
          </div>
        </div>
        <div className="w-full">
          <h2 className="font-bold text-2xl mb-4">Parcels</h2>
          <Suspense fallback={<div>loading parcels...</div>}>
            <ParcelsTable
              filters={formattedSearchParams}
              currentPage={currentPage}
            />
          </Suspense>
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
