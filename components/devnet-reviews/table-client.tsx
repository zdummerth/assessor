"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  User,
  AlertTriangle,
  FileText,
  Clock,
  UserPlus,
  RotateCcw,
  ClipboardCheck,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  MapPin,
  DollarSign,
  Building,
} from "lucide-react";
import { DevnetReview } from "@/lib/client-queries";
import { cn } from "@/lib/cn";
import {
  MassStatusUpdateForm,
  MassAssignmentForm,
  MassCreateReviewsForm,
  FieldDataForm,
} from "@/components/devnet-reviews";

interface DevnetReviewsTableClientProps {
  initialData: DevnetReview[];
  filters: any;
}

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
  in_field: "bg-blue-100 text-blue-800 border-blue-200",
  collected: "bg-green-100 text-green-800 border-green-200",
  entered: "bg-yellow-100 text-yellow-800 border-yellow-200",
  copied_to_devnet: "bg-emerald-100 text-emerald-800 border-emerald-200",
  verified: "bg-purple-100 text-purple-800 border-purple-200",
} as const;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

function ReviewCard({
  review,
  isSelected,
  onSelect,
  isExpanded,
  onToggleExpanded,
}: {
  review: DevnetReview;
  isSelected: boolean;
  onSelect: (id: number) => void;
  isExpanded: boolean;
  onToggleExpanded: (id: number) => void;
}) {
  const isOverdue = review.due_date && new Date(review.due_date) < new Date();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [fieldDataDialogOpen, setFieldDataDialogOpen] = useState(false);

  return (
    <Card
      className={cn(
        "transition-colors hover:bg-muted/50",
        isOverdue && "border-red-200",
        isSelected && "ring-2 ring-blue-500"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(review.id)}
              className="mt-1"
            />
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
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpanded(review.id)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
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

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
            <h4 className="font-medium text-sm">Associated Data</h4>

            {/* Parcel Data */}
            {review.parcel_data && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="font-medium text-sm">Parcels</span>
                </div>
                <div className="grid gap-2">
                  {Array.isArray(review.parcel_data) ? (
                    review.parcel_data.map((parcel: any) => (
                      <div
                        key={parcel.id}
                        className="p-2 bg-background rounded border text-xs"
                      >
                        <div className="font-medium">
                          {parcel.parcel_number}
                        </div>
                        <div className="text-muted-foreground">
                          {parcel.data?.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {parcel.data.address}
                            </div>
                          )}
                          <div>
                            Years: {parcel.start_year} - {parcel.end_year}
                          </div>
                          <div>Devnet ID: {parcel.devnet_id}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-background rounded border text-xs">
                      <div className="font-medium">
                        {review.parcel_data.parcel_number}
                      </div>
                      <div className="text-muted-foreground">
                        {review.parcel_data.data?.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {review.parcel_data.data.address}
                          </div>
                        )}
                        <div>
                          Years: {review.parcel_data.start_year} -{" "}
                          {review.parcel_data.end_year}
                        </div>
                        <div>Devnet ID: {review.parcel_data.devnet_id}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sales Data */}
            {review.sales_data && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-sm">Sales</span>
                </div>
                <div className="grid gap-2">
                  {Array.isArray(review.sales_data) ? (
                    review.sales_data.map((sale: any) => (
                      <div
                        key={sale.id}
                        className="p-2 bg-background rounded border text-xs"
                      >
                        <div className="font-medium">
                          ${sale.sale_price?.toLocaleString() || "N/A"}
                        </div>
                        <div className="text-muted-foreground">
                          <div>
                            Date:{" "}
                            {sale.sale_date
                              ? formatDate(sale.sale_date)
                              : "N/A"}
                          </div>
                          <div>Type: {sale.sale_type || "N/A"}</div>
                          <div>Status: {sale.sale_status || "N/A"}</div>
                          <div>Devnet ID: {sale.devnet_id}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-background rounded border text-xs">
                      <div className="font-medium">
                        $
                        {review.sales_data.sale_price?.toLocaleString() ||
                          "N/A"}
                      </div>
                      <div className="text-muted-foreground">
                        <div>
                          Date:{" "}
                          {review.sales_data.sale_date
                            ? formatDate(review.sales_data.sale_date)
                            : "N/A"}
                        </div>
                        <div>Type: {review.sales_data.sale_type || "N/A"}</div>
                        <div>
                          Status: {review.sales_data.sale_status || "N/A"}
                        </div>
                        <div>Devnet ID: {review.sales_data.devnet_id}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sale-Parcel Relationships */}
            {review.sale_parcels_data &&
              review.sale_parcels_data.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Sale-Parcel Relationships
                    </span>
                  </div>
                  <div className="grid gap-1">
                    {review.sale_parcels_data.map((relationship: any) => (
                      <div
                        key={relationship.id}
                        className="p-2 bg-background rounded border text-xs text-muted-foreground"
                      >
                        Sale #{relationship.sale_id} ↔ Parcel #
                        {relationship.parcel_id}
                        {relationship.data &&
                          Object.keys(relationship.data).length > 0 && (
                            <div className="mt-1 text-xs">
                              Additional data:{" "}
                              {JSON.stringify(relationship.data)}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-3 w-3 mr-1" />
                Status
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Update Status - {review.title}</DialogTitle>
              </DialogHeader>
              <MassStatusUpdateForm
                reviewIds={[review.id]}
                reviewKind={review.kind as any}
                onSuccess={() => {
                  setStatusDialogOpen(false);
                  window.location.reload();
                }}
                title="Update Review Status"
                description="Change the status of this review."
              />
            </DialogContent>
          </Dialog>

          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-3 w-3 mr-1" />
                Assign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Assign Review - {review.title}</DialogTitle>
              </DialogHeader>
              <MassAssignmentForm
                reviewIds={[review.id]}
                onSuccess={() => {
                  setAssignDialogOpen(false);
                  window.location.reload();
                }}
                title="Assign Review"
                description="Assign this review to an employee."
              />
            </DialogContent>
          </Dialog>

          {review.requires_field_review && (
            <Dialog
              open={fieldDataDialogOpen}
              onOpenChange={setFieldDataDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ClipboardCheck className="h-3 w-3 mr-1" />
                  Field Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Record Field Data - {review.title}</DialogTitle>
                </DialogHeader>
                <FieldDataForm
                  reviewId={review.id}
                  onSuccess={() => {
                    setFieldDataDialogOpen(false);
                    window.location.reload();
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DevnetReviewsTableClient({
  initialData,
  filters,
}: DevnetReviewsTableClientProps) {
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
  const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false);
  const [createReviewDialogOpen, setCreateReviewDialogOpen] = useState(false);

  const handleSelectReview = (reviewId: number) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleToggleExpanded = (reviewId: number) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === initialData.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(initialData.map((review) => review.id));
    }
  };

  const isAllSelected = selectedReviews.length === initialData.length;
  const isSomeSelected =
    selectedReviews.length > 0 && selectedReviews.length < initialData.length;

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-8 w-8 p-0"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : isSomeSelected ? (
                    <Square className="h-4 w-4 opacity-50" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedReviews.length} of {initialData.length} selected
                </span>
              </div>

              {selectedReviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <Dialog
                    open={bulkStatusDialogOpen}
                    onOpenChange={setBulkStatusDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Update Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Bulk Update Status</DialogTitle>
                      </DialogHeader>
                      <MassStatusUpdateForm
                        reviewIds={selectedReviews}
                        onSuccess={() => {
                          setBulkStatusDialogOpen(false);
                          setSelectedReviews([]);
                          window.location.reload();
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={bulkAssignDialogOpen}
                    onOpenChange={setBulkAssignDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Bulk Assign Reviews</DialogTitle>
                      </DialogHeader>
                      <MassAssignmentForm
                        reviewIds={selectedReviews}
                        onSuccess={() => {
                          setBulkAssignDialogOpen(false);
                          setSelectedReviews([]);
                          window.location.reload();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <Dialog
              open={createReviewDialogOpen}
              onOpenChange={setCreateReviewDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Create Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Reviews</DialogTitle>
                </DialogHeader>
                <MassCreateReviewsForm
                  onSuccess={() => {
                    setCreateReviewDialogOpen(false);
                    window.location.reload();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {initialData.length} reviews
        </p>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {initialData.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isSelected={selectedReviews.includes(review.id)}
            onSelect={handleSelectReview}
            isExpanded={expandedReviews.includes(review.id)}
            onToggleExpanded={handleToggleExpanded}
          />
        ))}
      </div>
    </div>
  );
}
