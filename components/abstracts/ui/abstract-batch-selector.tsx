"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import type { DeedAbstract } from "../types";
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
  const [abstracts, setAbstracts] = useState<DeedAbstract[]>([]);
  // Lazy state initialization
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [batchSize, setBatchSize] = useState(1000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadAbstracts();
  }, []);

  const loadAbstracts = useCallback(async () => {
    setLoading(true);
    const result = await getPrintableAbstracts({
      limit: batchSize,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    setAbstracts(result as DeedAbstract[]);
    setLoading(false);
  }, [batchSize, startDate, endDate]);

  const handleSearch = useCallback(() => {
    setSelectedIds(new Set());
    loadAbstracts();
  }, [loadAbstracts]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === abstracts.length) {
        return new Set();
      } else {
        return new Set(abstracts.map((a) => a.id));
      }
    });
  }, [abstracts]);

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
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedIds.size > 0) {
      onNext(Array.from(selectedIds));
    }
  }, [selectedIds, onNext]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="batchSize">Batch Size (Max)</Label>
              <Input
                id="batchSize"
                type="number"
                min={1}
                max={10000}
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 1000)}
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
          <CardTitle>
            Available Abstracts ({abstracts.length})
            {selectedIds.size > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                — {selectedIds.size} selected
              </span>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            disabled={abstracts.length === 0}
          >
            {selectedIds.size === abstracts.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
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
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedIds.size === abstracts.length &&
                          abstracts.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Daily #</TableHead>
                    <TableHead>Date Filed</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Grantor</TableHead>
                    <TableHead>Grantee</TableHead>
                    <TableHead className="text-right">Consideration</TableHead>
                    <TableHead>Transfer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abstracts.map((abstract) => (
                    <TableRow
                      key={abstract.id}
                      className={
                        selectedIds.has(abstract.id) ? "bg-blue-50" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(abstract.id)}
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
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={selectedIds.size === 0}
          size="lg"
        >
          Continue with {selectedIds.size} Abstract
          {selectedIds.size !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
