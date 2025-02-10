"use client";

import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button onClick={handleCopy} className="flex items-center gap-2">
      {copied ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Clipboard size={14} className="hover:text-blue-500" />
      )}
    </button>
  );
};

export default CopyToClipboard;
