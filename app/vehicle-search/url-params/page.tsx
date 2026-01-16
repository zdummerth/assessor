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
import VehicleSearch from "./vehicle-search";
import VehicleTable from "./vehicle-table";
import VehiclePagination from "./vehicle-pagination";
import { TableSkeleton } from "./table-skeleton";

export default async function VehicleSearchUrlParamsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    guide_year?: string;
    match_limit?: string;
    search_type?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;
  const guideYear = Number(params?.guide_year) || 2026;
  const matchLimit = Number(params?.match_limit) || 10;
  const searchType =
    (params?.search_type as "auto" | "vin" | "description") || "auto";

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                Vehicle Search (URL Params)
              </CardTitle>
              <CardDescription className="text-sm">
                Search by VIN or vehicle description with URL-driven state
                management
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
                  <DialogTitle>URL-Driven Vehicle Search</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                  <div className="space-y-6 text-sm">
                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Key Features
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <strong>URL State:</strong> All search parameters are
                          stored in the URL for bookmarking and sharing
                        </li>
                        <li>
                          <strong>Server Components:</strong> Fast initial page
                          loads with server-side rendering
                        </li>
                        <li>
                          <strong>Suspense Boundaries:</strong> Smooth loading
                          states without blocking the entire page
                        </li>
                        <li>
                          <strong>Debounced Search:</strong> Automatic search as
                          you type with optimized performance
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Search Methods
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <strong>Auto-detect:</strong> Automatically determines
                          VIN (8-17 chars) or description
                        </li>
                        <li>
                          <strong>VIN Search:</strong> Complete or partial
                          Vehicle Identification Number
                        </li>
                        <li>
                          <strong>Description Search:</strong> Make, model, or
                          descriptive text
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Using URL Parameters
                      </h3>
                      <p className="mb-2">
                        You can bookmark or share searches by copying the URL.
                        Parameters include:
                      </p>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium">query</dt>
                          <dd className="text-muted-foreground ml-2">
                            VIN or vehicle description
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">page</dt>
                          <dd className="text-muted-foreground ml-2">
                            Page number for pagination
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">guide_year</dt>
                          <dd className="text-muted-foreground ml-2">
                            Filter by guide year (default: 2026)
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">match_limit</dt>
                          <dd className="text-muted-foreground ml-2">
                            Results per page (default: 10)
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">search_type</dt>
                          <dd className="text-muted-foreground ml-2">
                            auto, vin, or description
                          </dd>
                        </div>
                      </dl>
                    </section>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <VehicleSearch
            placeholder="Search VIN or vehicle description..."
            defaultGuideYear={guideYear}
            defaultMatchLimit={matchLimit}
            defaultSearchType={searchType}
          />
          <Suspense
            key={query + currentPage + guideYear + matchLimit + searchType}
            fallback={<TableSkeleton />}
          >
            <VehicleTable
              query={query}
              currentPage={currentPage}
              guideYear={guideYear}
              matchLimit={matchLimit}
              searchType={searchType}
            />
          </Suspense>
          <div className="mt-5 flex w-full justify-center">
            <Suspense fallback={<div className="h-10" />}>
              <VehiclePagination
                query={query}
                guideYear={guideYear}
                matchLimit={matchLimit}
                searchType={searchType}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
