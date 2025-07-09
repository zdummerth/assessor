import CopyToClipboard from "@/components/copy-to-clipboard";
import Link from "next/link";

export default function ParcelNumber({
  block,
  lot,
  ext,
  id,
  showCopy = true,
}: {
  block: number;
  lot: number;
  ext: number;
  id: number;
  showCopy?: boolean;
}) {
  const formattedBlock = block.toString().padStart(4, "0");
  const formattedLot = lot.toString().padStart(3, "0");
  const formattedExt = ext.toString().padStart(3, "0");

  const parcelNumber = `${formattedBlock}-9-${formattedLot}.${formattedExt}`;

  return (
    <div className="flex gap-2">
      <Link href={`/test/parcels/${id}`} target="_blank">
        <span>{parcelNumber}</span>
      </Link>

      {showCopy && <CopyToClipboard text={parcelNumber} />}
    </div>
  );
}
