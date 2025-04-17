import { createClient } from "@/utils/supabase/server";
import { ArrowUp, ArrowDown, Flame } from "lucide-react";
import ModalForm from "@/components/form-modal";
import type { Metadata, ResolvingMetadata } from "next";
import TogglePaid, { TestPaid } from "@/components/ui/invoices/toggle-paid";
import Update from "@/components/ui/invoices/update";
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

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .single();

  // console.log({ data, error });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching invoice</p>
        <p>{error.message}</p>
      </div>
    );
  }

  // console.log(data);
  return (
    <div className="w-full p-4">
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          id="detail"
          className="border p-2 rounded-md shadow-sm shadow-foreground w-full"
        >
          <div className="flex gap-4 items-center mb-6 text-sm">
            <p className="">Invoice Number:</p>
            <div>{data.id}</div>
          </div>
          <Update item={data} />
        </div>
      </div>
    </div>
  );
}
