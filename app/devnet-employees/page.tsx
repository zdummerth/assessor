import { Suspense } from "react";
import { DevnetEmployeesServer } from "./data/devnet-employees-server";
import { DevnetEmployeesFilters } from "./filters";
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

interface DevnetEmployeesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DevnetEmployeesPage({
  searchParams,
}: DevnetEmployeesPageProps) {
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
        <h1 className="text-3xl font-bold tracking-tight">Devnet Employees</h1>
        <p className="text-muted-foreground">
          Manage devnet employees records
        </p>
      </div>
      
      <div className="flex gap-4">
        <DevnetEmployeesFilters />
      </div>

      <Suspense key={currentPage} fallback={<LoadingState />}>
        <DevnetEmployeesServer 
          filters={filters} 
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}
