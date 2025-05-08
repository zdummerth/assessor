import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import StructureModal from "@/components/ui/structures/modal";
import BuildingPermitModal from "@/components/ui/building-permits/modal";
import AppraisedValueModal from "@/components/ui/appraised-value-modal";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number";
import AppealModal from "@/components/ui/appeals/modal";
import SaleModal from "@/components/ui/sales/modal";
import AppealListItem from "../ui/appeals/list-item";
import { ArrowButton } from "@/components/ui/pagination-client";
import AppealTable from "../ui/appeals/table";
import AppealsCalendar from "../ui/appeals/calendar";

// import AppealsCalendar from "../ui/appeals/appeals-calendar";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

const applyFiltersToQuery = (
  query: any,
  appraiser: string,
  status: string,
  type: string,
  complaintType: string,
  year: string,
  hearing: string
) => {
  if (appraiser !== "Any") {
    if (appraiser === "Unassigned") {
      query = query.is("appeal_appraiser", null);
    } else {
      query = query.eq("appeal_appraiser", appraiser);
    }
  }
  if (status !== "Any") {
    query = query.eq("status", status);
  }
  if (type !== "Any") {
    query = query.eq("appeal_type", type);
  }
  if (complaintType !== "Any") {
    query = query.eq("complaint_type", complaintType);
  }
  if (year !== "Any") {
    query = query.eq("year", year);
  }
  if (hearing === "true") {
    query = query.not("hearing_ts", "is", null);
  }
  if (hearing === "false") {
    query = query.is("hearing_ts", null);
  }

  return query;
};

export default async function Appeals({
  page = 1,
  appraiser = "Any",
  status = "Any",
  type = "Any",
  complaintType = "Any",
  year = "Any",
  hearing = "Any",
}: {
  page: number;
  appraiser: string;
  status: string;
  type: string;
  complaintType: string;
  year: string;
  hearing: string;
}) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 10;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  let query = supabase.from("appeals").select(
    `*, 
        parcel_year(
          parcel_number, 
          appraised_total, 
          land_use,
          neighborhood,
          site_street_number,
          site_street_name,
          prefix_directional,
          site_zip_code
        )
      )`,
    {
      count: "exact",
      head: false,
    }
  );

  query = applyFiltersToQuery(
    query,
    appraiser,
    status,
    type,
    complaintType,
    year,
    hearing
  );
  const { data, error, count } = await query
    // .order("parcel_number", { ascending: true })
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching parcels</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-lg text-gray-500">No appeals found</p>
      </div>
    );
  }

  // check if count is null or undefined
  if (count === null || count === undefined) {
    console.error("Count is null or undefined");
    return <div>Failed to fetch count</div>;
  }

  console.log(count);

  const isLastPage = count <= limit * page;
  const currentRange = `${offset + 1}-${isLastPage ? count : offset + limit}`;
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        <ArrowButton
          pageNumber={page - 1}
          direction="left"
          isDisabled={page <= 1}
        />
        <ArrowButton
          pageNumber={page + 1}
          direction="right"
          isDisabled={isLastPage}
        />
        <span className="flex items-center gap-2 text-sm">
          <span>{currentRange}</span>
          <span className="text-gray-400">of</span>
          <span className="">{count}</span>
        </span>
      </div>
      {/* <Grid>
        {data.map((appeal: any) => {
          // const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
          return (
            <div key={appeal.parcel_number + appeal.appeal_number}>
              <AppealListItem appeal={appeal} />
            </div>
          );
        })}
      </Grid> */}
      {/* <AppealsCalendar appeals={data} /> */}
      <div className="">
        <AppealTable appeals={data} />
      </div>
    </div>
  );
}

export async function Count({
  appraiser = "Any",
  status = "Any",
  type = "Any",
  complaintType = "Any",
  year = "Any",
  hearing = "false",
}: {
  appraiser: string;
  status: string;
  type: string;
  complaintType: string;
  year: string;
  hearing: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("appeals")
    .select("*, parcel_year(parcel_number, appraised_total, neighborhood))", {
      count: "exact",
      head: true,
    });

  query = applyFiltersToQuery(
    query,
    appraiser,
    status,
    type,
    complaintType,
    year,
    hearing
  );
  const { error, count } = await query.limit(1); // I was getting timeout error without setting limit

  if (error && !count) {
    console.error("Error fetching count:", error);
    return <>Failed to fetch count</>;
  }
  return <>{count}</>;
}
