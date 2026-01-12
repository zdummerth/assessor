"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Table } from "lucide-react";

interface SearchDevnetReviewsPresentationProps {
  data: any[];
  error?: string;
  isLoading?: boolean;
}

export function SearchDevnetReviewsPresentation({
  data,
  error,
  isLoading,
}: SearchDevnetReviewsPresentationProps) {
  const [view, setView] = useState<"table" | "card">("card");

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
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Kind</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Entity Type</th>
                    <th className="px-4 py-2 text-left">Entity ID</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                    <th className="px-4 py-2 text-left">Priority</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Days Until Due</th>
                    <th className="px-4 py-2 text-left">Field Review</th>
                    <th className="px-4 py-2 text-left">Data Status</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Updated At</th>
                    <th className="px-4 py-2 text-left">Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline">{item.kind}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge>
                          {item.current_status_name || item.current_status_slug}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 max-w-xs truncate">
                        {item.title || "-"}
                      </td>
                      <td className="px-4 py-2">{item.entity_type || "-"}</td>
                      <td className="px-4 py-2">{item.entity_id || "-"}</td>
                      <td className="px-4 py-2">
                        <div className="text-xs">
                          <div>{item.assigned_to_name || "-"}</div>
                          <div className="text-muted-foreground">
                            {item.assigned_to_email || ""}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {item.priority && (
                          <Badge
                            variant={
                              item.priority === "high"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {item.priority}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-2">{item.due_date || "-"}</td>
                      <td className="px-4 py-2">
                        {item.days_until_due !== null &&
                        item.days_until_due !== undefined ? (
                          <Badge
                            variant={
                              item.days_until_due < 0
                                ? "destructive"
                                : "default"
                            }
                          >
                            {item.days_until_due}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {item.requires_field_review ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2">{item.data_status || "-"}</td>
                      <td className="px-4 py-2 text-xs">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {item.completed_at
                          ? new Date(item.completed_at).toLocaleDateString()
                          : "-"}
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
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      Review #{item.id}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{item.kind}</Badge>
                      <Badge>
                        {item.current_status_name || item.current_status_slug}
                      </Badge>
                    </div>
                  </div>
                  {item.priority && (
                    <Badge
                      variant={
                        item.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.title && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Title
                    </div>
                    <div className="text-sm">{item.title}</div>
                  </div>
                )}
                {item.description && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Description
                    </div>
                    <div className="text-sm line-clamp-2">
                      {item.description}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Entity
                    </div>
                    <div className="text-sm">
                      {item.entity_type || "-"}
                      {item.entity_id && ` #${item.entity_id}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Data Status
                    </div>
                    <div className="text-sm">{item.data_status || "-"}</div>
                  </div>
                </div>

                {(item.assigned_to_name || item.assigned_to_email) && (
                  <div className="pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground">
                      Assigned To
                    </div>
                    <div className="text-sm">
                      {item.assigned_to_name || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.assigned_to_email || ""}
                    </div>
                    {item.assigned_to_role && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.assigned_to_role}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Field Review
                    </div>
                    <div className="text-sm">
                      {item.requires_field_review ? "Required" : "Not Required"}
                    </div>
                  </div>
                  {item.due_date && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Due Date
                      </div>
                      <div className="text-sm">
                        {new Date(item.due_date).toLocaleDateString()}
                      </div>
                      {item.days_until_due !== null &&
                        item.days_until_due !== undefined && (
                          <Badge
                            variant={
                              item.days_until_due < 0
                                ? "destructive"
                                : "default"
                            }
                            className="mt-1 text-xs"
                          >
                            {item.days_until_due} days
                          </Badge>
                        )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Created
                    </div>
                    <div>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Updated
                    </div>
                    <div>
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                </div>

                {item.completed_at && (
                  <div className="pt-2 border-t text-xs">
                    <div className="font-medium text-muted-foreground">
                      Completed
                    </div>
                    <div>
                      {new Date(item.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {(item.entity_data ||
                  item.review_data ||
                  item.field_data ||
                  item.parcel_data ||
                  item.sale_data ||
                  item.sale_parcels_data) && (
                  <div className="pt-2 border-t">
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium text-muted-foreground">
                        Additional Data
                      </summary>
                      <div className="mt-2 space-y-2">
                        {item.entity_data && (
                          <div>
                            <div className="font-medium">Entity Data</div>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(item.entity_data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {item.review_data && (
                          <div>
                            <div className="font-medium">Review Data</div>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(item.review_data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {item.field_data && (
                          <div>
                            <div className="font-medium">Field Data</div>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(item.field_data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {item.parcel_data && (
                          <div>
                            <div className="font-medium">Parcel Data</div>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(item.parcel_data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {item.sale_data && (
                          <div>
                            <div className="font-medium">Sale Data</div>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(item.sale_data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {item.sale_parcels_data && (
                          <div>
                            <div className="font-medium">Sale Parcels Data</div>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(item.sale_parcels_data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
