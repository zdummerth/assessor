"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CopyToClipboard from "@/components/copy-to-clipboard";

interface GuideValue {
  guide_year: number;
  year: number;
  value: number;
}

interface GuideMatch {
  vehicle_id: string;
  type: string | null;
  make: string;
  model: string;
  trim: string | null;
  similarity_score: number;
  values: GuideValue[];
}

interface VinMatch {
  vin_id: number;
  vin: string;
  model_year: string;
  type: string;
  vin_description: string;
  guide_results: any;
}

interface SearchVinWithGuideMatchesPresentationProps {
  data: VinMatch[];
  searchedVin?: string;
  error?: string;
  isLoading?: boolean;
}

export function SearchVinWithGuideMatchesPresentation({
  data,
  searchedVin,
  error,
  isLoading,
}: SearchVinWithGuideMatchesPresentationProps) {
  const parseGuideResults = (guideResults: any): GuideMatch[] => {
    if (!guideResults) return [];

    if (typeof guideResults === "string") {
      try {
        return JSON.parse(guideResults);
      } catch {
        return [];
      }
    }
    return Array.isArray(guideResults) ? guideResults : [];
  };

  const getSimilarityBadgeColor = (score: number) => {
    if (score >= 1.0) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 0.8) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 0.6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 0.4) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatVehicleDescription = (guide: GuideMatch) => {
    return `${guide.make} ${guide.model}${guide.trim ? ` ${guide.trim}` : ""}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground">No results found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Searched VIN Display */}
      {searchedVin && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  Searched VIN:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-lg font-semibold">
                    {searchedVin}
                  </span>
                  <CopyToClipboard text={searchedVin} />
                </div>
              </div>
              <Badge variant="outline">
                {data.length} {data.length === 1 ? "match" : "matches"} found
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card Grid */}
      <div
        className={`grid gap-4 ${
          data.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {data.map((item) => {
          const guideResults = parseGuideResults(item.guide_results);
          const vinModelYear = parseInt(item.model_year);

          return (
            <Card key={item.vin_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">{item.vin}</span>
                    <CopyToClipboard text={item.vin} />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {item.model_year} Model Year
                    </Badge>
                    <Badge variant="outline">
                      {guideResults.length} matches
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VIN Details */}
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{item.type || "-"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="font-medium mt-1">
                      {item.vin_description || "-"}
                    </p>
                  </div>
                </div>

                {/* Guide Matches */}
                {guideResults.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Guide Matches:
                    </h4>
                    <div className="space-y-3">
                      {guideResults.map((guide, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-muted/30 rounded-lg border space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-semibold">
                                {guide.make} {guide.model}
                              </div>
                              {guide.trim && (
                                <div className="text-sm text-muted-foreground">
                                  {guide.trim}
                                </div>
                              )}
                              {guide.type && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Type: {guide.type}
                                </div>
                              )}
                            </div>
                            <CopyToClipboard
                              text={formatVehicleDescription(guide)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSimilarityBadgeColor(
                                guide.similarity_score
                              )}`}
                            >
                              {(guide.similarity_score * 100).toFixed(1)}% match
                            </span>
                          </div>
                          {guide.values && guide.values.length > 0 && (
                            <div>
                              <div className="font-medium text-muted-foreground text-xs mb-2">
                                Values ({guide.values.length}):
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                <table className="w-full text-sm border">
                                  <thead>
                                    <tr className="bg-muted/50">
                                      <th className="px-2 py-1 text-left border-b">
                                        Tax Year
                                      </th>
                                      <th className="px-2 py-1 text-left border-b">
                                        Model Year
                                      </th>
                                      <th className="px-2 py-1 text-right border-b">
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {guide.values.map(
                                      (v: GuideValue, i: number) => {
                                        const isVinYear =
                                          v.year === vinModelYear;
                                        return (
                                          <tr
                                            key={i}
                                            className={`border-b last:border-b-0 ${
                                              isVinYear
                                                ? "bg-blue-50 font-semibold"
                                                : ""
                                            }`}
                                          >
                                            <td className="px-2 py-1">
                                              {v.guide_year}
                                            </td>
                                            <td className="px-2 py-1">
                                              {v.year === 9999
                                                ? "Default"
                                                : v.year}
                                              {isVinYear && (
                                                <span className="ml-1 text-blue-600">
                                                  ★
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-2 py-1 text-right">
                                              ${v.value.toLocaleString()}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No guide matches found
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
