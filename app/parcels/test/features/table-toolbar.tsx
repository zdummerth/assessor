"use client";

import { Input } from "@/components/ui/input";

export function TableToolbar(props: {
  ilikeStreet: string;
  setIlikeStreet: (v: string) => void;
  total?: number;
  onChange?: () => void;
}) {
  const { ilikeStreet, setIlikeStreet, total, onChange } = props;
  return (
    <div className="flex items-center justify-between gap-3">
      <Input
        placeholder="Filter by street (server)"
        value={ilikeStreet}
        onChange={(e) => {
          setIlikeStreet(e.target.value);
          onChange?.();
        }}
        className="max-w-xs"
      />
      <div className="text-sm text-muted-foreground">
        {typeof total === "number" ? `${total.toLocaleString()} results` : ""}
      </div>
    </div>
  );
}
