import CopyToClipboard from "@/components/copy-to-clipboard";
import Link from "next/link";

// export function to format parcel number
export function formatParcelNumber(block: number, lot: number, ext: number) {
  const formattedBlock = block.toString().padStart(4, "0");
  const formattedLot = lot.toString().padStart(3, "0");
  const formattedExt = ext.toString().padStart(3, "0");
  return `${formattedBlock}-9-${formattedLot}.${formattedExt}`;
}
export default function ParcelNumber({
  block,
  lot,
  ext,
  id,
  showCopy = true,
  className = "",
}: {
  block: number;
  lot: number;
  ext: number;
  id: number;
  showCopy?: boolean;
  className?: string;
}) {
  const parcelNumber = formatParcelNumber(block, lot, ext);

  return (
    <section className={className}>
      <div className="flex items-center gap-4">
        <Link
          href={`/parcels/${id}`}
          target="_blank"
          className="underline-offset-2 hover:underline"
        >
          <span>{parcelNumber}</span>
        </Link>
        {showCopy && <CopyToClipboard text={parcelNumber} />}
      </div>
    </section>
  );
}
