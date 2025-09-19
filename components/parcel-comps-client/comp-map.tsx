import CompsMapClientWrapper from "../ui/maps/comps-map-client-wrapper";

// Minimal shape of the rows coming from GowerCompsDisplay
type RowItem = Partial<{
  lat: number | null;
  lon: number | null;
  parcel_id: number | string | null;
  district: string | null;
  land_use: string | null;
  house_number: string | number | null;
  street: string | null;
  sale_price: number | null;
}>;

type GowerTableRow = {
  isSubject: boolean;
  distance: number; // Gower dissimilarity
  miles: number | null; // Haversine miles
  item: RowItem;
};

export default function CompsMapFromRows({
  tableRows,
  className,
  height,
  // Optional parcelId fallback if a row isn't flagged as subject
  parcelId,
}: {
  tableRows: GowerTableRow[];
  className?: string;
  height?: string;
  parcelId?: number | string;
}) {
  // Find subject row (prefer the explicit flag; fallback to parcelId match)
  const subjectRow =
    tableRows.find((r) => r.isSubject) ??
    (parcelId
      ? tableRows.find((r) => r.item.parcel_id === parcelId)
      : undefined);

  const subjectItem = subjectRow?.item;

  const subjectPoint =
    subjectItem?.lat != null &&
    subjectItem?.lon != null &&
    subjectItem.lat !== undefined &&
    subjectItem.lon !== undefined
      ? {
          lat: Number(subjectItem.lat),
          long: Number(subjectItem.lon),
          parcel_number: subjectItem.parcel_id ?? parcelId ?? "Subject",
          address: [subjectItem.district, subjectItem.land_use]
            .filter(Boolean)
            .join(" • "),
          kind: "subject" as const,
        }
      : null;

  const compPoints = tableRows
    .filter(
      (r) =>
        !r.isSubject &&
        r.item.lat != null &&
        r.item.lon != null &&
        r.item.lat !== undefined &&
        r.item.lon !== undefined
    )
    .map((r) => ({
      lat: Number(r.item.lat),
      long: Number(r.item.lon),
      parcel_number: r.item.parcel_id ?? "",
      address: [r.item.district, r.item.land_use].filter(Boolean).join(" • "),
      sale_price: r.item.sale_price ?? undefined,
      gower_distance: r.distance ?? undefined,
      kind: "comp" as const,
    }));

  const points = subjectPoint ? [subjectPoint, ...compPoints] : compPoints;

  if (!points.length) {
    return (
      <div
        className={`rounded border p-3 text-sm text-muted-foreground ${className}`}
      >
        No mappable points in the provided rows.
      </div>
    );
  }

  return (
    <div className={className}>
      <CompsMapClientWrapper
        points={points}
        height={height}
        key={JSON.stringify(points)}
      />
    </div>
  );
}
