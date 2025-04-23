import { Suspense } from "react";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import Lists from "@/components/server/lists";
import CreateList from "@/components/ui/lists/create";

export default async function Page(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const suspenseKey = `${page.toString()}`;

  return (
    <div className="w-full flex p-4">
      <div className="w-full">
        <h2 className="text-center text-xl my-4">Lists</h2>
        {/* <CreateList /> */}
        <Suspense fallback={<BinocularsSkeleton />} key={suspenseKey}>
          <Lists page={page} />
        </Suspense>
      </div>
    </div>
  );
}
