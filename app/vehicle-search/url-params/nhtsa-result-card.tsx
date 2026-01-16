"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NhtsaResultCardProps {
  result: {
    vin: string;
    api_data: Record<string, any>;
    extracted_fields: {
      make?: string | null;
      model?: string | null;
      model_year?: string | null;
      trim?: string | null;
      body_class?: string | null;
      engine_configuration?: string | null;
      engine_cylinders?: string | null;
      displacement?: string | null;
      fuel_type?: string | null;
      transmission?: string | null;
      drive_type?: string | null;
    };
    search_description: string;
    guide_matches: Array<{
      make: string;
      model: string;
      trim?: string | null;
      description: string;
      similarity_score: number;
      values?: Array<{
        year: number;
        value: number;
      }>;
    }>;
  };
  index: number;
}

export function NhtsaResultCard({ result, index }: NhtsaResultCardProps) {
  const [showRawData, setShowRawData] = useState(false);

  // Filter api_data to only show non-empty and non-'Not Applicable' fields
  const filteredApiData = result.api_data
    ? Object.entries(result.api_data).filter(
        ([_, value]) =>
          value !== "" &&
          value !== "Not Applicable" &&
          value !== null &&
          value !== undefined
      )
    : [];

  return (
    <Card
      key={`nhtsa-${result.vin}-${index}`}
      className="p-4 border-2 border-purple-200"
    >
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg font-mono">{result.vin}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {result.search_description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              NHTSA API
            </Badge>
            {filteredApiData.length > 0 && (
              <Button
                onClick={() => setShowRawData(true)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                View Raw Data
              </Button>
            )}
          </div>
        </div>

        {/* Extracted Fields */}
        {result.extracted_fields && (
          <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
            <h4 className="text-sm font-semibold mb-2 text-purple-900">
              Extracted Vehicle Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {result.extracted_fields.make && (
                <div>
                  <span className="text-gray-600">Make:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.make}
                  </span>
                </div>
              )}
              {result.extracted_fields.model && (
                <div>
                  <span className="text-gray-600">Model:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.model}
                  </span>
                </div>
              )}
              {result.extracted_fields.model_year && (
                <div>
                  <span className="text-gray-600">Year:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.model_year}
                  </span>
                </div>
              )}
              {result.extracted_fields.trim && (
                <div>
                  <span className="text-gray-600">Trim:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.trim}
                  </span>
                </div>
              )}
              {result.extracted_fields.body_class && (
                <div>
                  <span className="text-gray-600">Body Class:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.body_class}
                  </span>
                </div>
              )}
              {result.extracted_fields.engine_configuration && (
                <div>
                  <span className="text-gray-600">Engine:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.engine_configuration}
                  </span>
                </div>
              )}
              {result.extracted_fields.engine_cylinders && (
                <div>
                  <span className="text-gray-600">Cylinders:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.engine_cylinders}
                  </span>
                </div>
              )}
              {result.extracted_fields.displacement && (
                <div>
                  <span className="text-gray-600">Displacement:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.displacement}
                  </span>
                </div>
              )}
              {result.extracted_fields.fuel_type && (
                <div>
                  <span className="text-gray-600">Fuel Type:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.fuel_type}
                  </span>
                </div>
              )}
              {result.extracted_fields.transmission && (
                <div>
                  <span className="text-gray-600">Transmission:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.transmission}
                  </span>
                </div>
              )}
              {result.extracted_fields.drive_type && (
                <div>
                  <span className="text-gray-600">Drive Type:</span>{" "}
                  <span className="font-medium">
                    {result.extracted_fields.drive_type}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guide Matches from NHTSA */}
        {result.guide_matches && result.guide_matches.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-semibold mb-2">Guide Matches:</h4>
            <div className="grid gap-2">
              {result.guide_matches.slice(0, 3).map((match, matchIndex) => (
                <div key={matchIndex} className="bg-gray-50 p-3 rounded-md">
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
                      {(match.similarity_score * 100).toFixed(0)}% match
                    </Badge>
                  </div>
                  {match.values && match.values.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {match.values.map((val, valIndex) => (
                        <span
                          key={valIndex}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {val.year}: ${val.value.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Raw API Data Dialog */}
      <Dialog open={showRawData} onOpenChange={setShowRawData}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Raw NHTSA API Data</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pr-4">
            {filteredApiData.map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {key}
                </div>
                <div className="text-sm">{String(value)}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
