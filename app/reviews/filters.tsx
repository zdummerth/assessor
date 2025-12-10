// app/test/field-reviews/filters.tsx
import { Suspense } from "react";
import FiltersDialog from "../parcels/test/filters-apply";
import FieldReviewsTableServer from "./table";

type Props = {
  typeId: number | null;
  statusId: number | null;
  nbhds?: number[];
  reviewStatuses?: number[];
  reviewTypes?: number[];
  page: number;
};

function FieldReviewsTableSkeleton() {
  return (
    <div className="mt-3 overflow-x-auto rounded border bg-background">
      <table className="min-w-full text-xs">
        <thead className="bg-muted/60">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-medium text-muted-foreground"
              >
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {Array.from({ length: 8 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-muted/40">
              {Array.from({ length: 8 }).map((_, colIdx) => (
                <td key={colIdx} className="px-3 py-2 align-top">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-2 w-16 animate-pulse rounded bg-muted/70" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function Filters({
  page,
  nbhds,
  reviewStatuses,
  reviewTypes,
}: Props) {
  const suspenseKey = `field-reviews-table-${nbhds?.join(",")}-${reviewStatuses?.join(",")}-${reviewTypes?.join(",")}-${page}`;
  return (
    <>
      <FiltersDialog />

      <Suspense key={suspenseKey} fallback={<FieldReviewsTableSkeleton />}>
        <FieldReviewsTableServer
          reviewStatuses={reviewStatuses}
          reviewTypes={reviewTypes}
          nbhds={nbhds}
          page={page}
        />
      </Suspense>
    </>
  );
}
