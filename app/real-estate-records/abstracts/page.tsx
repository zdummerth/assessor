import { getDeedAbstracts } from "@/components/abstracts/actions";
import { DeedAbstractsTable } from "@/components/abstracts/ui/deed-abstracts-table";
import { DeedAbstractDialog } from "@/components/abstracts/ui/deed-abstract-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Printer, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompactPagination from "@/components/ui/compact-pagination";
import { Suspense } from "react";
import Loading from "../loading";

async function ServerFetcher({ limit, page }: { limit: number; page: number }) {
  const { data: deedAbstracts, totalCount } = await getDeedAbstracts({
    limit,
    page,
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  return (
    <>
      <CompactPagination totalPages={totalPages} currentPage={page} />
      <DeedAbstractsTable deedAbstracts={deedAbstracts} />
    </>
  );
}

const ITEMS_PER_PAGE = 50;

export default async function DeedAbstractsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deed Abstracts</h1>
          <p className="text-muted-foreground">
            Manage real estate deed abstracts and conveyances
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/real-estate-records/abstracts/books">
            <Button variant="outline">
              <Book className="h-4 w-4 mr-2" />
              Manage Books
            </Button>
          </Link>
          <Link href="/real-estate-records/abstracts/print">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print All
            </Button>
          </Link>
          <DeedAbstractDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deed Abstracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense key={currentPage} fallback={<Loading />}>
            <ServerFetcher limit={ITEMS_PER_PAGE} page={currentPage} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
