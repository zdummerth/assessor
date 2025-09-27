"use client";
import React from "react";
import Address from "@/components/ui/address";
import StructureDetail from "@/components/ui/structures/detail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Structure = any;

const StructureModal = ({
  structures,
  address,
  parcelNumber,
}: {
  structures: Structure[];
  address: string;
  parcelNumber: string;
}) => {
  // summarize the structures data
  const summarized = (structures ?? []).reduce(
    (acc: { total_area: number; gla: number }, s: any) => {
      acc.total_area += s.total_area || 0;
      acc.gla += s.gla || 0;
      return acc;
    },
    { total_area: 0, gla: 0 }
  );

  const hasStructures = Array.isArray(structures) && structures.length > 0;

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full"
            variant="secondary"
            disabled={!hasStructures}
            title={hasStructures ? "View structures" : "No structures"}
          >
            {hasStructures
              ? `${summarized.gla.toLocaleString()} sqft GLA`
              : "No Structures"}
            {hasStructures && (
              <span className="text-sm text-muted-foreground ml-2">
                {structures.length} Structure{structures.length > 1 ? "s" : ""}
              </span>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Structures</DialogTitle>
          </DialogHeader>

          {hasStructures && (
            <div className="flex flex-col items-center gap-2 w-full mt-2">
              <Address address={address} />
              <p className="text-sm mt-1 mb-3">{parcelNumber}</p>

              <div className="w-full space-y-4">
                {structures.map((structure: any, index: number) => (
                  <StructureDetail
                    key={
                      (structure?.parcel_number ?? parcelNumber) + "-" + index
                    }
                    structure={structure}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StructureModal;
