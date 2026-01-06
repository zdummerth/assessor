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
            const p_active_only = formData.get("p_active_only") as string;
      if (p_active_only) params.set("p_active_only", p_active_only);
      const p_assigned_to_id = formData.get("p_assigned_to_id") as string;
      if (p_assigned_to_id) params.set("p_assigned_to_id", p_assigned_to_id);
      const p_completed_only = formData.get("p_completed_only") as string;
      if (p_completed_only) params.set("p_completed_only", p_completed_only);
      const p_created_after = formData.get("p_created_after") as string;
      if (p_created_after) params.set("p_created_after", p_created_after);
      const p_created_before = formData.get("p_created_before") as string;
      if (p_created_before) params.set("p_created_before", p_created_before);
      const p_data_status = formData.get("p_data_status") as string;
      if (p_data_status) params.set("p_data_status", p_data_status);
      const p_due_after = formData.get("p_due_after") as string;
      if (p_due_after) params.set("p_due_after", p_due_after);
      const p_due_before = formData.get("p_due_before") as string;
      if (p_due_before) params.set("p_due_before", p_due_before);
      const p_entity_type = formData.get("p_entity_type") as string;
      if (p_entity_type) params.set("p_entity_type", p_entity_type);
      const p_kind = formData.get("p_kind") as string;
      if (p_kind) params.set("p_kind", p_kind);
      const p_overdue_only = formData.get("p_overdue_only") as string;
      if (p_overdue_only) params.set("p_overdue_only", p_overdue_only);
      const p_priority = formData.get("p_priority") as string;
      if (p_priority) params.set("p_priority", p_priority);
      const p_requires_field_review = formData.get("p_requires_field_review") as string;
      if (p_requires_field_review) params.set("p_requires_field_review", p_requires_field_review);
      const p_search_text = formData.get("p_search_text") as string;
      if (p_search_text) params.set("p_search_text", p_search_text);
      const p_status_ids = formData.get("p_status_ids") as string;
      if (p_status_ids) params.set("p_status_ids", p_status_ids);

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
        <Label htmlFor="p_active_only">P Active Only</Label>
        <Input
          id="p_active_only"
          name="p_active_only"
          type="checkbox"
          
        />
      </div>
      <div>
        <Label htmlFor="p_assigned_to_id">P Assigned To Id</Label>
        <Input
          id="p_assigned_to_id"
          name="p_assigned_to_id"
          type="number"
          
        />
      </div>
      <div>
        <Label htmlFor="p_completed_only">P Completed Only</Label>
        <Input
          id="p_completed_only"
          name="p_completed_only"
          type="checkbox"
          
        />
      </div>
      <div>
        <Label htmlFor="p_created_after">P Created After</Label>
        <Input
          id="p_created_after"
          name="p_created_after"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_created_before">P Created Before</Label>
        <Input
          id="p_created_before"
          name="p_created_before"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_data_status">P Data Status</Label>
        <Input
          id="p_data_status"
          name="p_data_status"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_due_after">P Due After</Label>
        <Input
          id="p_due_after"
          name="p_due_after"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_due_before">P Due Before</Label>
        <Input
          id="p_due_before"
          name="p_due_before"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_entity_type">P Entity Type</Label>
        <Input
          id="p_entity_type"
          name="p_entity_type"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_kind">P Kind</Label>
        <Input
          id="p_kind"
          name="p_kind"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_overdue_only">P Overdue Only</Label>
        <Input
          id="p_overdue_only"
          name="p_overdue_only"
          type="checkbox"
          
        />
      </div>
      <div>
        <Label htmlFor="p_priority">P Priority</Label>
        <Input
          id="p_priority"
          name="p_priority"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_requires_field_review">P Requires Field Review</Label>
        <Input
          id="p_requires_field_review"
          name="p_requires_field_review"
          type="checkbox"
          
        />
      </div>
      <div>
        <Label htmlFor="p_search_text">P Search Text</Label>
        <Input
          id="p_search_text"
          name="p_search_text"
          type="text"
          
        />
      </div>
      <div>
        <Label htmlFor="p_status_ids">P Status Ids</Label>
        <Input
          id="p_status_ids"
          name="p_status_ids"
          type="text"
          
        />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
