import CopyToClipboard from "@/components/copy-to-clipboard";
import Link from "next/link";

export default function AppealNumber({
  appealNumber,
}: {
  appealNumber: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/appeals/${appealNumber}`}
        className="font-mono text-gray-800 dark:text-gray-100"
        target="_blank"
      >
        {appealNumber}
      </Link>
      <CopyToClipboard text={appealNumber.toString().padStart(10, "0")} />
    </div>
  );
}
