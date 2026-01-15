"use client";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";

const CopyToClipboard = ({ text }: { text: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy!", err);
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 print:hidden"
      title="Copy to Clipboard"
    >
      <Clipboard size={12} className="hover:text-blue-500" />
    </button>
  );
};

export default CopyToClipboard;
