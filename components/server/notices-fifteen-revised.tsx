import Notice from "@/components/ui/notices/fifteen/revised";
import { createClient } from "@/utils/supabase/server";
import { SearchX } from "lucide-react";

export default async function Data({ listId }: { listId: number }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("list")
    .select(
      `
      *, 
      list_parcel_year(*,
      parcel_year(
        appraised_total,
        year,
        parcel_number,
        owner_name,
        owner_address_1,
        owner_address_2,
        owner_city,
        owner_state,
        owner_zip,
        site_street_number,
        site_street_name,
        prefix_directional,
        site_zip_code,
        owner_parcel_year(
         owner_name(*, owner_address(*))
        ),
        site_address_parcel_year (
          is_primary,
          site_address_master(*)
        )
      )
    )
    `
    )
    .eq("id", listId)
    .single();

  if (error && !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcels</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* @ts-ignore */}
      {data.list_parcel_year.map((item: any) => {
        return <Notice data={item.parcel_year} key={item.parcel_number} />;
      })}
    </div>
  );
}
