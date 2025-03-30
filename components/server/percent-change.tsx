import { ITEMS_PER_PAGE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { MapPin, ArrowUp, ArrowDown, Flame } from "lucide-react";
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
    case "appeals":
      query.gte("parcel_review_appeals.case_year", 2020);
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
  sale_reviews: "*, parcel_review_sales!inner(*)",
  sales: "*, parcel_review_sales!inner(*)",
  appeals:
    "*, parcel_review_appeals!inner(*), parcel_review_sales(sale_type, date_of_sale, net_selling_price)",
  abated: "*, parcel_review_abatements!inner(*)",
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

  const supabase = createClient();

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

  return (
    <div className="w-full flex">
      <Grid>
        {data.map((parcel: any) => {
          const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
          return (
            <Card key={parcel.parcel_number}>
              <div className="mt-2 flex flex-col items-center border-b pb-3">
                <div className="flex items-center justify-between gap-4 w-full">
                  <p className="">{displayAddress}</p>
                  <div className="flex gap-2">
                    <CopyToClipboard text={displayAddress} />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${displayAddress}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MapPin
                        size={18}
                        className="hover:text-blue-500 transition-colors"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="border-b pb-3">
                <div className="mt-2 flex items-center justify-between">
                  <span>{parcel.occupancy}</span>
                  <div className="flex gap-2">
                    <span>{parcel.parcel_number}</span>
                    <CopyToClipboard text={parcel.parcel_number} />
                  </div>
                  <span>{parcel.neighborhood}</span>
                </div>
                <p className="text-sm">{parcel.prop_class}</p>
              </div>
              <div className="text-center">
                <p className="mb-2">Appraised Values</p>
                <div className="flex justify-between flex-wrap">
                  <div className="flex flex-col items-center border rounded-lg p-2">
                    <span className="text-xs">2024</span>
                    <span>${parcel.appraised_total_2024.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center border rounded-lg p-2">
                    <span className="text-xs">2025</span>
                    <span>${parcel.appraised_total_2025.toLocaleString()}</span>
                    <div className="flex gap-1 items-center justify-center text-sm mt-1">
                      {parcel.percent_change > 0 ? (
                        <ArrowUp size={12} className="text-green-500" />
                      ) : (
                        <ArrowDown size={12} className="text-red-500" />
                      )}
                      <p>
                        {parcel.percent_change.toFixed(2).toLocaleString()}%
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center border rounded-lg p-2">
                    <span className="text-xs">Total Value</span>
                    <span>
                      ${parcel.working_appraised_total_2025.toLocaleString()}
                    </span>
                    <div className="flex gap-1 items-center justify-center text-sm mt-1">
                      {parcel.working_percent_change > 0 ? (
                        <ArrowUp size={12} className="text-green-500" />
                      ) : (
                        <ArrowDown size={12} className="text-red-500" />
                      )}
                      <p>
                        {parcel.working_percent_change
                          .toFixed(2)
                          .toLocaleString()}
                        %
                      </p>
                    </div>
                  </div>
                </div>
                {parcel.fire_time && (
                  <div className="flex flex-col items-center justify-center border-t pt-2 mt-2">
                    <div className="flex gap-2 items-center">
                      <Flame size={18} className="text-red-500" />
                      <p>Fire</p>
                    </div>
                    <p>
                      {(() => {
                        const date = new Date(parcel.fire_time);
                        const formattedDate = date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        const formattedTime = date
                          .toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          })
                          .toLowerCase();
                        return `${formattedDate}, ${formattedTime}`;
                      })()}
                    </p>
                  </div>
                )}
                {parcel.parcel_review_abatements?.length > 0 && (
                  <div className="flex flex-col items-center justify-center border-t pt-2 mt-2">
                    <p>Abatements</p>
                    <div className="flex flex-wrap justify-between gap-2 items-center pt-2">
                      {parcel.parcel_review_abatements.map((abate: any) => {
                        return (
                          <div
                            key={abate.name + parcel.parcel_number}
                            className="flex flex-col gap-2 items-center border rounded-lg p-2"
                          >
                            <span className="text-xs">
                              Program: {abate.name}
                            </span>
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
                {parcel.parcel_review_sales?.length > 0 && (
                  <div className="flex flex-col items-center justify-center border-t pt-2 mt-2">
                    <p>Sales</p>
                    <div className="flex flex-wrap justify-between gap-2 items-center pt-2">
                      {parcel.parcel_review_sales.map((sale: any) => {
                        return (
                          <div
                            key={sale.document_number + parcel.parcel_number}
                            className="flex flex-col gap-2 items-center border rounded-lg p-2"
                          >
                            <span className="text-xs">{sale.date_of_sale}</span>
                            {sale.sale_type ? (
                              <span className="text-xs">{sale.sale_type}</span>
                            ) : (
                              <span className="text-xs">Pending Sale Type</span>
                            )}
                            <span>
                              ${sale.net_selling_price.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {parcel.parcel_review_appeals && (
                  <div className="flex flex-col items-center justify-center border-t pt-2 mt-2">
                    <p>Appeals</p>
                    <div className="flex flex-wrap justify-between gap-2 items-center pt-2">
                      {parcel.parcel_review_appeals.map((appeal: any) => {
                        return (
                          <div
                            key={appeal.appeal_number + parcel.parcel_number}
                            className="flex flex-col gap-2 items-center border rounded-lg p-2"
                          >
                            <span className="text-xs">{appeal.case_year}</span>
                            <div className="flex gap-2 items-center">
                              <span>
                                ${appeal.after_total.toLocaleString()}
                              </span>
                              <span>{appeal.status_code}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
  const supabase = createClient();

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
