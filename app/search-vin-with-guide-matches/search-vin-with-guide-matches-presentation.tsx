"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CopyToClipboard from "@/components/copy-to-clipboard";

interface GuideMatch {
  guide_id: number;
  description: string;
  years: string;
  similarity_score: number;
}

interface VinMatch {
  vin_id: number;
  vin: string;
  model_year: string;
  type: string;
  vin_description: string;
  guide_results: any; // Accept any type from Supabase (Json type)
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

  const getSimilarityColor = (score: number): string => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-blue-500";
    if (score >= 0.4) return "bg-yellow-500";
    return "bg-orange-500";
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

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.map((item) => {
          const guideResults = parseGuideResults(item.guide_results);

          return (
            <Card key={item.vin_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">{item.vin}</span>
                    <CopyToClipboard text={item.vin} />
                  </div>
                  <Badge variant="secondary">
                    {guideResults.length} matches
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VIN Details */}
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model Year:</span>
                    <span className="font-medium">
                      {item.model_year || "-"}
                    </span>
                  </div>
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
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Guide Matches:
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {guideResults.map((guide, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-muted/30 rounded-lg border space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              className={`${getSimilarityColor(guide.similarity_score)} text-white`}
                            >
                              {(guide.similarity_score * 100).toFixed(1)}% match
                            </Badge>
                            {guide.years && (
                              <span className="text-xs text-muted-foreground">
                                Years: {guide.years}
                              </span>
                            )}
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm flex-1">
                              {guide.description}
                            </p>
                            <CopyToClipboard text={guide.description} />
                          </div>
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
