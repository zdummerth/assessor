import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSalesById } from "../actions";

interface SalesDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SalesDetailsPage({
  params,
}: SalesDetailsPageProps) {
  const { id } = await params;
  const record = await getSalesById(parseInt(id));

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sales">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sales Details
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
                Created By
              </dt>
              <dd className="mt-1 text-sm">
                {record.created_by != null ? String(record.created_by) : "—"}
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
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
