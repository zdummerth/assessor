import { ITEMS_PER_PAGE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { MapPin, ArrowUp, ArrowDown, Flame, ArrowRight } from "lucide-react";
import ModalForm from "../form-modal";
import Link from "next/link";

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
  percent_change: "*, parcel_review_sales(*), current_structures(*)",
  fire: "*, parcel_review_sales(*), current_structures(*)",
  fire_percent_change: "*, parcel_review_sales(*), current_structures(*)",
  sale_reviews: "*, parcel_review_sales!inner(*), current_structures(*)",
  sales: "*, parcel_review_sales!inner(*), current_structures(*)",
  abated: "*, parcel_review_abatements!inner(*), current_structures(*)",
};

const FormattedDate = ({
  date,
  className = "",
  showTime,
}: {
  date: string;
  className?: string;
  showTime?: boolean;
}) => {
  const localDate = new Date(date);
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = localDate
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
    .toLowerCase();
  return (
    <p className={className}>
      {formattedDate} {formattedTime && showTime ? formattedTime : ""}
    </p>
  );
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

  // console.log(data[0].current_structures);

  return (
    <div className="w-full flex">
      <Grid>
        {data.map((parcel: any) => {
          const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
          return (
            <Card key={parcel.parcel_number}>
              <div className="mt-2 flex flex-col items-center border-b border-foreground pb-3">
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
              <div className="pb-3">
                <div className="mt-2 flex items-center justify-between">
                  <span>{parcel.occupancy}</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/parcels/${parcel.parcel_number}`}
                      target="_blank"
                    >
                      <span>{parcel.parcel_number}</span>
                    </Link>
                    <CopyToClipboard text={parcel.parcel_number} />
                  </div>
                  <span>{parcel.neighborhood}</span>
                </div>
                <p className="text-sm">{parcel.prop_class}</p>
                <p className="mt-6 text-center">Structures</p>
                {parcel.current_structures?.length > 0 && (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    {parcel.current_structures.map(
                      (structure: any, index: number) => {
                        return (
                          <div
                            key={structure.parcel_number + index}
                            className="grid grid-cols-3 border border-foreground rounded-md p-2 w-full"
                          >
                            <div className="justify-self-start">
                              <div className="text-xs">Total Area</div>
                              <div>{structure.total_area} sqft</div>
                            </div>
                            <div className="justify-self-center text-center">
                              <div className="text-xs">GLA</div>
                              <div>{structure.gla} sqft</div>
                            </div>
                            <div className="justify-self-end text-right">
                              <div className="text-xs">CDU</div>
                              <div>{structure.cdu || "NA"}</div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="my-2">Appraised Values</p>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 items-center justify-center gap-8 border border-foreground rounded-md p-2">
                    <span className="text-xs justify-self-start">Current</span>
                    <span>
                      ${parcel.working_appraised_total_2025.toLocaleString()}
                    </span>
                    <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
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
                  <div className="grid grid-cols-3 items-center justify-center gap-8 border border-foreground rounded-md p-2">
                    <span className="text-xs justify-self-start">2025</span>
                    <span>${parcel.appraised_total_2025.toLocaleString()}</span>
                    <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
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
                  <div className="grid grid-cols-3 items-center justify-between border border-foreground rounded-md p-2">
                    <span className="text-xs justify-self-start">2024</span>
                    <span>${parcel.appraised_total_2024.toLocaleString()}</span>
                  </div>
                </div>
                {parcel.fire_time && (
                  <div className="flex items-center justify-between border border-foreground rounded-md p-2 mt-6">
                    <div className="flex gap-2 items-center">
                      <Flame size={16} className="text-red-500" />
                      <p>Fire</p>
                    </div>

                    <FormattedDate
                      date={parcel.fire_time}
                      className="text-sm"
                    />
                  </div>
                )}
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
                  <div className="flex flex-col gap-2 items-center justify-center mt-6">
                    <p className="">Sales</p>
                    {parcel.parcel_review_sales.map((sale: any) => {
                      return (
                        <div
                          key={sale.document_number + parcel.parcel_number}
                          className="border border-foreground rounded-md p-2 w-full"
                        >
                          <div className="flex justify-between items-center gap-2">
                            {sale.sale_type ? (
                              <span className="text-sm">{sale.sale_type}</span>
                            ) : (
                              <span className="text-sm">Pending Sale Type</span>
                            )}
                            <FormattedDate
                              className="text-sm"
                              date={sale.date_of_sale}
                            />
                          </div>
                          <span>
                            ${sale.net_selling_price?.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
