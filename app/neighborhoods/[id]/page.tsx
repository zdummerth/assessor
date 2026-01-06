import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getNeighborhoodsById } from "../actions";

interface NeighborhoodsDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NeighborhoodsDetailsPage({
  params,
}: NeighborhoodsDetailsPageProps) {
  const { id } = await params;
  const record = await getNeighborhoodsById(parseInt(id));

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/neighborhoods">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Neighborhoods Details
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
                Group
              </dt>
              <dd className="mt-1 text-sm">
                {record.group != null ? String(record.group) : "—"}
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
                Name
              </dt>
              <dd className="mt-1 text-sm">
                {record.name != null ? String(record.name) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Neighborhood
              </dt>
              <dd className="mt-1 text-sm">
                {record.neighborhood != null ? String(record.neighborhood) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Polygon
              </dt>
              <dd className="mt-1 text-sm">
                {record.polygon != null ? String(record.polygon) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Set Id
              </dt>
              <dd className="mt-1 text-sm">
                {record.set_id != null ? String(record.set_id) : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
