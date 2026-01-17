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
// import VehiclePagination from "./vehicle-pagination";
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
              <CardTitle className="text-2xl mb-2">Vehicle Search</CardTitle>
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
                  <DialogTitle>How to Use Vehicle Search</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                  <div className="space-y-6 text-sm">
                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Understanding the Data
                      </h3>
                      <p className="mb-2 text-muted-foreground">
                        This tool searches two main sources of vehicle
                        information:
                      </p>
                      <ul className="space-y-2 ml-2">
                        <li>
                          <strong className="text-foreground">
                            VIN Database:
                          </strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Contains detailed information about specific
                            vehicles identified by their unique Vehicle
                            Identification Number (VIN). This helps match a VIN
                            to its year, make, model, and type.
                          </span>
                        </li>
                        <li>
                          <strong className="text-foreground">
                            Vehicle Value Guides:
                          </strong>
                          <span className="text-muted-foreground">
                            {" "}
                            Contains standard market values for different
                            vehicle makes, models, and years. These guides are
                            updated annually and help determine fair market
                            values for assessment purposes.
                          </span>
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        How the Search Works
                      </h3>
                      <p className="mb-2 text-muted-foreground">
                        When you search, the system follows these steps:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 ml-2 text-muted-foreground">
                        <li>
                          <strong className="text-foreground">
                            Detects search type:
                          </strong>{" "}
                          If you enter 8-17 characters that look like a VIN, it
                          searches for that specific vehicle. Otherwise, it
                          searches by make, model, or description.
                        </li>
                        <li>
                          <strong className="text-foreground">
                            Searches local database:
                          </strong>{" "}
                          First checks our vehicle database for matches to your
                          search.
                        </li>
                        <li>
                          <strong className="text-foreground">
                            NHTSA lookup (VIN only):
                          </strong>{" "}
                          If searching by VIN and no local match is found, it
                          contacts the National Highway Traffic Safety
                          Administration database to decode the VIN and get
                          vehicle details.
                        </li>
                        <li>
                          <strong className="text-foreground">
                            Finds values:
                          </strong>{" "}
                          Matches the vehicle to guide values based on the
                          selected guide year to show current market values.
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Using the Search
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Search Box
                          </h4>
                          <p className="text-muted-foreground">
                            Type a VIN (like "1HGBH41JXMN109186") or vehicle
                            description (like "Honda Accord") and click the{" "}
                            <strong>Search</strong> button. You can also press{" "}
                            <strong>Enter</strong> to search.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Search Type Filter
                          </h4>
                          <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                            <li>
                              <strong className="text-foreground">
                                Auto-detect:
                              </strong>{" "}
                              Automatically determines if you're searching by
                              VIN or description
                            </li>
                            <li>
                              <strong className="text-foreground">VIN:</strong>{" "}
                              Forces VIN search even for shorter entries
                            </li>
                            <li>
                              <strong className="text-foreground">
                                Description:
                              </strong>{" "}
                              Searches by make, model, and description only
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Guide Year Filter
                          </h4>
                          <p className="text-muted-foreground">
                            Select which year's value guide to use.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Results Per Page
                          </h4>
                          <p className="text-muted-foreground">
                            Choose how many results to show at once (10, 25, 50,
                            or 100).
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="font-semibold text-foreground mb-2">
                        Working with Results
                      </h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>
                          <strong className="text-foreground">
                            Bookmarking:
                          </strong>{" "}
                          You can bookmark your search by saving the page URL.
                          All your filters and search terms are saved in the
                          link.
                        </p>
                        <p>
                          <strong className="text-foreground">
                            Copying Data:
                          </strong>{" "}
                          Click on the clipboard icon next to any value in the
                          results table to copy it to your clipboard.
                        </p>
                      </div>
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
              guideYear={guideYear}
              matchLimit={matchLimit}
              searchType={searchType}
            />
          </Suspense>
          {/* <div className="mt-5 flex w-full justify-center">
            <Suspense fallback={<div className="h-10" />}>
              <VehiclePagination
                query={query}
                guideYear={guideYear}
                matchLimit={matchLimit}
                searchType={searchType}
              />
            </Suspense>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
