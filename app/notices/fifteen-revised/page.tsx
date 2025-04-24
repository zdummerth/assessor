import { createClient } from "@/utils/supabase/server";
import { SearchX } from "lucide-react";
import RevisedFifteenNotices from "@/components/server/notices-fifteen-revised";
import { SelectFilter } from "@/components/ui/filter-client";
import { Suspense } from "react";

export default async function Page(props: {
  searchParams?: Promise<{
    listId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const listId = searchParams?.listId;
  const supabase = await createClient();

  const { data, error } = await supabase
    //@ts-ignore
    .from("list")
    .select(`*`);

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
    <div className="p-4">
      <div className="max-w-[400px] mb-4 print:hidden">
        <p className="mb-2">List</p>
        <SelectFilter
          values={[
            { value: "none", label: "Select List" },
            ...data.map((item: any) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
          defaultValue={listId || "none"}
          urlParam="listId"
        />
      </div>
      <Suspense fallback={<div>Loading...</div>} key={listId}>
        {listId && <RevisedFifteenNotices listId={parseInt(listId)} />}
      </Suspense>
    </div>
  );
}
