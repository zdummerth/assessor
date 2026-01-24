"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeedAbstractForm } from "./deed-abstract-form";
import { createDeedAbstract, updateDeedAbstract } from "../actions";
import type { DeedAbstract } from "../types";
import { Plus, Pencil } from "lucide-react";

type DeedAbstractDialogProps = {
  deedAbstract?: DeedAbstract;
  children?: React.ReactNode;
};

export function DeedAbstractDialog({
  deedAbstract,
  children,
}: DeedAbstractDialogProps) {
  const [open, setOpen] = useState(false);

  // Memoize action to prevent recreation on every render
  const action = useMemo(
    () =>
      deedAbstract
        ? updateDeedAbstract.bind(null, deedAbstract.id)
        : createDeedAbstract,
    [deedAbstract],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size={deedAbstract ? "sm" : "default"}
            variant={deedAbstract ? "outline" : "default"}
          >
            {deedAbstract ? (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                New Deed Abstract
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {deedAbstract ? "Edit Deed Abstract" : "Create Deed Abstract"}
          </DialogTitle>
          <DialogDescription>
            {deedAbstract
              ? "Update the details of this deed abstract."
              : "Enter the details for the new deed abstract."}
          </DialogDescription>
        </DialogHeader>
        <DeedAbstractForm
          deedAbstract={deedAbstract}
          action={action}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
