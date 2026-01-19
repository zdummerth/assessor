import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import VehicleValuesSearch from "./vehicle-values-search";
import VehicleValuesTable from "./vehicle-values-table";
import { TableSkeleton } from "./table-skeleton";

export default async function VehicleValuesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    type?: string;
    make?: string;
    model?: string;
    trim?: string;
    model_year?: string;
    guide_year?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const type = params?.type || "";
  const make = params?.make || "";
  const model = params?.model || "";
  const trim = params?.trim || "";
  const modelYear = params?.model_year ? Number(params.model_year) : undefined;
  const guideYear = params?.guide_year ? Number(params.guide_year) : undefined;
  const currentPage = Number(params?.page) || 1;

  // Calculate pagination range
  const itemsPerPage = 25;
  const rangeStart = (currentPage - 1) * itemsPerPage;
  const rangeEnd = rangeStart + itemsPerPage - 1;

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                Vehicle Values Search
              </CardTitle>
              <CardDescription>
                Search vehicle values by make, model, trim, and year
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 self-end sm:self-start h-10 w-10"
                  aria-label="Open help dialog"
                >
                  <Info className="h-5 w-5" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>How to Use Vehicle Values Search</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                  <div className="space-y-6 text-sm">
                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Understanding Vehicle Values
                      </h3>
                      <p className="mb-2 text-muted-foreground">
                        This tool searches vehicle valuation data from pricing
                        guides. Values are organized by:
                      </p>
                      <ul className="space-y-2 ml-2">
                        <li>
                          <strong className="text-foreground">
                            Guide Year:
                          </strong>
                          <span className="text-muted-foreground">
                            {" "}
                            The year the pricing guide was published (e.g., 2024
                            guide, 2025 guide)
                          </span>
                        </li>
                        <li>
                          <strong className="text-foreground">
                            Model Year:
                          </strong>
                          <span className="text-muted-foreground">
                            {" "}
                            The year the vehicle was manufactured
                          </span>
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Search Options
                      </h3>
                      <ul className="space-y-3 ml-2">
                        <li>
                          <strong className="text-foreground">Make:</strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Vehicle manufacturer (e.g., Honda, Toyota, Ford)
                          </span>
                        </li>
                        <li>
                          <strong className="text-foreground">Model:</strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Vehicle model name (e.g., Civic, Camry, F-150)
                          </span>
                        </li>
                        <li>
                          <strong className="text-foreground">Trim:</strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Specific trim level or configuration (e.g., LX, XLE,
                            Limited)
                          </span>
                        </li>
                        <li>
                          <strong className="text-foreground">
                            Model Year:
                          </strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Filter by specific vehicle year
                          </span>
                        </li>
                        <li>
                          <strong className="text-foreground">
                            Guide Year:
                          </strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Filter by specific guide publication year
                          </span>
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Tips for Best Results
                      </h3>
                      <ul className="space-y-2 ml-2 list-disc list-inside text-muted-foreground">
                        <li>All search fields support partial matching</li>
                        <li>Leave fields blank to see broader results</li>
                        <li>
                          Results are ordered by make, model, and newest years
                          first
                        </li>
                        <li>
                          Use pagination to browse through large result sets
                        </li>
                        <li>Maximum 1000 results per search</li>
                      </ul>
                    </section>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <VehicleValuesSearch />
        </CardContent>
      </Card>

      <Suspense
        key={`${type}-${make}-${model}-${trim}-${modelYear}-${guideYear}-${currentPage}`}
        fallback={<TableSkeleton />}
      >
        <VehicleValuesTable
          type={type}
          make={make}
          model={model}
          trim={trim}
          modelYear={modelYear}
          guideYear={guideYear}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </Suspense>
    </div>
  );
}
