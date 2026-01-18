"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VehicleValuesSearch() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  // Local state for form fields
  const [localMake, setLocalMake] = useState(
    searchParams.get("make")?.toString() || ""
  );
  const [localModel, setLocalModel] = useState(
    searchParams.get("model")?.toString() || ""
  );
  const [localTrim, setLocalTrim] = useState(
    searchParams.get("trim")?.toString() || ""
  );
  const [localModelYear, setLocalModelYear] = useState(
    searchParams.get("model_year")?.toString() || ""
  );
  const [localGuideYear, setLocalGuideYear] = useState(
    searchParams.get("guide_year")?.toString() || ""
  );
  const [isApplying, setIsApplying] = useState(false);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    setLocalMake(searchParams.get("make")?.toString() || "");
    setLocalModel(searchParams.get("model")?.toString() || "");
    setLocalTrim(searchParams.get("trim")?.toString() || "");
    setLocalModelYear(searchParams.get("model_year")?.toString() || "");
    setLocalGuideYear(searchParams.get("guide_year")?.toString() || "");
    setIsApplying(false);
  }, [searchParams]);

  // Check if local state differs from URL params
  const hasChanges =
    localMake !== (searchParams.get("make")?.toString() || "") ||
    localModel !== (searchParams.get("model")?.toString() || "") ||
    localTrim !== (searchParams.get("trim")?.toString() || "") ||
    localModelYear !== (searchParams.get("model_year")?.toString() || "") ||
    localGuideYear !== (searchParams.get("guide_year")?.toString() || "");

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsApplying(true);

    const params = new URLSearchParams();
    params.set("page", "1");

    if (localMake) params.set("make", localMake);
    if (localModel) params.set("model", localModel);
    if (localTrim) params.set("trim", localTrim);
    if (localModelYear) params.set("model_year", localModelYear);
    if (localGuideYear) params.set("guide_year", localGuideYear);

    push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setLocalMake("");
    setLocalModel("");
    setLocalTrim("");
    setLocalModelYear("");
    setLocalGuideYear("");
    push(pathname);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <form onSubmit={handleApply} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            type="text"
            placeholder="e.g., Honda"
            value={localMake}
            onChange={(e) => setLocalMake(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            type="text"
            placeholder="e.g., Civic"
            value={localModel}
            onChange={(e) => setLocalModel(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trim">Trim</Label>
          <Input
            id="trim"
            type="text"
            placeholder="e.g., EX"
            value={localTrim}
            onChange={(e) => setLocalTrim(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model_year">Model Year</Label>
          <Input
            id="model_year"
            type="number"
            placeholder="e.g., 2020"
            value={localModelYear}
            onChange={(e) => setLocalModelYear(e.target.value)}
            onKeyDown={handleKeyDown}
            min="1900"
            max="2100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guide_year">Guide Year</Label>
          <Input
            id="guide_year"
            type="number"
            placeholder="e.g., 2024"
            value={localGuideYear}
            onChange={(e) => setLocalGuideYear(e.target.value)}
            onKeyDown={handleKeyDown}
            min="1900"
            max="2100"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isApplying || !hasChanges}
          className="min-w-32"
        >
          {isApplying ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isApplying}
        >
          Clear
        </Button>

        {hasChanges && !isApplying && (
          <span className="text-sm text-muted-foreground self-center ml-2">
            Click Search to apply changes
          </span>
        )}
      </div>
    </form>
  );
}
