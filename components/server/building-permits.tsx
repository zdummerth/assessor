import { createClient } from "@/utils/supabase/server";
import { Grid, Card } from "@/components/ui/grid";
import StructureModal from "../ui/structure-modal";
import BuildingPermitModal from "../ui/building-permit-modal";
import AppraisedValueModal from "../ui/appraised-value-modal";
import Address from "../ui/address";
import ParcelNumber from "../ui/parcel-number";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

const applyFiltersToQuery = (
  query: any,
  status: string,
  type: string,
  year: string
) => {
  if (status !== "Any") {
    query = query.eq("bps.status", status);
  }
  if (type !== "Any") {
    query = query.eq("bps.permit_type", type);
  }
  if (year !== "Any") {
    query = query.eq("bps.year", year);
  }
  return query;
};

export default async function BuildingPermits({
  page = 1,
  status = "Any",
  type = "Any",
  year = "Any",
}: {
  page: number;
  status: string;
  type: string;
  year: string;
}) {
  // const limit = ITEMS_PER_PAGE;
  const limit = 9;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();

  let query = supabase
    .from("parcel_reviews_2025")
    .select("*, bps!inner(*), current_structures(*)");

  query = applyFiltersToQuery(query, status, type, year);
  const { data, error } = await query
    .order("parcel_number", { ascending: true })
    .range(offset, endingPage);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching building permits</p>
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
              <div className="mt-2 flex flex-col items-center border-b border-foreground pb-3">
                <Address address={displayAddress} />
              </div>
              <div className="pb-3">
                <div className="mt-2 flex items-center justify-between">
                  <span>{parcel.occupancy}</span>
                  <ParcelNumber parcelNumber={parcel.parcel_number} />
                  <span>{parcel.neighborhood}</span>
                </div>
                <p className="text-sm">{parcel.prop_class}</p>

                <div className="mt-6">
                  <AppraisedValueModal
                    parcel={parcel}
                    address={displayAddress}
                  />
                </div>
                <div className="mt-2">
                  <StructureModal
                    structures={parcel.current_structures}
                    address={displayAddress}
                    parcelNumber={parcel.parcel_number}
                  />
                </div>
                <div className="mt-2">
                  <BuildingPermitModal
                    permits={parcel.bps}
                    address={displayAddress}
                    parcelNumber={parcel.parcel_number}
                  />
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

  // query = applyFiltersToQuery(
  //   query,
  //   appraiser,
  //   status,
  //   type,
  //   complaintType,
  //   year
  // );
  const { error, count } = await query.limit(1); // I was getting timeout error without setting limit

  if (error && !count) {
    console.error("Error fetching count:", error);
    return <>Failed to fetch count</>;
  }
  return <>{count}</>;
}
