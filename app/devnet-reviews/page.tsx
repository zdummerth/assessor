import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DevnetReviewsFiltersDialog from "@/components/devnet-reviews/filters";
import DevnetReviewsTable from "@/components/devnet-reviews/table";

function PageHeader() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Devnet Reviews</h1>
        <p className="text-muted-foreground">
          Manage and track review workflows for external database integration
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DevnetReviewsPage() {
  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <PageHeader />

      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-10 w-32" />}>
          <DevnetReviewsFiltersDialog />
        </Suspense>

        <Suspense fallback={<LoadingState />}>
          <DevnetReviewsTable />
        </Suspense>
      </div>
    </div>
  );
}
