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
    columns?: string;
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

  const tableToLabelMap: any = {
    asrlanduse1: "Occupancy",
    nbrhd: "CDA Neighborhood",
    asrnbrhd: "Assessor Neighborhood",
    ward20: "Ward",
    tifdist: "TIF",
    isabatedproperty: "Abated",
    asdtotal: "Total Assessed",
    aprland: "Appraised Land",
    aprresimprove: "Appraised Res Improvements",
    aprcomimprove: "Appraised Com Improvements",
    aprcomland: "Appraised Com Land",
    aprresland: "Appraised Res Land",
    apragrimprove: "Appraised Agr Improvements",
    apragrland: "Appraised Agr Land",
    aprexemptimprove: "Appraised Exempt Improvements",
    aprexemptland: "Appraised Exempt Land",
  };

  // Default to showing the parcel I

  // console.log(formattedSearchParams.columns);

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
        </div>
        <div className="w-full">
          <h2 className="font-bold text-2xl mb-4">Parcels</h2>
          <Suspense fallback={<div>loading parcels...</div>}>
            <ParcelsTable
              filters={formattedSearchParams}
              currentPage={currentPage}
              columns={formattedSearchParams.columns || []}
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
