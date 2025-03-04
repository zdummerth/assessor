import { getFilteredData } from "@/lib/data";
import { SearchX } from "lucide-react";
import ParcelsGrid from "./parcel-grid";

export default async function ParcelSearchResults({
  query,
  filters,
  selectString,
  get_count,
  table,
  currentPage = 1,
}: {
  query?: string;
  filters: any;
  selectString?: string;
  get_count?: boolean;
  table?: string;
  currentPage?: number;
}) {
  const { data, error } = await getFilteredData({
    filters,
    sortColumn: filters.sortColumn ? filters.sortColumn[0] : "parcel_number",
    sortDirection: filters.sortDirection ? filters.sortDirection[0] : "asc",
    currentPage,
    selectString: selectString,
    get_count,
    table: table || "search_site_addresses",
    searchString: query,
  });

  if (error && !data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="">
      {data.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-16">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-center">
            No parcels found for search term: <strong>{query}</strong>
          </p>
        </div>
      )}
      <ParcelsGrid parcels={data} />
    </div>
  );
}
