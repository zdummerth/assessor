import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDevnetReviewStatusesById } from "../actions";

interface DevnetReviewStatusesDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DevnetReviewStatusesDetailsPage({
  params,
}: DevnetReviewStatusesDetailsPageProps) {
  const { id } = await params;
  const record = await getDevnetReviewStatusesById(parseInt(id));

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/devnet-review-statuses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Devnet Review Statuses Details
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
                Created At
              </dt>
              <dd className="mt-1 text-sm">
                {record.created_at != null ? String(record.created_at) : "—"}
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
                Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.id != null ? String(record.id) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Is Terminal
              </dt>
              <dd className="mt-1 text-sm">
                {record.is_terminal != null ? String(record.is_terminal) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm">
                {record.name != null ? String(record.name) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Needs Approval
              </dt>
              <dd className="mt-1 text-sm">
                {record.needs_approval != null ? String(record.needs_approval) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Preferred Role
              </dt>
              <dd className="mt-1 text-sm">
                {record.preferred_role != null ? String(record.preferred_role) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Required Specialties
              </dt>
              <dd className="mt-1 text-sm">
                {record.required_specialties != null ? String(record.required_specialties) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Requires Assignment
              </dt>
              <dd className="mt-1 text-sm">
                {record.requires_assignment != null ? String(record.requires_assignment) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Review Kind
              </dt>
              <dd className="mt-1 text-sm">
                {record.review_kind != null ? String(record.review_kind) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Slug
              </dt>
              <dd className="mt-1 text-sm">
                {record.slug != null ? String(record.slug) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Sort Order
              </dt>
              <dd className="mt-1 text-sm">
                {record.sort_order != null ? String(record.sort_order) : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
