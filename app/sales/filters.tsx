"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export function SalesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    router.push(window.location.pathname);
    setOpen(false);
  };

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={hasFilters ? "default" : "outline"}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <span className="ml-2 bg-background text-foreground rounded-full px-2 py-0.5 text-xs">
              {Array.from(searchParams.keys()).length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Records</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="created_at">Created At</Label>
            <Input
              id="created_at"
              name="created_at"
              defaultValue={searchParams.get("created_at") || ""}
              placeholder="Filter by created at..."
            />
          </div>
          <div>
            <Label htmlFor="created_by">Created By</Label>
            <Input
              id="created_by"
              name="created_by"
              defaultValue={searchParams.get("created_by") || ""}
              placeholder="Filter by created by..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
