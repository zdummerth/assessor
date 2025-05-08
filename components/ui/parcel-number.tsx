import CopyToClipboard from "@/components/copy-to-clipboard";
import Link from "next/link";

export default function ParcelNumber({
  parcelNumber,
}: {
  parcelNumber: string;
}) {
  return (
    <div className="flex gap-2">
      <Link href={`/parcels/test/${parcelNumber}`} target="_blank">
        <span>{parcelNumber}</span>
      </Link>
      <CopyToClipboard text={parcelNumber} />
    </div>
  );
}
