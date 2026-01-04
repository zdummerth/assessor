import { SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/database-types";
import ImageGallery from "../image-gallery";

type Parcel = Tables<"test_parcels">;

export default async function ServerParcelImages({
  parcel,
}: {
  parcel: Parcel;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_parcel_images")
    .select("*, test_images(*)")
    .eq("parcel_id", parcel.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <SearchX className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-center">Error fetching parcel images</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ImageGallery
        images={data.map((item) => ({
          publicURL: supabase.storage
            .from("parcel-images")
            .getPublicUrl(item.test_images?.image_url || "").data.publicUrl,

          image_url: item.test_images?.image_url || "",
        }))}
        bucket="parcel-images"
      />
    </div>
  );
}
