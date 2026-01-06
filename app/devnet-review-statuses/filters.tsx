"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface FormData {
  description?: string;
  is_terminal?: boolean;
  name?: string;
  needs_approval?: boolean;
  preferred_role?: string;
  required_specialties?: string;
  requires_assignment?: boolean;
  review_kind?: string;
}

export function DevnetReviewStatusesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: searchParams.get("description") || undefined,
    is_terminal: !!searchParams.get("is_terminal") || undefined,
    name: searchParams.get("name") || undefined,
    needs_approval: !!searchParams.get("needs_approval") || undefined,
    preferred_role: searchParams.get("preferred_role") || undefined,
    required_specialties: searchParams.get("required_specialties") || undefined,
    requires_assignment: !!searchParams.get("requires_assignment") || undefined,
    review_kind: searchParams.get("review_kind") || undefined,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (formData.description) {
      params.set("description", formData.description.toString());
    }
    if (formData.is_terminal !== undefined) {
      params.set("is_terminal", formData.is_terminal.toString());
    }
    if (formData.name) {
      params.set("name", formData.name.toString());
    }
    if (formData.needs_approval !== undefined) {
      params.set("needs_approval", formData.needs_approval.toString());
    }
    if (formData.preferred_role) {
      params.set("preferred_role", formData.preferred_role.toString());
    }
    if (formData.required_specialties) {
      params.set(
        "required_specialties",
        formData.required_specialties.toString()
      );
    }
    if (formData.requires_assignment !== undefined) {
      params.set(
        "requires_assignment",
        formData.requires_assignment.toString()
      );
    }
    if (formData.review_kind) {
      params.set("review_kind", formData.review_kind.toString());
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    setFormData({
      description: undefined,
      is_terminal: undefined,
      name: undefined,
      needs_approval: undefined,
      preferred_role: undefined,
      required_specialties: undefined,
      requires_assignment: undefined,
      review_kind: undefined,
    });
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Records</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_terminal"
              checked={formData.is_terminal || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_terminal: checked }))
              }
            />
            <Label htmlFor="is_terminal">Is Terminal</Label>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="needs_approval"
              checked={formData.needs_approval || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, needs_approval: checked }))
              }
            />
            <Label htmlFor="needs_approval">Needs Approval</Label>
          </div>
          <div>
            <Label htmlFor="preferred_role">Preferred Role</Label>
            <Input
              id="preferred_role"
              name="preferred_role"
              type="text"
              value={formData.preferred_role || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preferred_role: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="required_specialties">Required Specialties</Label>
            <Input
              id="required_specialties"
              name="required_specialties"
              type="text"
              value={formData.required_specialties || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  required_specialties: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="requires_assignment"
              checked={formData.requires_assignment || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  requires_assignment: checked,
                }))
              }
            />
            <Label htmlFor="requires_assignment">Requires Assignment</Label>
          </div>
          <div>
            <Label htmlFor="review_kind">Review Kind</Label>
            <Input
              id="review_kind"
              name="review_kind"
              type="text"
              value={formData.review_kind || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  review_kind: e.target.value,
                }))
              }
              required
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
