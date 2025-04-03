import { createClient } from "@/utils/supabase/server";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { MapPin, ArrowUp, ArrowDown, Flame, ArrowRight } from "lucide-react";
import ModalForm from "@/components/form-modal";
import type { Metadata, ResolvingMetadata } from "next";
import { Grid, Card } from "@/components/ui/grid";

// import MultipolygonMapWrapper from "../ui/maps/wrapper";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return {
    title: id,
  };
}

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
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parcel_reviews_2025")
    .select(
      "*, parcel_review_appeals(*), parcel_review_sales(*), parcel_review_abatements(*), current_structures(*)"
    )
    .eq("parcel_number", params.id)
    .single();

  // console.log({ data, error });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching parcels</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // console.log(data[0].current_structures);

  const parcel = data;
  const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4">
      <div className="mt-2 flex flex-col items-center border-b pb-3 w-full">
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

      <div className="border-b pb-3 w-full">
        <div className="mt-2 flex items-center justify-between">
          <span>{parcel.occupancy}</span>
          <div className="flex gap-2">
            <span>{parcel.parcel_number}</span>
            <CopyToClipboard text={parcel.parcel_number} />
          </div>
          <span>{parcel.neighborhood}</span>
        </div>
        <p className="text-sm">{parcel.prop_class}</p>
        {parcel.current_structures?.length > 0 && (
          <div className="flex flex-col gap-2 w-full mt-2">
            {parcel.current_structures.map((structure: any, index: number) => {
              return (
                <div
                  key={structure.parcel_number + index}
                  className="grid grid-cols-3 border rounded-md p-2 w-full"
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
            })}
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <p className="my-2">Appraised Values</p>

        <div className="flex flex-col gap-2 mb-8">
          <div className="grid grid-cols-3 items-center justify-center gap-8 border rounded-md p-2">
            <span className="text-xs justify-self-start">Current</span>
            <span>${parcel.working_appraised_total_2025.toLocaleString()}</span>
            <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
              {parcel.working_percent_change > 0 ? (
                <ArrowUp size={12} className="text-green-500" />
              ) : (
                <ArrowDown size={12} className="text-red-500" />
              )}
              <p>
                {parcel.working_percent_change.toFixed(2).toLocaleString()}%
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center justify-center gap-8 border rounded-md p-2">
            <span className="text-xs justify-self-start">2025</span>
            <span>${parcel.appraised_total_2025.toLocaleString()}</span>
            <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
              {parcel.percent_change > 0 ? (
                <ArrowUp size={12} className="text-green-500" />
              ) : (
                <ArrowDown size={12} className="text-red-500" />
              )}
              <p>{parcel.percent_change.toFixed(2).toLocaleString()}%</p>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center justify-between border rounded-md p-2">
            <span className="text-xs justify-self-start">2024</span>
            <span>${parcel.appraised_total_2024.toLocaleString()}</span>
          </div>
        </div>
        {parcel.fire_time && (
          <div className="flex items-center justify-between border rounded-md p-2">
            <div className="flex gap-2 items-center">
              <Flame size={16} className="text-red-500" />
              <p>Fire</p>
            </div>

            <FormattedDate date={parcel.fire_time} className="text-sm" />
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
        {parcel.parcel_review_sales?.length > 0 && (
          <div className="flex flex-col gap-2 items-center justify-center mt-2">
            <p className="mb-2">Sales</p>
            {parcel.parcel_review_sales.map((sale: any) => {
              return (
                <div
                  key={sale.document_number + parcel.parcel_number}
                  className="border rounded-lg p-2 w-full"
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
                  <span>${sale.net_selling_price?.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
        {parcel.parcel_review_appeals?.length > 0 && (
          <div className="flex flex-col items-center justify-center border-t pt-2 mt-2 w-full">
            <p>Appeals</p>
            <div className="flex flex-col gap-2 items-center pt-2 w-full">
              {parcel.parcel_review_appeals.map((appeal: any) => {
                return (
                  <div
                    key={appeal.appeal_number + parcel.parcel_number}
                    className="flex flex-col gap-2 items-center border rounded-lg p-2 w-full"
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
                      <span>${appeal.before_total.toLocaleString()}</span>
                      <ArrowRight size={12} className="text-gray-500" />
                      <span>${appeal.after_total.toLocaleString()}</span>
                    </div>
                    {appeal.hearing_ts && (
                      <div>
                        <span className="text-xs">Hearing</span>
                        <FormattedDate date={appeal.hearing_ts} showTime />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center mt-8">
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
    </div>
  );
}
