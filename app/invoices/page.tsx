import { Suspense } from "react";
import { BinocularsSkeleton } from "@/components/ui/parcel-search-results-skeleton";
import Invoices from "@/components/server/invoices";
import CreateInvoice from "@/components/ui/invoices/create";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const suspenseKey = `${page.toString()}`;

  return (
    <div className="w-full flex p-4">
      <div className="w-full">
        <h2 className="text-center text-xl my-4">Invoices</h2>
        <CreateInvoice />
        <Suspense fallback={<BinocularsSkeleton />} key={suspenseKey}>
          <Invoices page={page} />
        </Suspense>
      </div>
    </div>
  );
}
