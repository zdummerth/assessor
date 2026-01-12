"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CopyToClipboard from "@/components/copy-to-clipboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { DecodeVinNhtsaResult } from "./types";
import { useState } from "react";

interface DecodeVinNhtsaPresentationProps {
  data: DecodeVinNhtsaResult;
  searchedVin?: string;
  error?: string;
  isLoading?: boolean;
}

export function DecodeVinNhtsaPresentation({
  data,
  searchedVin,
  error,
  isLoading,
}: DecodeVinNhtsaPresentationProps) {
  const [showApiData, setShowApiData] = useState(false);

  const getConfidenceBadgeColor = (level: string) => {
    if (level === "high") return "bg-green-100 text-green-800 border-green-200";
    if (level === "medium")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatVehicleDescription = (match: any) => {
    return `${match.make} ${match.model}${match.trim ? ` ${match.trim}` : ""}`;
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

  if (!data) {
    return null;
  }

  const { extracted_fields, guide_matches, match_count, match_parameters } =
    data;

  return (
    <div className="space-y-4">
      {/* VIN and Extracted Fields Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono">{searchedVin}</span>
              {searchedVin && <CopyToClipboard text={searchedVin} />}
            </div>
            <Badge variant="outline">
              {match_count} {match_count === 1 ? "match" : "matches"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Make</div>
              <div className="font-medium">
                {extracted_fields.make || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Model</div>
              <div className="font-medium">
                {extracted_fields.model || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Model Year</div>
              <div className="font-medium">
                {extracted_fields.model_year || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Trim</div>
              <div className="font-medium">
                {extracted_fields.trim || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Displacement</div>
              <div className="font-medium">
                {extracted_fields.displacement
                  ? `${extracted_fields.displacement}L`
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Body Class</div>
              <div className="font-medium">
                {extracted_fields.body_class || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Drive Type</div>
              <div className="font-medium">
                {extracted_fields.drive_type || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Fuel Type</div>
              <div className="font-medium">
                {extracted_fields.fuel_type || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Vehicle Type</div>
              <div className="font-medium">
                {extracted_fields.vehicle_type || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Series</div>
              <div className="font-medium">
                {extracted_fields.series || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Series 2</div>
              <div className="font-medium">
                {extracted_fields.series2 || "N/A"}
              </div>
            </div>
          </div>

          {/* Search String */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">Search String</div>
            <div className="font-mono text-sm">
              {extracted_fields.search_string || "N/A"}
            </div>
          </div>

          {/* Match Parameters */}
          <Collapsible className="mt-4">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              Match Parameters
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  Year Tolerance:{" "}
                  <span className="font-medium">
                    {match_parameters.year_tolerance}
                  </span>
                </div>
                <div>
                  Match:{" "}
                  <span className="font-medium">
                    {match_parameters.match_threshold}
                  </span>
                </div>
                <div>
                  Make:{" "}
                  <span className="font-medium">
                    {match_parameters.make_threshold}
                  </span>
                </div>
                <div>
                  Model:{" "}
                  <span className="font-medium">
                    {match_parameters.model_threshold}
                  </span>
                </div>
                <div>
                  Trim:{" "}
                  <span className="font-medium">
                    {match_parameters.trim_threshold}
                  </span>
                </div>
                <div>
                  Limit:{" "}
                  <span className="font-medium">
                    {match_parameters.result_limit}
                  </span>
                </div>
                <div>
                  Guide Year:{" "}
                  <span className="font-medium">
                    {match_parameters.guide_year || "All"}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Raw API Data */}
          <Collapsible open={showApiData} onOpenChange={setShowApiData}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4">
              Raw NHTSA API Data
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showApiData ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <pre className="bg-muted p-4 rounded-md overflow-auto text-xs max-h-96">
                {JSON.stringify(data.api_data, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Guide Matches */}
      {guide_matches && guide_matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Guide Vehicle Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guide_matches.map((match, index) => (
                <Card key={match.vehicle_id} className="border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {formatVehicleDescription(match)}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">
                          {match.vehicle_id} • {match.type || "N/A"}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge
                          className={getConfidenceBadgeColor(
                            match.match_scores.confidence_level
                          )}
                        >
                          {match.match_scores.confidence_level}
                        </Badge>
                        <Badge variant="outline">
                          Score: {match.match_scores.final_score.toFixed(3)}
                        </Badge>
                        {match.value_count > 0 && (
                          <Badge variant="secondary">
                            {match.value_count}{" "}
                            {match.value_count === 1 ? "value" : "values"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Description */}
                    {match.description && (
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground">
                          Description
                        </div>
                        <div className="text-sm">{match.description}</div>
                      </div>
                    )}

                    {/* Match Scores */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
                        Similarity Scores
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
                          <div>
                            Make:{" "}
                            <span className="font-medium">
                              {match.match_scores.make_similarity.toFixed(3)}
                            </span>
                          </div>
                          <div>
                            Model:{" "}
                            <span className="font-medium">
                              {match.match_scores.model_similarity.toFixed(3)}
                            </span>
                          </div>
                          <div>
                            Trim:{" "}
                            <span className="font-medium">
                              {match.match_scores.trim_similarity.toFixed(3)}
                            </span>
                          </div>
                          <div>
                            Word Trim:{" "}
                            <span className="font-medium">
                              {match.match_scores.word_trim_similarity.toFixed(
                                3
                              )}
                            </span>
                          </div>
                          <div>
                            Composite:{" "}
                            <span className="font-medium">
                              {match.match_scores.composite_score.toFixed(3)}
                            </span>
                          </div>
                          <div>
                            Bonus:{" "}
                            <span className="font-medium">
                              {match.match_scores.bonus_score.toFixed(3)}
                            </span>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Values Table */}
                    {match.values && match.values.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">
                          Vehicle Values
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Guide Year</TableHead>
                              <TableHead>Model Year</TableHead>
                              <TableHead className="text-right">
                                Value
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {match.values.map((value, vIndex) => (
                              <TableRow key={vIndex}>
                                <TableCell>{value.guide_year}</TableCell>
                                <TableCell>{value.year}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(value.value)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Matches */}
      {(!guide_matches || guide_matches.length === 0) && (
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-center">
              No guide matches found. Try adjusting the threshold parameters.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
