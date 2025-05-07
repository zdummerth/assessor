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
import AppealsCalendar from "../ui/appeals/appeals-calendar";

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
  } else if (hearing === "false") {
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
  hearing = "false",
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
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  // let query = supabase
  //   .from("parcel_reviews_2025")
  //   .select(
  //     "*, parcel_review_appeals!inner(*), current_structures(*), bps(*), parcel_review_sales(*)"
  //   );

  let query = supabase
    .from("appeals")
    .select("*, parcel_year(parcel_number, appraised_total, neighborhood))");

  query = applyFiltersToQuery(
    query,
    appraiser,
    status,
    type,
    complaintType,
    year,
    hearing
  );
  const { data, error } = await query
    // .order("parcel_number", { ascending: true })
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching parcels</p>
        <p>{error.message}</p>
      </div>
    );
  }

  console.log(data[0]);

  return (
    <div className="w-full flex">
      <Grid>
        {data.map((appeal: any) => {
          // const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
          return (
            <div key={appeal.parcel_number + appeal.appeal_number}>
              <AppealListItem appeal={appeal} />
            </div>
          );
        })}
      </Grid>
      {/* <AppealsCalendar appeals={data} /> */}
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
