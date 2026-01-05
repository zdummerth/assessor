"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ParametersForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams();
      
      // Add form values to URL params
            const p_filters = formData.get("p_filters") as string;
      if (p_filters) params.set("p_filters", p_filters);

      // Navigate with search params to trigger server component refresh
      router.push(`?${params.toString()}`);
      
      
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="p_filters">P Filters</Label>
        <Input
          id="p_filters"
          name="p_filters"
          type="text"
          
        />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
