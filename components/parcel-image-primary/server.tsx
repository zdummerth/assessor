import { SearchX, ImageOff } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
// import ClientComponent from "./client";
import Image from "next/image";

export default async function ServerComponent({
  parcel_id,
}: {
  parcel_id: number;
}) {
  const supabase = await createClient();
  const primary = supabase
    .from("test_parcel_image_primary")
    .select("*")
    .eq("parcel_id", parcel_id)
    .order("effective_date", { ascending: false })
    .limit(1);

  const all = supabase
    .from("test_parcel_images")
    .select("*, test_images(*)")
    .eq("parcel_id", parcel_id)
    .order("created_at", { ascending: false })
    .limit(1);

  const [primaryRes, allRes] = await Promise.all([primary, all]);

  const { data, error } = primaryRes;
  const { data: d, error: e } = allRes;

  if ((error || e) && !data) {
    console.error(error || e);
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <SearchX className="w-4 h-4 text-gray-400 mx-auto" />
        <p className="text-center">Error</p>
        <p>{(error || e)?.message}</p>
      </div>
    );
  }

  // If no primary image is found, return first image from all images. If no images are found, return placeholder.
  const imageUrl =
    data && data.length > 0
      ? // @ts-ignore
        data[0].test_images?.image_url
      : d && d.length > 0
        ? d[0].test_images?.image_url
        : null;

  if (!imageUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <ImageOff className="w-4 h-4 text-gray-400" />
      </div>
    );
  }

  const { data: publicUrL } = supabase.storage
    .from("parcel-images")
    .getPublicUrl(`${imageUrl}`);

  console.log("Public URL:", publicUrL.publicUrl);

  return (
    <div className="w-full h-full relative">
      <Image
        src={publicUrL.publicUrl}
        alt="Parcel Primary Image"
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, 33vw"
      />
    </div>
  );
}
