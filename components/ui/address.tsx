import CopyToClipboard from "@/components/copy-to-clipboard";
import { MapPin } from "lucide-react";

type Props = {
  address: string;
  fullAddress?: string;
};

const SUFFIX_MAP: Record<string, string> = {
  Avenue: "Ave",
  Street: "St",
  Boulevard: "Blvd",
  Road: "Rd",
  Drive: "Dr",
  Court: "Ct",
  Lane: "Ln",
  Circle: "Cir",
  Place: "Pl",
  Terrace: "Ter",
  Parkway: "Pkwy",
  Highway: "Hwy",
  Square: "Sq",
  Trail: "Trl",
  Way: "Way", // already short, included for casing consistency
};

function preserveCase(original: string, abbr: string) {
  if (original.toUpperCase() === original) return abbr.toUpperCase();
  if (
    original[0] === original[0]?.toUpperCase() &&
    original.slice(1).toLowerCase() === original.slice(1)
  )
    return abbr; // Title Case -> Title Case abbr
  if (original.toLowerCase() === original) return abbr.toLowerCase();
  return abbr; // fallback
}

function normalizeAddress(input: string | undefined) {
  if (!input) return "";
  // Build a single regex like: \b(Avenue|Street|Boulevard|...)\b\.?
  const keys = Object.keys(SUFFIX_MAP).join("|");
  const re = new RegExp(`\\b(${keys})\\b\\.?`, "gi");
  return input.replace(re, (match) =>
    preserveCase(
      match.replace(/\.$/, ""),
      SUFFIX_MAP[match.replace(/\.$/, "")] || match
    )
  );
}

export default function Address({ address, fullAddress }: Props) {
  // console.log("Rendering Address with:", { address, fullAddress });
  const normalizedAddress = normalizeAddress(address);
  // If fullAddress is provided, normalize that for copy/map as well; otherwise use normalized display address
  const originalOrFull =
    fullAddress && fullAddress.length > 0 ? fullAddress : address;
  const copy = normalizeAddress(originalOrFull);

  return (
    <div className="flex items-center gap-4">
      <p className="">{normalizedAddress}</p>
      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(copy)}`}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={18} className="hover:text-blue-500 transition-colors" />
        </a>
      </div>
      <CopyToClipboard text={copy} />
    </div>
  );
}
