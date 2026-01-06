import { Suspense } from "react";
import { NeighborhoodsServer } from "./data/neighborhoods-server";
import { NeighborhoodsFilters } from "./filters";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

interface NeighborhoodsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NeighborhoodsPage({
  searchParams,
}: NeighborhoodsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 25;
  
  // Extract filters from search params
  const filters: any = {};
  // Add filter mapping based on your table columns
  // Example: if (params.status) filters.status = params.status as string;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Neighborhoods</h1>
        <p className="text-muted-foreground">
          Manage neighborhoods records
        </p>
      </div>
      
      <div className="flex gap-4">
        <NeighborhoodsFilters />
      </div>

      <Suspense key={currentPage} fallback={<LoadingState />}>
        <NeighborhoodsServer 
          filters={filters} 
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}
