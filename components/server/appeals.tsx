import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { MapPin, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

const applyFiltersToQuery = (
  query: any,
  appraiser: string,
  status: string,
  type: string,
  complaintType: string,
  year: string
) => {
  if (appraiser !== "Any") {
    if (appraiser === "Unassigned") {
      query = query.is("parcel_review_appeals.appeal_appraiser", null);
    } else {
      query = query.eq("parcel_review_appeals.appeal_appraiser", appraiser);
    }
  }
  if (status !== "Any") {
    query = query.eq("parcel_review_appeals.status", status);
  }
  if (type !== "Any") {
    query = query.eq("parcel_review_appeals.appeal_type", type);
  }
  if (complaintType !== "Any") {
    query = query.eq("parcel_review_appeals.complaint_type", complaintType);
  }
  if (year !== "Any") {
    query = query.eq("parcel_review_appeals.year", year);
  }
  return query;
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

export default async function Appeals({
  page = 1,
  appraiser = "Any",
  status = "Any",
  type = "Any",
  complaintType = "Any",
  year = "Any",
}: {
  page: number;
  appraiser: string;
  status: string;
  type: string;
  complaintType: string;
  year: string;
}) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  let query = supabase
    .from("parcel_reviews_2025")
    .select("*, parcel_review_appeals!inner(*), current_structures(*)");

  query = applyFiltersToQuery(
    query,
    appraiser,
    status,
    type,
    complaintType,
    year
  );
  const { data, error } = await query
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
                {parcel.current_structures?.length > 0 && (
                  <div className="flex flex-col items-center gap-2 w-full mt-6">
                    <p>Structures</p>
                    {parcel.current_structures.map(
                      (structure: any, index: number) => {
                        return (
                          <div
                            key={structure.parcel_number + index}
                            className="grid grid-cols-3 border border-foreground rounded-md p-2 w-full"
                          >
                            <div className="justify-self-start">
                              <div className="text-xs">Total Area</div>
                              <div>
                                {structure.total_area.toLocaleString()} sqft
                              </div>
                            </div>
                            <div className="justify-self-center text-center">
                              <div className="text-xs">GLA</div>
                              <div>{structure.gla.toLocaleString()} sqft</div>
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
                {parcel.parcel_review_appeals && (
                  <div className="flex flex-col items-center justify-center pt-2 mt-6 w-full">
                    <p>Appeals</p>
                    <div className="flex flex-col gap-2 items-center pt-2 w-full">
                      {parcel.parcel_review_appeals.map((appeal: any) => {
                        return (
                          <div
                            key={appeal.appeal_number + parcel.parcel_number}
                            className="flex flex-col gap-2 items-center border border-foreground rounded-lg p-2 w-full"
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-xs">{appeal.year}</span>
                              <div className="flex gap-2 items-center">
                                <div>{appeal.appeal_number}</div>
                                <CopyToClipboard
                                  text={appeal.appeal_number
                                    .toString()
                                    .padStart(10, "0")}
                                />
                              </div>
                            </div>
                            <div className="flex justify-around gap-4 items-center w-full">
                              <div className="flex flex-col gap-1">
                                {/* <p className="text-xs">Type</p> */}
                                <p>{appeal.appeal_type}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                {/* <p className="text-xs">Status</p> */}
                                <p>{appeal.status}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <span>
                                ${appeal.before_total.toLocaleString()}
                              </span>
                              <ArrowRight size={12} className="text-gray-500" />
                              <span>
                                ${appeal.after_total.toLocaleString()}
                              </span>
                            </div>
                            {appeal.hearing_ts && (
                              <div>
                                <span className="text-xs">Hearing</span>
                                <FormattedDate
                                  date={appeal.hearing_ts}
                                  showTime
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="mt-10 mb-2">Appraised Values</p>
                <div className="flex flex-col gap-2 mb-8">
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
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}

export async function Count({
  appraiser = "Any",
  status = "Any",
  type = "Any",
  complaintType = "Any",
  year = "Any",
}: {
  appraiser: string;
  status: string;
  type: string;
  complaintType: string;
  year: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("parcel_reviews_2025")
    .select("*, parcel_review_appeals!inner(*)", {
      count: "exact",
      head: true,
    });

  query = applyFiltersToQuery(
    query,
    appraiser,
    status,
    type,
    complaintType,
    year
  );
  const { error, count } = await query.limit(1); // I was getting timeout error without setting limit

  if (error && !count) {
    console.error("Error fetching count:", error);
    return <>Failed to fetch count</>;
  }
  return <>{count}</>;
}
