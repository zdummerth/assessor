import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDevnetReviewsById } from "../actions";

interface DevnetReviewsDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DevnetReviewsDetailsPage({
  params,
}: DevnetReviewsDetailsPageProps) {
  const { id } = await params;
  const record = await getDevnetReviewsById(parseInt(id));

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/devnet-reviews">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Devnet Reviews Details
          </h1>
          <p className="text-muted-foreground">ID: {record.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Assigned To Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.assigned_to_id != null ? String(record.assigned_to_id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Completed At
              </dt>
              <dd className="mt-1 text-sm">
                {record.completed_at != null ? String(record.completed_at) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Copied To Devnet At
              </dt>
              <dd className="mt-1 text-sm">
                {record.copied_to_devnet_at != null ? String(record.copied_to_devnet_at) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Copied To Devnet By Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.copied_to_devnet_by_id != null ? String(record.copied_to_devnet_by_id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Created At
              </dt>
              <dd className="mt-1 text-sm">
                {record.created_at != null ? String(record.created_at) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Current Status Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.current_status_id != null ? String(record.current_status_id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Data Collected At
              </dt>
              <dd className="mt-1 text-sm">
                {record.data_collected_at != null ? String(record.data_collected_at) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Data Collected By Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.data_collected_by_id != null ? String(record.data_collected_by_id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Data Status
              </dt>
              <dd className="mt-1 text-sm">
                {record.data_status != null ? String(record.data_status) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Description
              </dt>
              <dd className="mt-1 text-sm">
                {record.description != null ? String(record.description) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Devnet Copy Confirmed
              </dt>
              <dd className="mt-1 text-sm">
                {record.devnet_copy_confirmed != null ? String(record.devnet_copy_confirmed) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Due Date
              </dt>
              <dd className="mt-1 text-sm">
                {record.due_date != null ? String(record.due_date) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Entity Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.entity_id != null ? String(record.entity_id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Entity Type
              </dt>
              <dd className="mt-1 text-sm">
                {record.entity_type != null ? String(record.entity_type) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Field Notes
              </dt>
              <dd className="mt-1 text-sm">
                {record.field_notes != null ? String(record.field_notes) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.id != null ? String(record.id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Kind
              </dt>
              <dd className="mt-1 text-sm">
                {record.kind != null ? String(record.kind) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Priority
              </dt>
              <dd className="mt-1 text-sm">
                {record.priority != null ? String(record.priority) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Requires Field Review
              </dt>
              <dd className="mt-1 text-sm">
                {record.requires_field_review != null ? String(record.requires_field_review) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Title
              </dt>
              <dd className="mt-1 text-sm">
                {record.title != null ? String(record.title) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Updated At
              </dt>
              <dd className="mt-1 text-sm">
                {record.updated_at != null ? String(record.updated_at) : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
