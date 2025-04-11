import { createClient } from "@/utils/supabase/server";
import { ArrowUp, ArrowDown, Flame } from "lucide-react";
import ModalForm from "@/components/form-modal";
import type { Metadata, ResolvingMetadata } from "next";
import FormattedDate from "@/components/ui/formatted-date";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number";
import StructureListItem from "@/components/ui/structures/list-item";
import SalesListItem from "@/components/ui/sales/list-item";
import BuildingPermitListItem from "@/components/ui/building-permits/list-item";
import AppealListItem from "@/components/ui/appeals/list-item";

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

export default async function AppraiserPercentChange({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parcel_reviews_2025")
    .select(
      "*, parcel_review_appeals(*), parcel_review_sales(*), parcel_review_abatements(*), current_structures(*), appraisers(*), bps(*)"
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
  console.log(parcel.appraisers);
  const displayAddress = `${parcel.site_street_number} ${parcel.prefix_directional || ""} ${parcel.site_street_name} ${parcel.site_zip_code || ""}`;
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-semibold mb-4">
        <ParcelNumber parcelNumber={parcel.parcel_number} />
      </h1>
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          id="detail"
          className="border p-2 rounded-md shadow-sm shadow-foreground w-full"
        >
          <p className="text-xs mb-2">Detail</p>
          <Address address={displayAddress} />
          <div>
            <div className="mt-2 flex items-center justify-between">
              <span>{parcel.occupancy}</span>
              <span>{parcel.neighborhood}</span>
            </div>
            <p className="text-sm">{parcel.prop_class}</p>
          </div>
          <div className="flex">
            <div className="flex flex-col gap-2 items-center justify-center w-full mt-2">
              <span className="text-sm">Appraiser</span>
              {/* @ts-ignore */}
              <span>{parcel.appraisers?.name}</span>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center w-full mt-2">
              <span className="text-sm">Supervisor</span>
              {/* @ts-ignore */}
              <span>{parcel.appraisers?.supervisor}</span>
            </div>
          </div>
        </div>

        <div
          id="owners"
          className="border p-2 rounded-md shadow-sm shadow-foreground w-full"
        >
          <p className="text-xs mb-2">Owners</p>
          <div>
            <div className="flex gap-2 items-center justify-between">
              <span>{parcel.owner_name}</span>
            </div>
            <p className="">{parcel.owner_address2}</p>
            {parcel.owner_address1 && (
              <p className="">{parcel.owner_address1}</p>
            )}
            <p>
              {parcel.owner_city}, {parcel.owner_state} {parcel.owner_zip}
            </p>
          </div>
        </div>

        <div
          id="values"
          className="flex flex-col gap-2 border p-2 rounded-md shadow-sm shadow-foreground w-full"
        >
          <p className="text-xs mb-2">Values</p>

          <div className="grid grid-cols-3 items-center justify-center gap-8 border-b border-foreground rounded-md p-2">
            <span className="text-xs justify-self-start">Current</span>
            <span className="justify-self-center">
              ${parcel.working_appraised_total_2025?.toLocaleString()}
            </span>
            <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
              {parcel.working_percent_change &&
              parcel.working_percent_change > 0 ? (
                <ArrowUp size={12} className="text-green-500" />
              ) : (
                <ArrowDown size={12} className="text-red-500" />
              )}
              <p>
                {parcel.working_percent_change?.toFixed(2).toLocaleString()}%
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center justify-center gap-8 border-b border-foreground rounded-md p-2">
            <span className="text-xs justify-self-start">2025</span>
            <span className="justify-self-center">
              ${parcel.appraised_total_2025?.toLocaleString()}
            </span>
            <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
              {parcel.percent_change && parcel.percent_change > 0 ? (
                <ArrowUp size={12} className="text-green-500" />
              ) : (
                <ArrowDown size={12} className="text-red-500" />
              )}
              <p>{parcel.percent_change?.toFixed(2).toLocaleString()}%</p>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center justify-between border-b border-foreground rounded-md p-2">
            <span className="text-xs justify-self-start">2024</span>
            <span className="justify-self-center">
              ${parcel.appraised_total_2024?.toLocaleString()}
            </span>
          </div>
        </div>

        <div
          id="structures"
          className="border p-2 rounded-md shadow-sm shadow-foreground w-full"
        >
          <p className="text-xs mb-2">Structures</p>
          {parcel.current_structures?.length > 0 && (
            <div className="flex flex-col gap-2 w-full mt-2">
              {parcel.current_structures.map(
                (structure: any, index: number) => {
                  return (
                    <StructureListItem
                      key={structure.parcel_number + index}
                      structure={structure}
                    />
                  );
                }
              )}
            </div>
          )}
        </div>

        <div
          id="sales"
          className="flex flex-col border p-2 rounded-md shadow-sm shadow-foreground w-full lg:max-h-96 overflow-hidden"
        >
          <p className="text-xs mb-2">Sales</p>
          <div className="flex-1 overflow-y-auto">
            {parcel.parcel_review_sales.map((sale: any) => {
              return (
                <SalesListItem
                  key={sale.document_number + parcel.parcel_number}
                  sale={sale}
                />
              );
            })}
          </div>
        </div>

        <div
          id="building-permits"
          className="flex flex-col border p-2 rounded-md shadow-sm shadow-foreground w-full lg:max-h-96 overflow-hidden"
        >
          <p className="text-xs mb-2">Building Permits</p>
          <div className="flex-1 overflow-y-auto">
            {parcel.bps.map((bp: any) => {
              return (
                <BuildingPermitListItem
                  key={bp.permit_number + parcel.parcel_number}
                  permit={bp}
                />
              );
            })}
          </div>
        </div>

        <div
          id="appeals"
          className="border p-2 rounded-md shadow-sm shadow-foreground w-full"
        >
          <p className="text-xs mb-2">Appeals</p>
          <div className="flex flex-col gap-2 w-full mt-2">
            {parcel.parcel_review_appeals.map((appeal: any, index: number) => {
              return (
                <AppealListItem
                  key={appeal.parcel_number + index}
                  appeal={appeal}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center w-full">
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
        </div>
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="flex gap-2 items-center">
            <div>Notes</div>
            <ModalForm
              header={parcel.parcel_number}
              subHeader={displayAddress}
              parcelNumber={parcel.parcel_number}
              note={parcel.data_collection || ""}
            />
          </div>
          <p className="text-sm">{parcel.data_collection}</p>
        </div>
      </div>
    </div>
  );
}
