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
import { ComboboxLookup } from "@/components/ui/combobox-lookup";

interface FormData {
  can_approve?: boolean;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  specialties?: string;
  status?: string;
  user_id?: number;
}

export function DevnetEmployeesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    can_approve: !!searchParams.get("can_approve") || undefined,
    email: searchParams.get("email") || undefined,
    first_name: searchParams.get("first_name") || undefined,
    last_name: searchParams.get("last_name") || undefined,
    role: searchParams.get("role") || undefined,
    specialties: searchParams.get("specialties") || undefined,
    status: searchParams.get("status") || undefined,
    user_id: Number(searchParams.get("user_id")) || undefined,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (formData.can_approve !== undefined) {
      params.set("can_approve", formData.can_approve.toString());
    }
    if (formData.email) {
      params.set("email", formData.email.toString());
    }
    if (formData.first_name) {
      params.set("first_name", formData.first_name.toString());
    }
    if (formData.last_name) {
      params.set("last_name", formData.last_name.toString());
    }
    if (formData.role) {
      params.set("role", formData.role.toString());
    }
    if (formData.specialties) {
      params.set("specialties", formData.specialties.toString());
    }
    if (formData.status) {
      params.set("status", formData.status.toString());
    }
    if (formData.user_id) {
      params.set("user_id", formData.user_id.toString());
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    setFormData({
      can_approve: undefined,
      email: undefined,
      first_name: undefined,
      last_name: undefined,
      role: undefined,
      specialties: undefined,
      status: undefined,
      user_id: undefined,
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
          <div className="flex items-center space-x-2">
            <Switch
              id="can_approve"
              checked={formData.can_approve || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, can_approve: checked }))
              }
            />
            <Label htmlFor="can_approve">Can Approve</Label>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, first_name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, last_name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              type="text"
              value={formData.role || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="specialties">Specialties</Label>
            <Input
              id="specialties"
              name="specialties"
              type="text"
              value={formData.specialties || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialties: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              type="text"
              value={formData.status || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="user_id">User Id</Label>
            <ComboboxLookup
              endpoint="/user/api"
              value={formData.user_id?.toString() || ""}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  user_id: value ? Number(value) : undefined,
                }))
              }
              placeholder="Select user id..."
              valueKey="id"
              labelKey="name"
              // optional
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
