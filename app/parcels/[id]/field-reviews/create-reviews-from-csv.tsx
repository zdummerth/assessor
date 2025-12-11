"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { AlertTriangle, CheckCircle2, Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import BulkFieldReviewForm from "./create";

type ParcelCsvBulkFieldReviewProps = {
  revalidatePath?: string;
};

type ParcelRecord = {
  id: number;
  retired_at: string | null;
};

export function ParcelCsvBulkFieldReview({
  revalidatePath,
}: ParcelCsvBulkFieldReviewProps) {
  const [rawIds, setRawIds] = useState<number[]>([]);
  const [activeIds, setActiveIds] = useState<number[]>([]);
  const [inactiveIds, setInactiveIds] = useState<number[]>([]);
  const [missingIds, setMissingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  function extractParcelIdsFromCsv(text: string): number[] {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      throw new Error("CSV file is empty.");
    }

    const headerLine = lines[0];
    const headers = headerLine
      .split(/[,\t;]+/)
      .map((h) => h.trim())
      .filter(Boolean);

    if (headers.length === 0) {
      throw new Error("CSV header row is missing or empty.");
    }

    const normalized = headers.map((h) => h.toLowerCase());

    const candidates = ["id", "parcel", "parcel_number"] as const;
    const indexMap: Partial<Record<(typeof candidates)[number], number>> = {};

    normalized.forEach((name, idx) => {
      if (
        candidates.includes(name as any) &&
        //@ts-expect-error jjj
        indexMap[name as any] === undefined
      ) {
        indexMap[name as (typeof candidates)[number]] = idx;
      }
    });

    // Choose column, preferring id > parcel > parcel_number
    const chosenName =
      (["id", "parcel", "parcel_number"] as const).find(
        (name) => indexMap[name] !== undefined
      ) ?? null;

    if (!chosenName) {
      throw new Error(
        'CSV must include a column named "id", "parcel", or "parcel_number".'
      );
    }

    const colIndex = indexMap[chosenName]!;
    const idsSet = new Set<number>();

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (!row.trim()) continue;

      const cells = row.split(/[,\t;]+/);
      if (colIndex >= cells.length) continue;

      const rawValue = (cells[colIndex] ?? "").trim();
      if (!rawValue) continue;

      // Strip non-digits and convert to number
      const digits = rawValue.replace(/\D/g, "");
      if (!digits) continue;

      const n = Number(digits);
      if (Number.isFinite(n)) {
        idsSet.add(n);
      }
    }

    if (idsSet.size === 0) {
      throw new Error(
        `No valid parcel numbers found in column "${chosenName}".`
      );
    }

    return Array.from(idsSet);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setParseError(null);
    setVerifyError(null);
    setActiveIds([]);
    setInactiveIds([]);
    setMissingIds([]);
    setRawIds([]);

    if (!file) return;

    try {
      const text = await file.text();
      const ids = extractParcelIdsFromCsv(text);

      setRawIds(ids);
      await verifyParcels(ids);
    } catch (err: any) {
      setParseError(err?.message || "Failed to read or parse the CSV file.");
    } finally {
      // allow re-upload of same file
      e.target.value = "";
    }
  }

  async function verifyParcels(ids: number[]) {
    if (ids.length === 0) {
      setParseError("No valid parcel numbers found in file.");
      return;
    }

    setLoading(true);
    setVerifyError(null);
    setActiveIds([]);
    setInactiveIds([]);
    setMissingIds([]);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("test_parcels")
        .select("id, retired_at")
        .in("id", ids);

      if (error) {
        setVerifyError(error.message || "Failed to verify parcels.");
        return;
      }

      const rows = (data ?? []) as ParcelRecord[];

      const foundIds = new Set(rows.map((r) => r.id));
      const active: number[] = [];
      const inactive: number[] = [];

      for (const row of rows) {
        if (row.retired_at == null) {
          active.push(row.id);
        } else {
          inactive.push(row.id);
        }
      }

      const missing: number[] = ids.filter((id) => !foundIds.has(id));

      setActiveIds(active);
      setInactiveIds(inactive);
      setMissingIds(missing);
    } catch (err: any) {
      setVerifyError(err?.message || "Unexpected error verifying parcels.");
    } finally {
      setLoading(false);
    }
  }

  const hasAny = rawIds.length > 0;

  return (
    <section className="space-y-4 rounded border bg-background p-4 md:p-6 text-sm">
      <header className="space-y-1">
        <h2 className="text-base font-semibold">Upload Parcels from CSV</h2>
        <p className="text-xs text-muted-foreground">
          Upload a CSV file with parcel numbers in a column named{" "}
          <code className="rounded bg-muted px-1 py-[1px]">id</code>,{" "}
          <code className="rounded bg-muted px-1 py-[1px]">parcel</code>, or{" "}
          <code className="rounded bg-muted px-1 py-[1px]">parcel_number</code>.
          If multiple exist, the <code>id</code> column is used.
        </p>
      </header>

      {/* File upload */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <label className="inline-flex items-center gap-2 text-xs font-medium">
          <Upload className="h-4 w-4" />
          Select CSV file of parcel numbers
        </label>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="text-xs"
        />
      </div>

      {parseError && (
        <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {parseError}
        </div>
      )}

      {/* Status / results */}
      {hasAny && (
        <div className="space-y-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-medium">
              Parsed {rawIds.length} unique parcel number
              {rawIds.length === 1 ? "" : "s"}.
            </span>
            {loading && (
              <span className="text-muted-foreground">Verifying parcels…</span>
            )}
          </div>

          {verifyError && (
            <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {verifyError}
            </div>
          )}

          {!loading && !verifyError && (
            <div className="grid gap-3 md:grid-cols-3">
              {/* Active */}
              <div className="rounded border bg-emerald-50 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Active parcels
                </div>
                <p className="mb-1 text-[11px] text-emerald-900">
                  {activeIds.length} active
                </p>
                <div className="max-h-32 overflow-auto text-[11px]">
                  {activeIds.length > 0 ? (
                    <ul className="space-y-0.5">
                      {activeIds.map((id) => (
                        <li key={id}>{id}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-emerald-900/70">
                      None of the uploaded parcels are active.
                    </p>
                  )}
                </div>
              </div>

              {/* Inactive */}
              <div className="rounded border bg-amber-50 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="h-3 w-3" />
                  Inactive / retired
                </div>
                <p className="mb-1 text-[11px] text-amber-900">
                  {inactiveIds.length} inactive
                </p>
                <div className="max-h-32 overflow-auto text-[11px]">
                  {inactiveIds.length > 0 ? (
                    <ul className="space-y-0.5">
                      {inactiveIds.map((id) => (
                        <li key={id}>{id}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-amber-900/70">
                      No inactive parcels found.
                    </p>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="rounded border bg-red-50 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-red-800">
                  <AlertTriangle className="h-3 w-3" />
                  Not found
                </div>
                <p className="mb-1 text-[11px] text-red-900">
                  {missingIds.length} not found
                </p>
                <div className="max-h-32 overflow-auto text-[11px]">
                  {missingIds.length > 0 ? (
                    <ul className="space-y-0.5">
                      {missingIds.map((id) => (
                        <li key={id}>{id}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-900/70">
                      All uploaded parcels exist in the database.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bulk create form for active parcels */}
      {activeIds.length > 0 && !verifyError && (
        <div className="mt-4 border-t pt-4">
          <BulkFieldReviewForm
            parcelIds={activeIds}
            revalidatePath={revalidatePath}
            title="Create Field Reviews for Active Parcels"
            description="The form below will create one field review per active parcel, using the same type, due date, status, and note."
          />
        </div>
      )}
    </section>
  );
}
