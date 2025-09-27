// app/components/ParcelDetailsCardClient.tsx
"use client";

import { useMemo } from "react";
import ParcelNumber from "@/components/ui/parcel-number-updated";
import Address from "@/components/ui/address";
import FormattedDate from "@/components/ui/formatted-date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AnyAddress = {
  id?: number | string | null;
  housenumber?: string | number | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | number | null;
  full_address?: string | null;
  effective_date?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type AnyLandUse = {
  id?: number | string | null;
  land_use?: string | null;
  effective_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
};

type ParcelNeighborhoodRow = {
  id: number;
  parcel_id: number;
  neighborhood_id: number;
  effective_date: string;
  end_date: string | null;
  created_at: string | null;
  neighborhoods?: {
    id: number;
    name: string | null;
    neighborhood: number | null;
    set_id: number | null;
    neighborhood_sets?: {
      id: number;
      name: string;
    } | null;
  } | null;
};

function isCurrent(eff: string, end: string | null): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const effD = new Date(eff);
  effD.setHours(0, 0, 0, 0);
  if (effD > today) return false;
  if (!end) return true;
  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  return endD > today;
}

function neighborhoodLabel(n?: {
  name?: string | null;
  neighborhood?: number | null;
}) {
  if (!n) return "—";
  if (n.name && n.name.trim() !== "") return n.name;
  if (n.neighborhood != null) return String(n.neighborhood);
  return "—";
}

const SET_BADGE_STYLES = [
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-sky-100 text-sky-800 border-sky-200",
  "bg-amber-100 text-amber-900 border-amber-200",
  "bg-violet-100 text-violet-800 border-violet-200",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-slate-200 text-slate-900 border-slate-300",
];
function styleForSet(setId?: number | null, setName?: string | null) {
  const key = setId ?? setName ?? 0;
  let h = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  const idx = h % SET_BADGE_STYLES.length;
  return SET_BADGE_STYLES[idx];
}

function fmtKeyDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

export default function ParcelDetailsCardClient({
  parcelId,
  block,
  lot,
  ext,
  addresses,
  landUses,
  neighborhoods,
}: {
  parcelId: number;
  block: number;
  lot: number;
  ext: number;
  addresses: AnyAddress[];
  landUses: AnyLandUse[];
  neighborhoods: ParcelNeighborhoodRow[];
}) {
  // Sorts
  const sortedAddresses = useMemo(() => {
    const ts = (a: AnyAddress) =>
      new Date(a.effective_date || a.updated_at || a.created_at || 0).getTime();
    return [...(addresses ?? [])].sort((a, b) => ts(b) - ts(a));
  }, [addresses]);

  const sortedLandUses = useMemo(() => {
    const ts = (lu: AnyLandUse) =>
      new Date(lu.effective_date || lu.created_at || 0).getTime();
    return [...(landUses ?? [])].sort((a, b) => ts(b) - ts(a));
  }, [landUses]);

  const sortedNeighborhoods = useMemo(() => {
    const eff = (r: ParcelNeighborhoodRow) =>
      new Date(r.effective_date).getTime();
    const ca = (r: ParcelNeighborhoodRow) =>
      r.created_at ? new Date(r.created_at).getTime() : 0;
    return [...(neighborhoods ?? [])].sort((a, b) => {
      const be = eff(b) - eff(a);
      return be !== 0 ? be : ca(b) - ca(a);
    });
  }, [neighborhoods]);

  const currentAddress = sortedAddresses[0];
  const currentLandUse = sortedLandUses[0];
  const currentNeighborhoods = sortedNeighborhoods.filter((r) =>
    isCurrent(r.effective_date, r.end_date)
  );

  const normalizeAddress = (a?: AnyAddress) => {
    if (!a) return { address: "", fullAddress: "" };
    const hn = a.housenumber ?? "";
    const st = a.street ?? "";
    const city = a.city ?? "";
    const state = a.state ?? "";
    const pc = a.postcode ?? "";
    const address = `${hn} ${st}`.trim();
    const fullAddress =
      a.full_address ??
      [address, [city, state].filter(Boolean).join(", "), pc]
        .filter(Boolean)
        .join(", ")
        .replace(/\s+,/g, ",");
    return { address, fullAddress };
  };

  const addrProps = normalizeAddress(currentAddress);

  // Neighborhood history grouped by set
  const historyBySet = useMemo(() => {
    const m = new Map<
      string,
      {
        setId: number | null | undefined;
        setName: string;
        rows: ParcelNeighborhoodRow[];
      }
    >();
    for (const r of sortedNeighborhoods) {
      const setName = r.neighborhoods?.neighborhood_sets?.name ?? "Unknown Set";
      const setId = r.neighborhoods?.neighborhood_sets?.id ?? null;
      const k = `${setId ?? "x"}|${setName}`;
      if (!m.has(k)) m.set(k, { setId, setName, rows: [] });
      m.get(k)!.rows.push(r);
    }
    return Array.from(m.values());
  }, [sortedNeighborhoods]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <span className="mr-2 text-muted-foreground">Parcel</span>
          <ParcelNumber id={parcelId} block={block} lot={lot} ext={ext} />
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 text-sm">
        {/* Address */}
        <div>
          <div className="text-xs text-muted-foreground">Current Address</div>
          {addrProps.fullAddress ? (
            <Address
              address={addrProps.address}
              fullAddress={addrProps.fullAddress}
            />
          ) : (
            <div className="text-muted-foreground">—</div>
          )}
        </div>

        {/* Land Use */}
        <div>
          <div className="text-xs text-muted-foreground">Current Land Use</div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {currentLandUse?.land_use ?? "—"}
            </span>
            {currentLandUse?.effective_date && (
              <span className="text-xs text-muted-foreground">
                (since <FormattedDate date={currentLandUse.effective_date} />)
              </span>
            )}
          </div>
        </div>

        {/* Neighborhood(s) */}
        <div>
          <div className="text-xs text-muted-foreground">
            Current Neighborhood
          </div>
          {currentNeighborhoods.length === 0 ? (
            <div className="text-muted-foreground">—</div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentNeighborhoods.map((r) => {
                const n = r.neighborhoods;
                const setName = n?.neighborhood_sets?.name ?? "—";
                // @ts-expect-error js
                const label = neighborhoodLabel(n);
                const badgeClass = styleForSet(
                  n?.neighborhood_sets?.id ?? null,
                  setName
                );
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="font-medium">{label}</span>
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.5 border ${badgeClass}`}
                    >
                      {setName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      (since <FormattedDate date={r.effective_date} />)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              History
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Address, Land Use & Neighborhood History
              </DialogTitle>
            </DialogHeader>

            {/* Address history */}
            <section className="space-y-2">
              <h4 className="text-sm font-semibold">Addresses</h4>
              {sortedAddresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No addresses found.
                </p>
              ) : (
                <ul className="divide-y rounded border">
                  {sortedAddresses.map((a, i) => {
                    const p = normalizeAddress(a);
                    const key =
                      a.id ??
                      `${p.fullAddress}-${fmtKeyDate(
                        a.effective_date || a.updated_at || a.created_at
                      )}-${i}`;
                    return (
                      <li key={key} className="p-3 text-sm">
                        <div className="font-medium break-words">
                          {p.fullAddress || "—"}
                        </div>
                        {(a.effective_date || a.updated_at || a.created_at) && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {a.effective_date ? (
                              <>
                                Effective{" "}
                                <FormattedDate date={a.effective_date} />
                              </>
                            ) : a.updated_at ? (
                              <>
                                Updated <FormattedDate date={a.updated_at} />
                              </>
                            ) : (
                              <>
                                Created <FormattedDate date={a.created_at!} />
                              </>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Land use history */}
            <section className="space-y-2 mt-6">
              <h4 className="text-sm font-semibold">Land Uses</h4>
              {sortedLandUses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No land use records found.
                </p>
              ) : (
                <ul className="divide-y rounded border">
                  {sortedLandUses.map((lu, i) => {
                    const key =
                      lu.id ??
                      `${lu.land_use ?? "unknown"}-${fmtKeyDate(
                        lu.effective_date || lu.created_at
                      )}-${i}`;
                    return (
                      <li key={key} className="p-3 text-sm">
                        <div className="font-medium">{lu.land_use ?? "—"}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {lu.effective_date ? (
                            <>
                              <FormattedDate date={lu.effective_date} /> –{" "}
                              {lu.end_date ? (
                                <FormattedDate date={lu.end_date} />
                              ) : (
                                "Present"
                              )}
                            </>
                          ) : lu.created_at ? (
                            <>
                              Recorded <FormattedDate date={lu.created_at} />
                            </>
                          ) : (
                            "—"
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Neighborhood history grouped by set */}
            <section className="space-y-4 mt-6">
              <h4 className="text-sm font-semibold">Neighborhoods</h4>
              {historyBySet.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No neighborhood links found.
                </p>
              ) : (
                <div className="space-y-6">
                  {historyBySet.map(({ setId, setName, rows }) => {
                    const headerBadge = styleForSet(setId ?? null, setName);
                    return (
                      <div
                        key={`${setId ?? "x"}-${setName}`}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`px-2 py-0.5 border ${headerBadge}`}
                          >
                            {setName}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {rows.length} entr{rows.length === 1 ? "y" : "ies"}
                          </span>
                        </div>

                        <div className="overflow-auto rounded border">
                          <table className="min-w-[800px] w-full text-sm">
                            <thead className="bg-muted/60">
                              <tr className="text-left">
                                <th className="p-2">Neighborhood</th>
                                <th className="p-2">Effective</th>
                                <th className="p-2">End</th>
                                <th className="p-2">Created</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {rows.map((r) => (
                                <tr key={r.id}>
                                  <td className="p-2">
                                    {/* @ts-expect-error js */}
                                    {neighborhoodLabel(r.neighborhoods)}
                                  </td>
                                  <td className="p-2">
                                    <FormattedDate date={r.effective_date} />
                                  </td>
                                  <td className="p-2">
                                    <FormattedDate date={r.end_date || ""} />
                                  </td>
                                  <td className="p-2">
                                    <FormattedDate date={r.created_at || ""} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
