"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";
import CopyToClipboard from "@/components/copy-to-clipboard";

interface SearchGuideByDescriptionPresentationProps {
  data: any[];
  error?: string;
  isLoading?: boolean;
}

export function SearchGuideByDescriptionPresentation({
  data,
  error,
  isLoading,
}: SearchGuideByDescriptionPresentationProps) {
  const [view, setView] = useState<"table" | "card">("table");

  const getSimilarityBadgeColor = (score: number) => {
    if (score >= 1.0) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 0.8) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 0.6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 0.4) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatVehicleDescription = (item: any) => {
    return `${item.make} ${item.model}${item.trim ? ` ${item.trim}` : ""}`;
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
      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
        >
          <Table className="h-4 w-4 mr-2" />
          Table
        </Button>
        <Button
          variant={view === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("card")}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Cards
        </Button>
      </div>

      {/* Table View */}
      {view === "table" && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Make/Model/Trim</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Similarity</th>
                    <th className="px-4 py-2 text-left">Values</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.make} {item.model}
                            </div>
                            {item.trim && (
                              <div className="text-sm text-muted-foreground">
                                {item.trim}
                              </div>
                            )}
                          </div>
                          <CopyToClipboard
                            text={formatVehicleDescription(item)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">{item.type || "-"}</td>
                      <td className="px-4 py-2">
                        {item.similarity_score ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSimilarityBadgeColor(
                              item.similarity_score
                            )}`}
                          >
                            {(item.similarity_score * 100).toFixed(1)}%
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {item.values && item.values.length > 0 ? (
                          <div className="max-h-32 overflow-y-auto">
                            <table className="w-full text-xs border">
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
                                {item.values.map((v: any, i: number) => (
                                  <tr
                                    key={i}
                                    className="border-b last:border-b-0"
                                  >
                                    <td className="px-2 py-1">
                                      {v.guide_year}
                                    </td>
                                    <td className="px-2 py-1">
                                      {v.year === 9999 ? "Default" : v.year}
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                      ${v.value.toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {data.length} {data.length === 1 ? "result" : "results"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="text-sm font-semibold">Result #{index + 1}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="py-2 border-b">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-muted-foreground text-sm">
                          Vehicle:
                        </div>
                        <div className="font-semibold">
                          {item.make} {item.model}
                        </div>
                        {item.trim && (
                          <div className="text-sm text-muted-foreground">
                            {item.trim}
                          </div>
                        )}
                      </div>
                      <CopyToClipboard text={formatVehicleDescription(item)} />
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-muted-foreground">
                      Type:
                    </span>
                    <span>{item.type || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-muted-foreground">
                      Similarity:
                    </span>
                    {item.similarity_score ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSimilarityBadgeColor(
                          item.similarity_score
                        )}`}
                      >
                        {(item.similarity_score * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                  <div className="py-2">
                    <div className="font-medium text-muted-foreground text-sm mb-2">
                      Values ({item.values?.length || 0}):
                    </div>
                    {item.values && item.values.length > 0 ? (
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
                            {item.values.map((v: any, i: number) => (
                              <tr key={i} className="border-b last:border-b-0">
                                <td className="px-2 py-1">{v.guide_year}</td>
                                <td className="px-2 py-1">
                                  {v.year === 9999 ? "Default" : v.year}
                                </td>
                                <td className="px-2 py-1 text-right">
                                  ${v.value.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
