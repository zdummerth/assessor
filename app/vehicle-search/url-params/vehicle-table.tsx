import { createClient } from "@/lib/supabase/server";
import {
  SearchVehicleUnifiedResult,
  SearchVehicleUnifiedParams,
} from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NhtsaResultCard } from "./nhtsa-result-card";
import CopyToClipboard from "@/components/copy-to-clipboard";

interface VehicleTableProps {
  query: string;
  guideYear: number;
  matchLimit: number;
  searchType: "auto" | "vin" | "description";
}

interface ValueBadgesProps {
  values: Array<{ year: number; value: number }>;
  modelYear?: string | null;
}

function ValueBadges({ values, modelYear }: ValueBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((val, valIndex) => {
        const isModelYear =
          modelYear != null && String(val.year) === String(modelYear);
        const displayYear = val.year == 9999 ? "Default" : val.year;
        return (
          <span
            key={valIndex}
            className={`text-xs px-2 py-1 rounded border ${
              isModelYear
                ? "bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {displayYear}: ${val.value.toLocaleString()}
          </span>
        );
      })}
    </div>
  );
}

interface GuideMatchesProps {
  matches: Array<{
    make: string;
    model: string;
    trim?: string | null;
    type?: string | null;
    similarity_score: number;
    values?: Array<{ year: number; value: number }>;
  }>;
  modelYear?: string | null;
}

function GuideMatches({ matches, modelYear }: GuideMatchesProps) {
  if (!matches.length) return null;

  return (
    <div className="mt-3 border-t pt-3">
      <h4 className="text-sm font-semibold mb-2">Guide Matches:</h4>
      <div className="grid gap-2">
        {matches.map((match, matchIndex) => (
          <div
            key={matchIndex}
            className="bg-gray-50 p-3 rounded-md border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex gap-4">
                  <p className="font-medium">
                    {match.make} {match.model}
                    {match.trim && ` ${match.trim}`}
                  </p>
                  <CopyToClipboard
                    text={`${match.make} ${match.model} ${match.trim ?? ""}`}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {match.type && <Badge variant="outline">{match.type}</Badge>}
                <Badge variant="secondary">
                  {(match.similarity_score * 100).toFixed(0)}% match
                </Badge>
              </div>
            </div>
            {match.values && match.values.length > 0 && (
              <ValueBadges values={match.values} modelYear={modelYear} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface VinResultCardProps {
  result: any;
  modelYear?: string | null;
}

function VinResultCard({ result, modelYear }: VinResultCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1">
          <div className="flex gap-4">
            <h3 className="font-semibold text-lg font-mono">{result.vin}</h3>
            <CopyToClipboard text={result.vin} />
          </div>
          {result.vin_description && (
            <div className="flex gap-4">
              <p className="text-sm text-gray-600 mt-1">
                {result.vin_description}
              </p>
              <CopyToClipboard text={result.vin_description} />
            </div>
          )}
          {modelYear && (
            <p className="text-sm text-gray-500 mt-1">Year: {modelYear}</p>
          )}
        </div>
        <div className="flex gap-2">
          {result.type && <Badge variant="outline">{result.type}</Badge>}
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            VIN Lookup
          </Badge>
        </div>
      </div>
    </Card>
  );
}

interface DescriptionResultCardProps {
  result: any;
  modelYear?: string | null;
}

function DescriptionResultCard({
  result,
  modelYear,
}: DescriptionResultCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1">
          <div className="flex gap-4">
            <h3 className="font-semibold text-lg">
              {result.make} {result.model}
              {result.trim && ` ${result.trim}`}
            </h3>
            <CopyToClipboard
              text={`${result.make} ${result.model} ${result.trim ?? ""}`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          {result.type && <Badge variant="outline">{result.type}</Badge>}
          <Badge variant="secondary">
            {(result.similarity_score * 100).toFixed(0)}% match
          </Badge>
        </div>
      </div>
      {result.values && result.values.length > 0 && (
        <div className="mt-3 border-t pt-2">
          <ValueBadges values={result.values} modelYear={modelYear} />
        </div>
      )}
    </Card>
  );
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
      <div className="space-y-5">
        {results.map((result: any, index: number) => {
          const modelYear =
            result.model_year ?? result.extracted_fields?.model_year;
          const guideMatches = result.guide_matches || [];

          let resultCard;
          if ("vin" in result && !result.api_data) {
            resultCard = (
              <VinResultCard result={result} modelYear={modelYear} />
            );
          } else if ("vehicle_id" in result && "similarity_score" in result) {
            resultCard = (
              <DescriptionResultCard result={result} modelYear={modelYear} />
            );
          } else if ("api_data" in result) {
            resultCard = <NhtsaResultCard result={result} index={index} />;
          }

          const multiResults = results.length > 1;
          // add borders between results if multiple results
          return (
            <div
              key={`result-${index}`}
              className={multiResults ? "border p-4" : ""}
            >
              {resultCard}
              <GuideMatches matches={guideMatches} modelYear={modelYear} />
            </div>
          );
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
