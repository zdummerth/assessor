import { getFilteredData } from "@/lib/data";
import { SearchX } from "lucide-react";
import ParcelsGrid from "./parcel-grid";
import ParcelSearchResultsMap from "./parcel-search-results-map";
import { ValueCard } from "./report-cards";

export default async function ParcelSearchResults({
  query,
  filters,
  selectString,
  get_count,
  table,
  currentPage = 1,
  view,
  limit,
}: {
  query?: string;
  filters: any;
  selectString?: string;
  get_count?: boolean;
  table?: string;
  currentPage?: number;
  view: "grid" | "map" | "summary";
  limit: number;
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
    limit,
  });

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcels</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // const uniqueNeighborhoodsArray = Object.values(uniqueNeighborhoods);

  if (data.length > 0) {
    // console.log(data[0]);
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
      {view === "grid" && <ParcelsGrid parcels={data} />}
      <div className="relative z-[1]">
        {view === "map" && <ParcelSearchResultsMap data={data} />}
      </div>
      {view === "summary" && <ValueCard filters={filters} />}
    </div>
  );
}
