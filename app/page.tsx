// app/value-stats/page.tsx
import ValueStats from "@/components/value-stats/server";
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function ValueStatsSkeleton() {
  // how many placeholder cards to show in the grid
  const CARD_COUNT = 12;

  return (
    <div className="space-y-6" aria-busy>
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-44 rounded-md" />
          <div className="mt-2">
            <Skeleton className="h-4 w-56 rounded-md" />
          </div>
        </div>
      </div>

      {/* Charts FIRST */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category totals pie skeleton */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              <Skeleton className="h-5 w-40 rounded-md" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full flex items-center justify-center">
              {/* fake donut */}
              <div className="relative">
                <Skeleton className="h-48 w-48 rounded-full" />
                <Skeleton className="absolute inset-6 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section totals pie skeleton */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              <Skeleton className="h-5 w-32 rounded-md" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full flex items-center justify-center">
              <div className="relative">
                <Skeleton className="h-48 w-48 rounded-full" />
                <Skeleton className="absolute inset-6 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Cards grid AFTER charts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function Page() {
  return (
    <div className="p-4">
      <Suspense fallback={<ValueStatsSkeleton />}>
        <ValueStats asOfDate={new Date().toISOString().slice(0, 10)} />
      </Suspense>
    </div>
  );
}
