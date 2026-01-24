import { getDeedAbstracts } from "./actions";
import { DeedAbstractsTable } from "./deed-abstracts-table";
import { DeedAbstractDialog } from "./deed-abstract-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Printer } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DeedAbstractsPage() {
  const deedAbstracts = await getDeedAbstracts({ limit: 1000, page: 1 });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deed Abstracts</h1>
          <p className="text-muted-foreground">
            Manage real estate deed abstracts and conveyances
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/real-estate-records/abstracts/print">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print All
            </Button>
          </Link>
          <DeedAbstractDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deed Abstracts</CardTitle>
          <CardDescription>
            A complete list of all deed abstracts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeedAbstractsTable deedAbstracts={deedAbstracts} />
        </CardContent>
      </Card>
    </div>
  );
}
