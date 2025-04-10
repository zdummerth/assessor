import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import { Flame, CircleOff } from "lucide-react";
import ModalForm from "../form-modal";
import FormattedDate from "../ui/formatted-date";
import StructureModal from "@/components/ui/structures/modal";
import BuildingPermitModal from "../ui/building-permit-modal";
import AppraisedValueModal from "../ui/appraised-value-modal";
import SalesModal from "../ui/sales-modal";
import Address from "../ui/address";
import ParcelNumber from "../ui/parcel-number";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

const applyFiltersToQuery = (query: any, filter: string) => {
  query.eq("tax_status", "T");
  switch (filter) {
    case "percent_change":
      query.gte("percent_change", 15);
      break;
    case "fire":
      query.not("fire_time", "is", null);
      break;
    case "fire_percent_change":
      query.not("fire_time", "is", null).gte("percent_change", 15);
      break;
    case "dif":
      query.gt("current_value_difference", 0);
      break;
    case "abated":
      query.gte("parcel_review_abatements.year_expires", 2025);
      break;
    case "sales":
      query.gte("parcel_review_sales.sale_year", 2021);
      break;
    case "sale_reviews":
      query
        .gte("parcel_review_sales.sale_year", 2021)
        .is("parcel_review_sales.sale_type", null);
      break;
    case "all":
      query.or("fire_time.not.is.null,percent_change.gte.15");
      break;
    default:
      break;
  }

  return query;
};

const filterSelects = {
  all: "*, parcel_review_sales(*), current_structures(*)",
  percent_change: "*, parcel_review_sales(*), current_structures(*), bps(*)",
  fire: "*, parcel_review_sales(*), current_structures(*), bps(*)",
  fire_percent_change:
    "*, parcel_review_sales(*), current_structures(*), bps(*)",
  sale_reviews:
    "*, parcel_review_sales!inner(*), current_structures(*), bps(*)",
  sales: "*, parcel_review_sales!inner(*), current_structures(*), bps(*)",
  abated: "*, parcel_review_abatements!inner(*), current_structures(*), bps(*)",
};

export default async function AppraiserPercentChange({
  page = 1,
  appraiserId,
  filter = "all",
}: {
  page: number;
  appraiserId: number;
  filter: string;
}) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  let query = supabase.from("parcel_reviews_2025").select(
    //@ts-ignore
    filterSelects[filter] || "*"
  );

  query = applyFiltersToQuery(query, filter);
  query = query.eq("appraiser_id", appraiserId);
  const { data, error, count } = await query
    .order("parcel_number", { ascending: true })
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
        {data.map((parcel: any) => {
          const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
          return (
            <Card key={parcel.parcel_number}>
              <div className="mt-2 border-b border-foreground pb-3">
                <Address address={displayAddress} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>{parcel.occupancy}</span>
                <ParcelNumber parcelNumber={parcel.parcel_number} />
                <span>{parcel.neighborhood}</span>
              </div>
              <p className="text-sm">{parcel.prop_class}</p>
              <div className="mt-6">
                <AppraisedValueModal parcel={parcel} address={displayAddress} />
              </div>
              <div className="mt-2">
                <StructureModal
                  structures={parcel.current_structures}
                  address={displayAddress}
                  parcelNumber={parcel.parcel_number}
                />
              </div>
              <div className="mt-2">
                <SalesModal
                  sales={parcel.parcel_review_sales}
                  address={displayAddress}
                  parcelNumber={parcel.parcel_number}
                />
              </div>

              <div className="mt-2">
                {parcel.fire_time ? (
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-700 text-white w-full hover:bg-zinc-600 rounded-md border border-red-500">
                    <div className="flex gap-2 items-center">
                      <Flame size={16} className="text-red-500" />
                      <p>Fire</p>
                    </div>

                    <FormattedDate
                      date={parcel.fire_time}
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 text-white w-full hover:bg-zinc-600 rounded-md">
                    <CircleOff size={16} className="text-green-500" />
                    <span className="text-sm">No Fires</span>
                  </div>
                )}
              </div>
              {parcel.parcel_review_abatements?.length > 0 && (
                <div className="flex flex-col items-center justify-center pt-2 mt-6">
                  <p>Abatements</p>
                  <div className="flex flex-wrap justify-between gap-2 items-center pt-2">
                    {parcel.parcel_review_abatements.map((abate: any) => {
                      return (
                        <div
                          key={abate.name + parcel.parcel_number}
                          className="flex flex-col gap-2 items-center border rounded-lg p-2"
                        >
                          <span className="text-xs">Program: {abate.name}</span>
                          <div>
                            <span>{abate.year_created}</span>
                            <span>-</span>
                            <span>{abate.year_expires}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center justify-center pt-2 mt-8">
                <div className="flex gap-2 items-center">
                  <div>Notes</div>
                  <ModalForm
                    header={parcel.parcel_number}
                    subHeader={displayAddress}
                    parcelNumber={parcel.parcel_number}
                    note={parcel.data_collection}
                  />
                </div>
                <p className="text-sm">{parcel.data_collection}</p>
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}

export async function AppraiserPercentChangeCount({
  appraiserId,
  filter = "all",
}: {
  appraiserId: number;
  filter: string;
}) {
  const supabase = await createClient();

  let query = supabase.from("parcel_reviews_2025").select(
    //@ts-ignore
    filterSelects[filter] || "*",
    {
      count: "estimated",
      head: true,
    }
  );

  query = applyFiltersToQuery(query, filter);
  query = query.eq("appraiser_id", appraiserId);
  const { error, count } = await query.limit(1); // I was getting timeout error without setting limit

  if (error && !count) {
    console.error("Error fetching count:", error);
    return <>Failed to fetch count</>;
  }
  return <>{count}</>;
}
