"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  User,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react";
import { useDevnetReviews, DevnetReview } from "@/lib/client-queries";
import { cn } from "@/utils/cn";

const PRIORITY_COLORS = {
  1: "bg-blue-100 text-blue-800 border-blue-200",
  2: "bg-green-100 text-green-800 border-green-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-red-100 text-red-800 border-red-200",
} as const;

const PRIORITY_LABELS = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Critical",
} as const;

const DATA_STATUS_COLORS = {
  not_collected: "bg-gray-100 text-gray-800 border-gray-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  collected: "bg-green-100 text-green-800 border-green-200",
  needs_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  verified: "bg-purple-100 text-purple-800 border-purple-200",
} as const;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function PriorityBadge({ priority }: { priority: number }) {
  const colorClass =
    PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ||
    PRIORITY_COLORS[2];
  const label =
    PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || "Medium";

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", colorClass)}>
      {label}
    </Badge>
  );
}

function DataStatusBadge({ status }: { status: string }) {
  const colorClass =
    DATA_STATUS_COLORS[status as keyof typeof DATA_STATUS_COLORS] ||
    DATA_STATUS_COLORS.not_collected;
  const label = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", colorClass)}>
      {label}
    </Badge>
  );
}

function ReviewCard({ review }: { review: DevnetReview }) {
  const isOverdue = review.due_date && new Date(review.due_date) < new Date();

  return (
    <Card
      className={cn(
        "transition-colors hover:bg-muted/50",
        isOverdue && "border-red-200"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">
              {review.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">#{review.id}</span>
              <span>•</span>
              <span>{review.kind?.replace(/_/g, " ")}</span>
              {review.entity_type && (
                <>
                  <span>•</span>
                  <span>{review.entity_type}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={parseInt(review.priority) || 2} />
            {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {review.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {review.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Badge variant="secondary">
              {review.status_name || "Unknown Status"}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <DataStatusBadge status={review.data_status} />
          </div>

          {review.assigned_to_name && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{review.assigned_to_name}</span>
            </div>
          )}

          {review.due_date && (
            <div
              className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-600"
              )}
            >
              <CalendarDays className="h-3 w-3" />
              <span>Due {formatDate(review.due_date)}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Updated {formatDate(review.updated_at)}</span>
          </div>

          {review.requires_field_review && (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Field review required</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DevnetReviewsTable() {
  const searchParams = useSearchParams();

  // Extract filters from URL
  const filters = useMemo(() => {
    const params: any = {};

    const page = parseInt(searchParams.get("page") || "1");
    params.page = page;
    params.page_size = 25;

    const reviewKind = searchParams.get("review_kind");
    if (reviewKind) params.kind = reviewKind;

    const statusIds = searchParams.get("status_ids");
    if (statusIds) params.status_ids = statusIds.split(",");

    const assignedToId = searchParams.get("assigned_to_id");
    if (assignedToId) params.assigned_to_id = assignedToId;

    const dataStatus = searchParams.get("data_status");
    if (dataStatus) params.data_status = dataStatus;

    const priority = searchParams.get("priority");
    if (priority) params.priority = parseInt(priority);

    const entityType = searchParams.get("entity_type");
    if (entityType) params.entity_type = entityType;

    const requiresFieldReview = searchParams.get("requires_field_review");
    if (requiresFieldReview)
      params.requires_field_review = requiresFieldReview === "true";

    return params;
  }, [searchParams]);

  const { data, isLoading, error } = useDevnetReviews(filters);

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-red-600">Error loading reviews: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No reviews found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create a new review
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data.data.length} of {data.pagination.total} reviews
        </p>
        {data.pagination.has_more && (
          <Button variant="outline" size="sm">
            Load More
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {data.data.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {data.pagination.has_more && (
        <div className="flex justify-center pt-4">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      )}
    </div>
  );
}
