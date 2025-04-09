import CopyToClipboard from "@/components/copy-to-clipboard";
import { MapPin } from "lucide-react";

export default function Address({ address }: { address: string }) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <p className="">{address}</p>
      <div className="flex gap-2">
        <CopyToClipboard text={address} />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${address}`}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={18} className="hover:text-blue-500 transition-colors" />
        </a>
      </div>
    </div>
  );
}
