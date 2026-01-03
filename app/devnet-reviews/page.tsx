import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DevnetReviewsFiltersDialog from "@/components/devnet-reviews/filters";
import DevnetReviewsTableServer from "@/components/devnet-reviews/table-server";
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

interface DevnetReviewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DevnetReviewsPage({
  searchParams,
}: DevnetReviewsPageProps) {
  // Await searchParams before using its properties
  const params = await searchParams;

  // Extract filters from searchParams
  const filters: any = {};

  const reviewKind = params.review_kind;
  if (reviewKind && typeof reviewKind === "string") {
    filters.kind = reviewKind;
  }

  const statusIds = params.status_ids;
  if (statusIds) {
    if (typeof statusIds === "string") {
      filters.status_ids = statusIds.split(",");
    } else if (Array.isArray(statusIds)) {
      filters.status_ids = statusIds;
    }
  }

  const assignedToId = params.assigned_to_id;
  if (assignedToId && typeof assignedToId === "string") {
    filters.assigned_to_id = assignedToId;
  }

  const dataStatus = params.data_status;
  if (dataStatus && typeof dataStatus === "string") {
    filters.data_status = dataStatus;
  }

  const priority = params.priority;
  if (priority && typeof priority === "string") {
    filters.priority = parseInt(priority);
  }

  const entityType = params.entity_type;
  if (entityType && typeof entityType === "string") {
    filters.entity_type = entityType;
  }

  const requiresFieldReview = params.requires_field_review;
  if (requiresFieldReview && typeof requiresFieldReview === "string") {
    filters.requires_field_review = requiresFieldReview === "true";
  }

  const searchText = params.search_text;
  if (searchText && typeof searchText === "string") {
    filters.search_text = searchText;
  }

  const overdueOnly = params.overdue_only;
  if (overdueOnly && typeof overdueOnly === "string") {
    filters.overdue_only = overdueOnly === "true";
  }

  const createdAfter = params.created_after;
  if (createdAfter && typeof createdAfter === "string") {
    filters.created_after = createdAfter;
  }

  const createdBefore = params.created_before;
  if (createdBefore && typeof createdBefore === "string") {
    filters.created_before = createdBefore;
  }

  const dueAfter = params.due_after;
  if (dueAfter && typeof dueAfter === "string") {
    filters.due_after = dueAfter;
  }

  const dueBefore = params.due_before;
  if (dueBefore && typeof dueBefore === "string") {
    filters.due_before = dueBefore;
  }

  const completedOnly = params.completed_only;
  if (completedOnly && typeof completedOnly === "string") {
    filters.completed_only = completedOnly === "true";
  }

  const activeOnly = params.active_only;
  if (activeOnly && typeof activeOnly === "string") {
    filters.active_only = activeOnly === "true";
  }

  const suspenseKey = JSON.stringify(filters);

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <PageHeader />

      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-10 w-32" />}>
          <DevnetReviewsFiltersDialog />
        </Suspense>

        <Suspense fallback={<LoadingState />} key={suspenseKey}>
          {/* <DevnetReviewsTableServer filters={filters} /> */}
          <DevnetReviewsTable />
        </Suspense>
      </div>
    </div>
  );
}
