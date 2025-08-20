import { SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ParcelImageGallery from "./client";
import ParcelImageUploadModal from "@/components/parcel-images/upload-modal";

export default async function ParcelImageServer({
  parcel_id,
}: {
  parcel_id: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_parcels")
    .select(
      `
      id,
      test_parcel_images (
        id,
        image_id,
        created_at,
        test_images (
          image_url
        )
      ),
      test_parcel_image_primary (
          id,
          image_id,
          effective_date,
          test_images (
            image_url
          )
        )
    `
    )
    .eq("id", parcel_id)
    .single();

  if (error || !data) {
    console.error(error);
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <SearchX className="w-4 h-4 text-gray-400 mx-auto" />
        <p className="text-center">Error loading images</p>
        <p className="text-sm text-red-500">{error?.message}</p>
      </div>
    );
  }

  const parcel = data;

  const imageEntries = parcel.test_parcel_images;

  // Flatten and resolve image metadata
  const images: { url: string; isPrimary: boolean; path: string }[] = [];

  for (const entry of imageEntries) {
    const imageUrl =
      //@ts-ignore
      entry.test_parcel_image_primary?.test_images?.image_url ??
      entry.test_images?.image_url;

    if (!imageUrl) continue;

    //@ts-ignore
    const isPrimary = !!entry.test_parcel_image_primary;

    const { data: publicUrlData } = supabase.storage
      .from("parcel-images")
      .getPublicUrl(imageUrl);

    if (publicUrlData?.publicUrl) {
      images.push({
        url: publicUrlData.publicUrl,
        path: imageUrl,
        isPrimary,
      });
    }
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-72 flex flex-col gap-4 items-center justify-center border rounded-lg">
        <p className="text-gray-500">No images found</p>
        <ParcelImageUploadModal parcelId={parcel_id} />
      </div>
    );
  }

  return <ParcelImageGallery images={images} parcel_id={parcel_id} />;
}
