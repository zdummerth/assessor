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
import CopyToClipboard from "@/components/copy-to-clipboard";

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
  console.log("NHTSA Result:", result);

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
            <div className="flex gap-4 items-center">
              <h3 className="font-semibold text-lg font-mono">{result.vin}</h3>
              <CopyToClipboard text={result.vin} />
            </div>
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
              NHTSA Vehicle Information
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
              {result.api_data?.DisplacementCC && (
                <div>
                  <span className="text-gray-600">Displacement CC:</span>{" "}
                  <span className="font-medium">
                    {result.api_data.DisplacementCC}
                  </span>
                </div>
              )}
              {result.api_data?.VehicleType && (
                <div>
                  <span className="text-gray-600">Vehicle Type:</span>{" "}
                  <span className="font-medium">
                    {result.api_data.VehicleType}
                  </span>
                </div>
              )}
              {result.api_data?.TrailerBodyType &&
                result.api_data?.TrailerBodyType !== "Not Applicable" && (
                  <div>
                    <span className="text-gray-600">Trailer Body Type:</span>{" "}
                    <span className="font-medium">
                      {result.api_data.TrailerBodyType}
                    </span>
                  </div>
                )}
              {result.api_data?.TrailerLength && (
                <div>
                  <span className="text-gray-600">Trailer Length:</span>{" "}
                  <span className="font-medium">
                    {result.api_data.TrailerLength}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guide matches are rendered by the parent component (vehicle table) */}
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
