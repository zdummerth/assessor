import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { ParametersForm } from "./parameters-form";
import { SearchGuideByDescriptionServer } from "./data/search-guide-by-description-server";

interface SearchGuideByDescriptionPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchGuideByDescriptionPage({
  searchParams,
}: SearchGuideByDescriptionPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Extract and type the parameters
  const searchGuideParams = params.p_search_text
    ? {
        p_search_text: Array.isArray(params.p_search_text)
          ? params.p_search_text[0]
          : params.p_search_text,
        p_limit: params.p_limit
          ? Number(
              Array.isArray(params.p_limit) ? params.p_limit[0] : params.p_limit
            )
          : undefined,
      }
    : undefined;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Search Guide By Description</CardTitle>
              <CardDescription className="mt-2">
                Search vehicle guide values by make, model, and trim
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>How Guide Description Search Works</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Similarity Matching
                      </h4>
                      <p>
                        This search uses trigram similarity matching to find
                        vehicles in the guide database that closely match your
                        search text. The similarity score (shown as a
                        percentage) indicates how closely each result matches
                        your search terms.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Score Interpretation
                      </h4>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <span className="font-medium text-green-700">
                            100%
                          </span>{" "}
                          - Exact match
                        </li>
                        <li>
                          <span className="font-medium text-blue-700">
                            80-99%
                          </span>{" "}
                          - Very close match
                        </li>
                        <li>
                          <span className="font-medium text-yellow-700">
                            60-79%
                          </span>{" "}
                          - Good match
                        </li>
                        <li>
                          <span className="font-medium text-orange-700">
                            40-59%
                          </span>{" "}
                          - Partial match
                        </li>
                        <li>
                          <span className="font-medium text-red-700">
                            &lt;40%
                          </span>{" "}
                          - Weak match
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Multiple Tax Years
                      </h4>
                      <p>
                        Each vehicle may have values for multiple tax years
                        (2024, 2025, 2026) and model years. The "Default" value
                        represents a fallback price when specific year data
                        isn't available.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Tips for Better Results
                      </h4>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          Include make, model, and trim level (e.g., "Ford F-150
                          XLT")
                        </li>
                        <li>
                          Punctuation and capitalization are normalized during
                          search
                        </li>
                        <li>
                          Partial matches may include variations in spelling or
                          trim levels
                        </li>
                      </ul>
                    </div>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ParametersForm />
        </CardContent>
      </Card>

      {/* Results Section */}
      <Suspense
        key={JSON.stringify(searchGuideParams)}
        fallback={
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        }
      >
        <SearchGuideByDescriptionServer
          params={searchGuideParams}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
