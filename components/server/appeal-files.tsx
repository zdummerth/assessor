import { createClient } from "@/utils/supabase/server";
import FormattedDate from "../ui/formatted-date";
import Image from "next/image";
import DeleteFileModal from "../ui/files/modal-delete";

export default async function AppealFiles({
  page = 1,
  appeal,
}: {
  page: number;
  appeal: string;
}) {
  const limit = 40;
  const offset = (page - 1) * limit;
  const endingPage = offset + limit - 1;

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("appeals").list(appeal, {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  // const { data, error } = await supabase.storage.listBuckets();
  console.log({ data, error, appeal });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching appeals</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No files found</p>
      </div>
    );
  }

  console.log("Appeals data", data);
  // const { data } = supabase.storage.from("bucket").getPublicUrl("filePath.jpg");
  //get public url for each file in data
  const files = data.map((item) => {
    const { data: publicURL } = supabase.storage
      .from("appeals")
      .getPublicUrl(`${appeal}/${item.name}`);
    if (error) {
      console.error(error);
      return null;
    }
    return {
      ...item,
      publicURL,
    };
  });

  // console.log("Files", files);

  const imageFiles = files.filter((file) => {
    return (
      file?.metadata?.mimetype === "image/jpeg" ||
      file?.metadata?.mimetype === "image/png"
    );
  });

  const otherFiles = files.filter((file) => {
    return (
      file?.metadata?.mimetype !== "image/jpeg" &&
      file?.metadata?.mimetype !== "image/png"
    );
  });

  // console.log("Image files", imageFiles);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-2xl my-2">Images</h2>

      {imageFiles.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {imageFiles.map((file) => {
            return (
              <a
                key={file?.name}
                href={file?.publicURL.publicUrl}
                target="_blank"
              >
                <Image
                  // @ts-ignore
                  src={file?.publicURL.publicUrl}
                  // @ts-ignore
                  alt={file?.name}
                  width={400}
                  height={400}
                  className="object-cover rounded-lg shadow-md"
                />
              </a>
            );
          })}
        </div>
      )}

      <h2 className="text-2xl my-2">Other Files</h2>
      {otherFiles.map((file) => {
        return (
          <div
            key={file?.name}
            className="flex items-center gap-16 p-2 border-b border-gray-200 dark:border-gray-700"
          >
            <a
              // @ts-ignore
              href={file?.publicURL.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file?.name}
            </a>
            <span className="text-sm text-gray-500">
              {/* @ts-ignore */}
              <FormattedDate date={file?.updated_at} />
            </span>
            <span>
              <DeleteFileModal
                bucket="appeals"
                path={appeal}
                fileName={file?.name || ""}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}
