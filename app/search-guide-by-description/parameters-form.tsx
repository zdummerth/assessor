"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function ParametersForm() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 300);

  // Update URL params when debounced value changes
  useEffect(() => {
    if (debouncedSearchText.trim()) {
      const params = new URLSearchParams();
      params.set("p_search_text", debouncedSearchText.trim());
      router.push(`?${params.toString()}`);
    } else {
      // Clear results when search is empty
      router.push("?");
    }
  }, [debouncedSearchText, router]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="search">Search Guide Vehicles</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            name="search"
            type="text"
            placeholder="Search by make, model, or trim..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Results will appear automatically as you type
        </p>
      </div>
    </div>
  );
}
