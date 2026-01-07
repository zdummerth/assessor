"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

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
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Guide Id</th>
                    <th className="px-4 py-2 text-left">Similarity Score</th>
                    <th className="px-4 py-2 text-left">Years</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2">{item.description || "-"}</td>
                      <td className="px-4 py-2">{item.guide_id || "-"}</td>
                      <td className="px-4 py-2">
                        {item.similarity_score || "-"}
                      </td>
                      <td className="px-4 py-2">{item.years || "-"}</td>
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
                <div className="space-y-1">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-muted-foreground">
                      Description:
                    </span>
                    <span>{item.description || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-muted-foreground">
                      Guide Id:
                    </span>
                    <span>{item.guide_id || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-muted-foreground">
                      Similarity Score:
                    </span>
                    <span>{item.similarity_score || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-muted-foreground">
                      Years:
                    </span>
                    <span>{item.years || "-"}</span>
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
