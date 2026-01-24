"use client";

import { useActionState, useEffect } from "react";
import type { ActionState, DeedAbstract } from "./types";
import { CONVEYANCE_TYPES } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type DeedAbstractFormProps = {
  deedAbstract?: DeedAbstract;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onSuccess?: () => void;
};

export function DeedAbstractForm({
  deedAbstract,
  action,
  onSuccess,
}: DeedAbstractFormProps) {
  const initialState: ActionState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        onSuccess?.();
      } else {
        toast.error(state.message);
      }
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Filed */}
        <div className="space-y-2">
          <Label htmlFor="date_filed">Date Filed</Label>
          <Input
            id="date_filed"
            name="date_filed"
            type="date"
            defaultValue={deedAbstract?.date_filed || ""}
            disabled={isPending}
          />
        </div>

        {/* Date of Deed */}
        <div className="space-y-2">
          <Label htmlFor="date_of_deed">Date of Deed</Label>
          <Input
            id="date_of_deed"
            name="date_of_deed"
            type="date"
            defaultValue={deedAbstract?.date_of_deed || ""}
            disabled={isPending}
          />
        </div>

        {/* Daily Number */}
        <div className="space-y-2">
          <Label htmlFor="daily_number">Daily Number</Label>
          <Input
            id="daily_number"
            name="daily_number"
            type="number"
            defaultValue={deedAbstract?.daily_number || ""}
            disabled={isPending}
          />
        </div>

        {/* Type of Conveyance */}
        <div className="space-y-2">
          <Label htmlFor="type_of_conveyance">Type of Conveyance</Label>
          <Select
            name="type_of_conveyance"
            defaultValue={deedAbstract?.type_of_conveyance || ""}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select conveyance type" />
            </SelectTrigger>
            <SelectContent>
              {CONVEYANCE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grantor Name */}
        <div className="space-y-2">
          <Label htmlFor="grantor_name">Grantor Name</Label>
          <Input
            id="grantor_name"
            name="grantor_name"
            type="text"
            defaultValue={deedAbstract?.grantor_name || ""}
            disabled={isPending}
          />
        </div>

        {/* Grantor Address */}
        <div className="space-y-2">
          <Label htmlFor="grantor_address">Grantor Address</Label>
          <Input
            id="grantor_address"
            name="grantor_address"
            type="text"
            defaultValue={deedAbstract?.grantor_address || ""}
            disabled={isPending}
          />
        </div>

        {/* Grantee Name */}
        <div className="space-y-2">
          <Label htmlFor="grantee_name">Grantee Name</Label>
          <Input
            id="grantee_name"
            name="grantee_name"
            type="text"
            defaultValue={deedAbstract?.grantee_name || ""}
            disabled={isPending}
          />
        </div>

        {/* Grantee Address */}
        <div className="space-y-2">
          <Label htmlFor="grantee_address">Grantee Address</Label>
          <Input
            id="grantee_address"
            name="grantee_address"
            type="text"
            defaultValue={deedAbstract?.grantee_address || ""}
            disabled={isPending}
          />
        </div>

        {/* Consideration Amount */}
        <div className="space-y-2">
          <Label htmlFor="consideration_amount">Consideration Amount ($)</Label>
          <Input
            id="consideration_amount"
            name="consideration_amount"
            type="number"
            step="0.01"
            defaultValue={
              deedAbstract?.consideration_amount
                ? (deedAbstract.consideration_amount / 100).toFixed(2)
                : ""
            }
            disabled={isPending}
          />
        </div>

        {/* Stamps */}
        <div className="space-y-2">
          <Label htmlFor="stamps">Stamps</Label>
          <Input
            id="stamps"
            name="stamps"
            type="text"
            defaultValue={deedAbstract?.stamps || ""}
            disabled={isPending}
          />
        </div>

        {/* City Block */}
        <div className="space-y-2">
          <Label htmlFor="city_block">City Block</Label>
          <Input
            id="city_block"
            name="city_block"
            type="text"
            defaultValue={deedAbstract?.city_block || ""}
            disabled={isPending}
          />
        </div>

        {/* Title Company */}
        <div className="space-y-2">
          <Label htmlFor="title_company">Title Company</Label>
          <Input
            id="title_company"
            name="title_company"
            type="text"
            defaultValue={deedAbstract?.title_company || ""}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Legal Description - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="legal_description">Legal Description</Label>
        <Textarea
          id="legal_description"
          name="legal_description"
          rows={4}
          defaultValue={deedAbstract?.legal_description || ""}
          disabled={isPending}
        />
      </div>

      {/* Is Transfer Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_transfer"
          name="is_transfer"
          defaultChecked={deedAbstract?.is_transfer || false}
          disabled={isPending}
        />
        <Label
          htmlFor="is_transfer"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Is Transfer
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : deedAbstract ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
