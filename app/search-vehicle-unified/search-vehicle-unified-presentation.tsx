"use client";

import React, { useState, memo, useMemo } from "react";
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
import {
  SearchVehicleUnifiedResult,
  VinResult,
  DescriptionResult,
  NhtsaApiResult,
  GuideValue,
} from "./types";

// Module-level cache for formatting functions
const currencyFormatCache = new Map<number, string>();
const displayValueCache = new Map<string, GuideValue | null>();

function getCachedFormattedCurrency(value: number): string {
  if (currencyFormatCache.has(value)) {
    return currencyFormatCache.get(value)!;
  }
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  currencyFormatCache.set(value, formatted);
  return formatted;
}

function getCachedDisplayValue(
  values: GuideValue[] | undefined,
  modelYear?: number
): GuideValue | null {
  if (!values || values.length === 0) return null;

  // Create cache key from values and modelYear
  const cacheKey = `${values.map((v) => `${v.guide_year}-${v.year}-${v.value}`).join("|")}-${modelYear || "none"}`;

  if (displayValueCache.has(cacheKey)) {
    return displayValueCache.get(cacheKey) ?? null;
  }

  let result: GuideValue | null = null;

  // If modelYear is provided (VIN search), try to find matching year
  if (modelYear) {
    const matchingYears = values.filter((v) => v.year === modelYear);
    if (matchingYears.length > 0) {
      const mostRecentGuide = matchingYears.sort(
        (a, b) => b.guide_year - a.guide_year
      )[0];
      result = mostRecentGuide;
    }
  }

  // Otherwise, get most recent value (highest model year, then highest guide year)
  if (!result) {
    const sorted = [...values].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.guide_year - a.guide_year;
    });
    result = sorted[0];
  }

  displayValueCache.set(cacheKey, result);
  return result;
}

interface SearchVehicleUnifiedPresentationProps {
  data: SearchVehicleUnifiedResult;
  searchText?: string;
  error?: string;
  isLoading?: boolean;
}

export function SearchVehicleUnifiedPresentation({
  data,
  searchText,
  error,
  isLoading,
}: SearchVehicleUnifiedPresentationProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(index)
        ? newExpanded.delete(index)
        : newExpanded.add(index);
      return newExpanded;
    });
  };

  const getSourceBadge = (source: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      vin_lookup_table: {
        label: "VIN Lookup Table",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      nhtsa_api: {
        label: "NHTSA API",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      guide_vehicles: {
        label: "Guide Database",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      none: {
        label: "No Match",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };

    const badge = badges[source] || badges.none;
    return (
      <Badge variant="outline" className={badge.color}>
        {badge.label}
      </Badge>
    );
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
          <div className="text-red-500" role="alert">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { search_text, search_type, source, match_count, results, message } =
    data;

  if (match_count === 0 || source === "none") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>No Results Found</span>
            {getSourceBadge(source)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {message ? message : `No matches found for "${search_text}"`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2">
        <CardHeader className="bg-muted/30 border-b">
          <div className="space-y-4">
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-lg break-all">
                  {search_text}
                </span>
                {search_text ? <CopyToClipboard text={search_text} /> : null}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="font-medium">
                  {search_type === "vin" ? "VIN Search" : "Description Search"}
                </Badge>
                {getSourceBadge(source)}
              </div>
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground">Matches Found:</span>
                <span className="text-2xl font-bold text-primary">
                  {match_count}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results */}
      {search_type === "vin" && source !== "nhtsa_api" ? (
        <VinResultsDisplay results={results as VinResult[]} />
      ) : null}

      {search_type === "description" ? (
        <DescriptionResultsDisplay results={results as DescriptionResult[]} />
      ) : null}

      {source === "nhtsa_api" ? (
        <NhtsaApiResultDisplay results={results as NhtsaApiResult[]} />
      ) : null}
    </div>
  );
}

const VinResultsDisplay = memo(function VinResultsDisplay({
  results,
}: {
  results: VinResult[];
}) {
  const [expandedVins, setExpandedVins] = useState<Set<number>>(new Set());

  const toggleVin = (index: number) => {
    setExpandedVins((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(index)
        ? newExpanded.delete(index)
        : newExpanded.add(index);
      return newExpanded;
    });
  };

  return (
    <div className="space-y-6">
      {results.map((vinResult, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-muted/30 border-b pb-3">
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-lg">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-base break-all">
                  {vinResult.vin}
                </span>
                <CopyToClipboard text={vinResult.vin} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {vinResult.model_year ? (
                  <Badge variant="secondary">{vinResult.model_year}</Badge>
                ) : null}
                {vinResult.type ? (
                  <Badge variant="secondary">{vinResult.type}</Badge>
                ) : null}
              </div>
            </CardTitle>
            {vinResult.vin_description ? (
              <p className="text-sm text-muted-foreground mt-2">
                {vinResult.vin_description}
              </p>
            ) : null}
          </CardHeader>
          <CardContent className="pt-4">
            {vinResult.guide_matches && vinResult.guide_matches.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-foreground">
                    Guide Matches
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {vinResult.guide_matches.length} matches
                  </Badge>
                </div>
                <GuideMatchesTable
                  matches={vinResult.guide_matches}
                  modelYear={
                    vinResult.model_year
                      ? parseInt(vinResult.model_year)
                      : undefined
                  }
                />
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No guide matches found for this VIN
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

const DescriptionResultsDisplay = memo(function DescriptionResultsDisplay({
  results,
}: {
  results: DescriptionResult[];
}) {
  return (
    <Card>
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center justify-between">
          <span>Guide Vehicle Matches</span>
          <Badge variant="outline" className="text-xs">
            {results.length} vehicles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <GuideMatchesTable matches={results} />
      </CardContent>
    </Card>
  );
});

const NhtsaApiResultDisplay = memo(function NhtsaApiResultDisplay({
  results,
}: {
  results: NhtsaApiResult[];
}) {
  const result = results[0]; // NHTSA API returns a single result wrapped in array

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-purple-50 border-b">
        <CardTitle className="text-lg">NHTSA API Result</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Vehicle information decoded from VIN via NHTSA API
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {result.extracted_fields ? (
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">
                Extracted Vehicle Information
              </h4>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.extracted_fields.make ? (
                  <>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground uppercase">
                        Make
                      </dt>
                      <dd className="text-sm font-medium">
                        {result.extracted_fields.make}
                      </dd>
                    </div>
                  </>
                ) : null}
                {result.extracted_fields.model ? (
                  <>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground uppercase">
                        Model
                      </dt>
                      <dd className="text-sm font-medium">
                        {result.extracted_fields.model}
                      </dd>
                    </div>
                  </>
                ) : null}
                {result.extracted_fields.model_year ? (
                  <>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground uppercase">
                        Year
                      </dt>
                      <dd className="text-sm font-medium">
                        {result.extracted_fields.model_year}
                      </dd>
                    </div>
                  </>
                ) : null}
                {result.extracted_fields.trim ? (
                  <>
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground uppercase">
                        Trim
                      </dt>
                      <dd className="text-sm font-medium">
                        {result.extracted_fields.trim}
                      </dd>
                    </div>
                  </>
                ) : null}
              </dl>
            </div>
          ) : null}

          {result.guide_matches && result.guide_matches.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-foreground">
                  Similar Vehicles in Guide Database
                </h4>
                <Badge variant="outline" className="text-xs">
                  {result.match_count} matches
                </Badge>
              </div>
              <GuideMatchesTable matches={result.guide_matches} />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
});

const GuideMatchesTable = memo(function GuideMatchesTable({
  matches,
  modelYear,
}: {
  matches: Array<{
    vehicle_id: string;
    make: string;
    model: string;
    trim?: string | null;
    type?: string | null;
    similarity_score?: number;
    values?: GuideValue[];
  }>;
  modelYear?: number;
}) {
  const [expandedMatches, setExpandedMatches] = useState<Set<string>>(
    new Set()
  );

  const toggleMatch = (vehicleId: string) => {
    setExpandedMatches((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(vehicleId)
        ? newExpanded.delete(vehicleId)
        : newExpanded.add(vehicleId);
      return newExpanded;
    });
  };

  const hasSimilarityScores = matches.some(
    (m) => m.similarity_score !== undefined
  );

  return (
    <div className="border rounded-lg overflow-x-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Vehicle</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            {hasSimilarityScores ? (
              <TableHead className="font-semibold text-center">
                Match Score
              </TableHead>
            ) : null}
            <TableHead className="font-semibold text-right">Year</TableHead>
            <TableHead className="font-semibold text-right">Value</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, idx) => {
            const displayValue = getCachedDisplayValue(match.values, modelYear);
            const similarityPercent = match.similarity_score
              ? (match.similarity_score * 100).toFixed(1)
              : null;
            return (
              <React.Fragment key={match.vehicle_id || idx}>
                <TableRow className="hover:bg-muted/30 border-b">
                  <TableCell className="min-w-[200px]">
                    <div>
                      <div className="font-semibold text-foreground break-words">
                        {match.make} {match.model}
                      </div>
                      {match.trim ? (
                        <div className="text-xs text-muted-foreground break-words">
                          {match.trim}
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {match.type ? (
                      <Badge variant="outline" className="text-xs">
                        {match.type}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  {hasSimilarityScores ? (
                    <TableCell className="text-center">
                      {match.similarity_score !== undefined ? (
                        <div className="inline-flex items-center gap-1">
                          <div className="w-8 h-6 bg-gradient-to-r from-red-200 to-green-200 rounded relative">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded"
                              style={{
                                width: `${similarityPercent}%`,
                              }}
                            />
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                          >
                            {similarityPercent}%
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ) : null}
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {displayValue?.year || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-foreground">
                      {displayValue
                        ? getCachedFormattedCurrency(displayValue.value)
                        : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {match.values && match.values.length > 0 ? (
                      <button
                        onClick={() => toggleMatch(match.vehicle_id)}
                        className="inline-flex items-center justify-center p-2 hover:bg-accent rounded-md transition-colors"
                        aria-label={
                          expandedMatches.has(match.vehicle_id)
                            ? "Collapse values"
                            : "Expand values"
                        }
                        type="button"
                        title="View all available years and values"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedMatches.has(match.vehicle_id)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </TableCell>
                </TableRow>
                {expandedMatches.has(match.vehicle_id) && match.values ? (
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={6}>
                      <div className="py-3 px-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          All Available Years
                        </p>
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                              <TableHead className="text-xs">
                                Guide Year
                              </TableHead>
                              <TableHead className="text-xs">
                                Model Year
                              </TableHead>
                              <TableHead className="text-xs text-right">
                                Value
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {match.values.map((val, idx) => (
                              <TableRow key={idx} className="hover:bg-muted/30">
                                <TableCell className="text-xs">
                                  {val.guide_year}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {val.year}
                                </TableCell>
                                <TableCell className="text-xs text-right font-medium">
                                  {getCachedFormattedCurrency(val.value)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
