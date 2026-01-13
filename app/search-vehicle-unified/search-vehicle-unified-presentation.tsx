"use client";

import React, { useState } from "react";
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
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
          <div className="text-red-500">Error: {error}</div>
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
            {message || `No matches found for "${search_text}"`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono">{search_text}</span>
              {search_text && <CopyToClipboard text={search_text} />}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {search_type === "vin" ? "VIN Search" : "Description Search"}
              </Badge>
              {getSourceBadge(source)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">
                Total Matches:{" "}
              </span>
              <span className="font-semibold">{match_count}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {search_type === "vin" && source !== "nhtsa_api" && (
        <VinResultsDisplay results={results as VinResult[]} />
      )}

      {search_type === "description" && (
        <DescriptionResultsDisplay results={results as DescriptionResult[]} />
      )}

      {source === "nhtsa_api" && (
        <NhtsaApiResultDisplay results={results as NhtsaApiResult[]} />
      )}
    </div>
  );
}

function VinResultsDisplay({ results }: { results: VinResult[] }) {
  const [expandedVins, setExpandedVins] = useState<Set<number>>(new Set());

  const toggleVin = (index: number) => {
    const newExpanded = new Set(expandedVins);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedVins(newExpanded);
  };

  return (
    <div className="space-y-4">
      {results.map((vinResult, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono">{vinResult.vin}</span>
                <CopyToClipboard text={vinResult.vin} />
              </div>
              <div className="flex items-center gap-2">
                {vinResult.model_year && (
                  <Badge variant="outline">{vinResult.model_year}</Badge>
                )}
                {vinResult.type && (
                  <Badge variant="outline">{vinResult.type}</Badge>
                )}
              </div>
            </CardTitle>
            {vinResult.vin_description && (
              <p className="text-sm text-muted-foreground">
                {vinResult.vin_description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {vinResult.guide_matches && vinResult.guide_matches.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  Guide Matches ({vinResult.guide_matches.length})
                </h4>
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
              <p className="text-sm text-muted-foreground">
                No guide matches found
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DescriptionResultsDisplay({
  results,
}: {
  results: DescriptionResult[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Vehicle Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <GuideMatchesTable matches={results} />
      </CardContent>
    </Card>
  );
}

function NhtsaApiResultDisplay({ results }: { results: NhtsaApiResult[] }) {
  const result = results[0]; // NHTSA API returns a single result wrapped in array

  return (
    <Card>
      <CardHeader>
        <CardTitle>NHTSA API Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result.extracted_fields && (
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Extracted Vehicle Information
              </h4>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {result.extracted_fields.make && (
                  <>
                    <dt className="text-muted-foreground">Make:</dt>
                    <dd>{result.extracted_fields.make}</dd>
                  </>
                )}
                {result.extracted_fields.model && (
                  <>
                    <dt className="text-muted-foreground">Model:</dt>
                    <dd>{result.extracted_fields.model}</dd>
                  </>
                )}
                {result.extracted_fields.model_year && (
                  <>
                    <dt className="text-muted-foreground">Year:</dt>
                    <dd>{result.extracted_fields.model_year}</dd>
                  </>
                )}
                {result.extracted_fields.trim && (
                  <>
                    <dt className="text-muted-foreground">Trim:</dt>
                    <dd>{result.extracted_fields.trim}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {result.guide_matches && result.guide_matches.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Guide Matches ({result.match_count})
              </h4>
              <GuideMatchesTable matches={result.guide_matches} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function GuideMatchesTable({
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDisplayValue = (values?: GuideValue[]) => {
    if (!values || values.length === 0) return null;

    // If modelYear is provided (VIN search), try to find matching year
    if (modelYear) {
      // Find most recent guide year for the model year
      const matchingYears = values.filter((v) => v.year === modelYear);
      if (matchingYears.length > 0) {
        const mostRecentGuide = matchingYears.sort(
          (a, b) => b.guide_year - a.guide_year
        )[0];
        return mostRecentGuide;
      }
    }

    // Otherwise, get most recent value (highest model year, then highest guide year)
    const sorted = [...values].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.guide_year - a.guide_year;
    });
    return sorted[0];
  };

  const toggleMatch = (vehicleId: string) => {
    const newExpanded = new Set(expandedMatches);
    if (newExpanded.has(vehicleId)) {
      newExpanded.delete(vehicleId);
    } else {
      newExpanded.add(vehicleId);
    }
    setExpandedMatches(newExpanded);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            {matches[0]?.similarity_score !== undefined && (
              <TableHead>Score</TableHead>
            )}
            <TableHead>Year</TableHead>
            <TableHead>Value</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, idx) => (
            <React.Fragment key={match.vehicle_id || idx}>
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {match.make} {match.model}
                    </div>
                    {match.trim && (
                      <div className="text-sm text-muted-foreground">
                        {match.trim}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{match.type || "—"}</TableCell>
                {match.similarity_score !== undefined && (
                  <TableCell>
                    <Badge variant="outline">
                      {(match.similarity_score * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  {(() => {
                    const displayValue = getDisplayValue(match.values);
                    return displayValue ? displayValue.year : "—";
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    const displayValue = getDisplayValue(match.values);
                    return displayValue
                      ? formatCurrency(displayValue.value)
                      : "—";
                  })()}
                </TableCell>
                <TableCell>
                  {match.values && match.values.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMatch(match.vehicle_id)}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedMatches.has(match.vehicle_id)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              {expandedMatches.has(match.vehicle_id) && match.values && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="py-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Guide Year</TableHead>
                            <TableHead>Model Year</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {match.values.map((val, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{val.guide_year}</TableCell>
                              <TableCell>{val.year}</TableCell>
                              <TableCell>{formatCurrency(val.value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
  size?: string;
}) {
  return <button {...props}>{children}</button>;
}
