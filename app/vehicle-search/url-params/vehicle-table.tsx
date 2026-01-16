import { createClient } from "@/lib/supabase/server";
import {
  SearchVehicleUnifiedResult,
  SearchVehicleUnifiedParams,
} from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NhtsaResultCard } from "./nhtsa-result-card";

interface VehicleTableProps {
  query: string;
  currentPage: number;
  guideYear: number;
  matchLimit: number;
  searchType: "auto" | "vin" | "description";
}

async function fetchVehicles(
  query: string,
  guideYear: number,
  matchLimit: number,
  searchType: "auto" | "vin" | "description"
): Promise<SearchVehicleUnifiedResult | null> {
  if (!query) return null;

  const supabase = await createClient();

  const params: SearchVehicleUnifiedParams = {
    p_search_text: query,
    p_search_type: searchType,
    p_guide_year: guideYear,
    p_match_limit: matchLimit,
  };

  const { data, error } = await supabase.rpc("search_vehicle_unified", params);

  if (error) {
    console.error("Database error:", error);
    return null;
  }

  return data as SearchVehicleUnifiedResult;
}

export default async function VehicleTable({
  query,
  currentPage,
  guideYear,
  matchLimit,
  searchType,
}: VehicleTableProps) {
  const data = await fetchVehicles(query, guideYear, matchLimit, searchType);

  if (!query) {
    return (
      <div className="mt-6 text-center text-gray-500">
        Enter a search term to find vehicles
      </div>
    );
  }

  if (!data || data.match_count === 0) {
    return (
      <div className="mt-6 text-center">
        <p className="text-gray-500">No vehicles found for "{query}"</p>
        <p className="text-sm text-gray-400 mt-2">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  // Simple pagination - slice results based on currentPage and matchLimit
  const startIndex = (currentPage - 1) * matchLimit;
  const endIndex = startIndex + matchLimit;
  const results = data.results;

  return (
    <div className="mt-6 space-y-4">
      {/* Search Summary */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline">{data.match_count} results</Badge>
        <Badge variant="secondary">Source: {data.source}</Badge>
        <Badge>Type: {data.search_type}</Badge>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((result: any, index: number) => {
          // Handle different result types
          if ("vin" in result && !result.api_data) {
            // VIN Result
            return (
              <Card key={`vin-${result.vin_id}-${index}`} className="p-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg font-mono">
                        {result.vin}
                      </h3>
                      {result.extracted_fields && (
                        <div className="mt-1 text-sm text-gray-600 space-y-0.5"></div>
                      )}
                      {result.vin_description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {result.vin_description}
                        </p>
                      )}
                      {result.model_year && (
                        <p className="text-sm text-gray-500">
                          Year: {result.model_year}
                        </p>
                      )}
                    </div>
                    {result.type && (
                      <Badge variant="outline">{result.type}</Badge>
                    )}
                  </div>

                  {/* Guide Matches */}
                  {result.guide_matches && result.guide_matches.length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-semibold mb-2">
                        Guide Matches:
                      </h4>
                      <div className="grid gap-2">
                        {result.guide_matches
                          .slice(0, 3)
                          .map((match: any, matchIndex: number) => (
                            <div
                              key={matchIndex}
                              className="bg-gray-50 p-3 rounded-md"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {match.make} {match.model}
                                    {match.trim && ` ${match.trim}`}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {match.description}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="ml-2">
                                  {(match.similarity_score * 100).toFixed(0)}%
                                  match
                                </Badge>
                              </div>
                              {match.values && match.values.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {match.values.map(
                                    (val: any, valIndex: number) => (
                                      <span
                                        key={valIndex}
                                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                      >
                                        {val.year}: $
                                        {val.value.toLocaleString()}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          } else if ("vehicle_id" in result && "similarity_score" in result) {
            // Description Result
            return (
              <Card key={`desc-${result.vehicle_id}-${index}`} className="p-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {result.make} {result.model}
                        {result.trim && ` ${result.trim}`}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {result.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {result.type && (
                        <Badge variant="outline">{result.type}</Badge>
                      )}
                      <Badge variant="secondary">
                        {(result.similarity_score * 100).toFixed(0)}% match
                      </Badge>
                    </div>
                  </div>

                  {/* Values */}
                  {result.values && result.values.length > 0 && (
                    <div className="border-t pt-2">
                      <div className="flex flex-wrap gap-2">
                        {result.values.map((val: any, valIndex: number) => (
                          <span
                            key={valIndex}
                            className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full"
                          >
                            {val.year}: ${val.value.toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          } else if ("api_data" in result) {
            // NHTSA API Result
            return (
              <NhtsaResultCard
                key={`nhtsa-${result.vin}-${index}`}
                result={result}
                index={index}
              />
            );
          }

          return null;
        })}
      </div>

      {data.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{data.error}</p>
        </div>
      )}

      {data.message && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">{data.message}</p>
        </div>
      )}
    </div>
  );
}
