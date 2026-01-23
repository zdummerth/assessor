import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StateTaxCommissionReport } from "./state-tax-commission-report";
import { RecaptureReport } from "./recapture-report";
import { COVRecaptureReport } from "./cov-recapture-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ----------------------------- types ----------------------------- */

type SearchParams = {
  year?: string;
  report_type?: string;
};

/* ----------------------------- helpers ----------------------------- */

function parseNumber(v?: string): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/* ----------------------------- page ----------------------------- */

export default async function YearlyReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const year = parseNumber(params?.year) || new Date().getFullYear();
  const reportType = params?.report_type;

  return (
    <main className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Yearly Reports</h1>
      </div>

      <Tabs defaultValue="state-tax-commission" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="state-tax-commission">
            State Tax Commission
          </TabsTrigger>
          <TabsTrigger value="recapture">Recapture Report</TabsTrigger>
          <TabsTrigger value="cov-recapture">COV Recapture</TabsTrigger>
        </TabsList>
        <TabsContent value="state-tax-commission" className="mt-6">
          <StateTaxCommissionReport year={year} />
        </TabsContent>
        <TabsContent value="recapture" className="mt-6">
          <RecaptureReport year={year} />
        </TabsContent>
        <TabsContent value="cov-recapture" className="mt-6">
          <COVRecaptureReport year={year} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
