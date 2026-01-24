"use client";

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrintableAbstracts } from "../actions";
import { Badge } from "@/components/ui/badge";

interface AbstractBatchSelectorProps {
  onNext: (selectedIds: number[]) => void;
}

// Hoist formatters outside component to avoid recreation
const formatCurrency = (cents: number | null) => {
  if (cents === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function AbstractBatchSelector({
  onNext,
}: AbstractBatchSelectorProps) {
  // Lazy state initialization
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [selectAllMode, setSelectAllMode] = useState(false);
  const [batchSize, setBatchSize] = useState(50);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Create SWR key from filter params and page
  const swrKey = useMemo(
    () => [
      "unassigned-abstracts",
      {
        limit: batchSize,
        page,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
    ],
    [batchSize, page, startDate, endDate],
  );

  // Use SWR for data fetching with automatic caching and deduplication
  const {
    data: result = { data: [], count: 0 },
    isLoading,
    mutate,
  } = useSWR(
    swrKey,
    ([_key, params]) =>
      getPrintableAbstracts(
        params as Parameters<typeof getPrintableAbstracts>[0],
      ),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const abstracts = result.data || [];
  const totalCount = result.count || 0;
  const totalPages = Math.ceil(totalCount / batchSize);

  const handleSearch = useCallback(() => {
    setSelectedIds(new Set());
    setSelectAllMode(false);
    setPage(1);
    mutate();
  }, [mutate]);

  const toggleSelectAll = useCallback(() => {
    setSelectAllMode((prev) => !prev);
    if (!selectAllMode) {
      // Switching to select all mode
      setSelectedIds(new Set(abstracts.map((a) => a.id)));
    } else {
      // Switching to select current page mode
      setSelectedIds(new Set());
    }
  }, [abstracts, selectAllMode]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    setSelectAllMode(false);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectAllMode) {
      // If selecting all, pass special value to indicate all unassigned abstracts
      onNext([-1]); // -1 indicates "all abstracts" to the calling component
    } else if (selectedIds.size > 0) {
      onNext(Array.from(selectedIds));
    }
  }, [selectedIds, selectAllMode, onNext]);

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="batchSize">Items Per Page</Label>
              <Input
                id="batchSize"
                type="number"
                min={10}
                max={500}
                value={batchSize}
                onChange={(e) => {
                  setBatchSize(parseInt(e.target.value) || 50);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSearch} variant="secondary" className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              Available Abstracts ({totalCount.toLocaleString()})
              {selectedIds.size > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  — {selectedIds.size} selected
                </span>
              )}
            </CardTitle>
            {selectAllMode && (
              <p className="text-sm text-green-600 mt-1">
                ✓ All {totalCount.toLocaleString()} abstracts will be assigned
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
              disabled={abstracts.length === 0}
              className={selectAllMode ? "border-green-500 text-green-600" : ""}
            >
              {selectAllMode ? "Clear All" : "Select All"}
            </Button>
            {!selectAllMode && abstracts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedIds(new Set(abstracts.map((a) => a.id)));
                }}
              >
                Select Page
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-pulse text-gray-500">
                Loading abstracts...
              </div>
            </div>
          ) : abstracts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No unassigned abstracts found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectAllMode ||
                            (selectedIds.size === abstracts.length &&
                              abstracts.length > 0)
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Daily #</TableHead>
                      <TableHead>Date Filed</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Grantor</TableHead>
                      <TableHead>Grantee</TableHead>
                      <TableHead className="text-right">
                        Consideration
                      </TableHead>
                      <TableHead>Transfer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abstracts.map((abstract) => (
                      <TableRow
                        key={abstract.id}
                        className={
                          selectAllMode || selectedIds.has(abstract.id)
                            ? "bg-blue-50"
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={
                              selectAllMode || selectedIds.has(abstract.id)
                            }
                            onCheckedChange={() => toggleSelect(abstract.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {abstract.daily_number || "—"}
                        </TableCell>
                        <TableCell>{formatDate(abstract.date_filed)}</TableCell>
                        <TableCell className="text-sm">
                          {abstract.type_of_conveyance || "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {abstract.grantor_name || "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {abstract.grantee_name || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(abstract.consideration_amount)}
                        </TableCell>
                        <TableCell>
                          {abstract.is_transfer ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={selectedIds.size === 0 && !selectAllMode}
          size="lg"
        >
          {selectAllMode
            ? `Continue with all ${totalCount.toLocaleString()} Abstracts`
            : `Continue with ${selectedIds.size} Abstract${selectedIds.size !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  );
}
