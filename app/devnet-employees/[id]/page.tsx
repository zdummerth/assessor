import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDevnetEmployeesById } from "../actions";

interface DevnetEmployeesDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DevnetEmployeesDetailsPage({
  params,
}: DevnetEmployeesDetailsPageProps) {
  const { id } = await params;
  const record = await getDevnetEmployeesById(parseInt(id));

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/devnet-employees">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Devnet Employees Details
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
                Can Approve
              </dt>
              <dd className="mt-1 text-sm">
                {record.can_approve != null ? String(record.can_approve) : "—"}
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
                Email
              </dt>
              <dd className="mt-1 text-sm">
                {record.email != null ? String(record.email) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                First Name
              </dt>
              <dd className="mt-1 text-sm">
                {record.first_name != null ? String(record.first_name) : "—"}
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
                Last Name
              </dt>
              <dd className="mt-1 text-sm">
                {record.last_name != null ? String(record.last_name) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-sm">
                {record.role != null ? String(record.role) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Specialties
              </dt>
              <dd className="mt-1 text-sm">
                {record.specialties != null ? String(record.specialties) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 text-sm">
                {record.status != null ? String(record.status) : "—"}
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
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                User Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.user_id != null ? String(record.user_id) : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
