// app/test/field-reviews/FieldReviewsTable.tsx
import { Tables } from "@/database-types";

// Base row types
type FieldReviewRow = Tables<"field_reviews">;
type FieldReviewType = Tables<"field_review_types">;
type FieldReviewStatus = Tables<"field_review_statuses">;
type FieldReviewStatusHistory = Tables<"field_review_status_history">;
type FieldReviewNote = Tables<"field_review_notes">;

// app/test/field-reviews/FieldReviewsTable.tsx
import Link from "next/link";

// Shape returned by get_field_reviews_with_parcel_details()
export type FieldReviewWithDetails = {
  field_review_id: number;
  parcel_id: number;
  block: number;
  lot: number;
  ext: number;
  parcel_created_at: string | null;
  parcel_retired_at: string | null;

  review_created_at: string | null;
  review_due_date: string | null;
  site_visited_at: string | null;
  review_type_id: number | null;
  review_type_slug: string | null;
  review_type_name: string | null;

  latest_status_hist_id: number | null;
  latest_status_set_at: string | null;
  latest_status_id: number | null;
  latest_status_name: string | null;

  address_place_id: string | null;
  address_line1: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postcode: string | null;
  address_formatted: string | null;
  address_lat: number | null;
  address_lon: number | null;

  assessor_neighborhood: number | null;
  cda_neighborhood: string | null;
};

const fmtDate = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString() : "—";

const fmtShortDateTime = (s?: string | null) =>
  s
    ? new Date(s).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function FieldReviewsTable({
  reviews,
}: {
  reviews: FieldReviewWithDetails[];
}) {
  if (!reviews.length) {
    return (
      <div className="rounded border bg-background p-4 text-sm text-muted-foreground">
        No field reviews found. Adjust your filters or search to see results.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border bg-background">
      <table className="min-w-full text-xs">
        <thead className="bg-muted/60">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Parcel</th>
            <th className="px-3 py-2 text-left font-medium">Address</th>
            <th className="px-3 py-2 text-left font-medium">Type</th>
            <th className="px-3 py-2 text-left font-medium">Current Status</th>
            <th className="px-3 py-2 text-left font-medium">Due</th>
            <th className="px-3 py-2 text-left font-medium">Site Visit</th>
            <th className="px-3 py-2 text-left font-medium">Created</th>
            <th className="px-3 py-2 text-left font-medium">Neighborhoods</th>
            <th className="px-3 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reviews.map((r) => {
            return (
              <tr key={r.field_review_id} className="hover:bg-muted/40">
                {/* Parcel */}
                <td className="px-3 py-2 align-top">
                  <Link
                    href={`/parcels/${r.parcel_id}`}
                    className="text-[11px] font-medium text-blue-700 hover:underline"
                  >
                    {r.parcel_id}
                  </Link>
                  <div className="text-[10px] text-muted-foreground">
                    Block {r.block} Lot {r.lot}
                    {r.ext ? ` Ext ${r.ext}` : ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Review #{r.field_review_id}
                  </div>
                </td>

                {/* Address */}
                <td className="px-3 py-2 align-top">
                  <div className="text-[11px]">
                    {r.address_line1 || r.address_formatted || "—"}
                  </div>
                  {(r.address_city ||
                    r.address_state ||
                    r.address_postcode) && (
                    <div className="text-[10px] text-muted-foreground">
                      {[r.address_city, r.address_state]
                        .filter(Boolean)
                        .join(", ")}
                      {r.address_postcode ? ` ${r.address_postcode}` : ""}
                    </div>
                  )}
                  {r.address_lat != null && r.address_lon != null && (
                    <div className="text-[10px] text-muted-foreground">
                      ({r.address_lat.toFixed(5)}, {r.address_lon.toFixed(5)})
                    </div>
                  )}
                </td>

                {/* Type */}
                <td className="px-3 py-2 align-top">
                  <div className="text-[11px]">{r.review_type_name ?? "—"}</div>
                  {r.review_type_slug && (
                    <div className="text-[10px] text-muted-foreground">
                      {r.review_type_slug}
                    </div>
                  )}
                </td>

                {/* Current Status (from function) */}
                <td className="px-3 py-2 align-top">
                  {r.latest_status_name ? (
                    <>
                      <div className="text-[11px] font-medium">
                        {r.latest_status_name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {fmtShortDateTime(r.latest_status_set_at)}
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      No status
                    </span>
                  )}
                </td>

                {/* Due */}
                <td className="px-3 py-2 align-top text-[11px]">
                  {fmtDate(r.review_due_date)}
                </td>

                {/* Site Visit */}
                <td className="px-3 py-2 align-top text-[11px]">
                  {fmtShortDateTime(r.site_visited_at)}
                </td>

                {/* Created */}
                <td className="px-3 py-2 align-top text-[11px]">
                  {fmtShortDateTime(r.review_created_at)}
                </td>

                {/* Neighborhoods */}
                <td className="px-3 py-2 align-top text-[11px]">
                  {r.assessor_neighborhood != null && (
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Assessor:
                      </span>{" "}
                      {r.assessor_neighborhood}
                    </div>
                  )}
                  {r.cda_neighborhood && (
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        CDA:
                      </span>{" "}
                      {r.cda_neighborhood}
                    </div>
                  )}
                  {r.assessor_neighborhood == null && !r.cda_neighborhood && (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-3 py-2 align-top text-right text-[11px]">
                  <Link
                    href={`/test/field-reviews/${r.field_review_id}`}
                    className="inline-flex items-center rounded border px-2 py-1 hover:bg-muted"
                  >
                    View thread
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
