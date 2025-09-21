// components/parcel-features/StructuresDialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";

type StructureItem = {
  structure: any;
  sections: any[];
};

export default function StructuresDialog(props: {
  open: boolean;
  onClose: () => void;
  parcelId: number | null;
  structures: StructureItem[];
}) {
  const count = props.structures?.length ?? 0;

  return (
    <Dialog open={props.open} onClose={props.onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-start justify-center p-4 md:items-center">
        {/* Dialog panel */}
        <DialogPanel className="w-full max-w-5xl space-y-4 rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-base font-semibold">
                Structures for Parcel {props.parcelId ?? "—"}
              </DialogTitle>
              <Description className="mt-1 text-sm text-gray-600">
                Showing raw{" "}
                <code className="rounded bg-gray-100 px-1">
                  test_structures
                </code>{" "}
                rows and their{" "}
                <code className="rounded bg-gray-100 px-1">
                  test_structure_sections
                </code>
                .{` `}
                {count
                  ? `${count} record${count === 1 ? "" : "s"}.`
                  : " No active structures."}
              </Description>
            </div>

            <button
              onClick={props.onClose}
              className="rounded-md border bg-white px-2 py-1 text-sm hover:bg-gray-50"
              type="button"
              aria-label="Close dialog"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {count > 0 ? (
              props.structures.map((item, idx) => (
                <div key={idx} className="rounded border p-3">
                  <h4 className="mb-2 font-medium">Structure #{idx + 1}</h4>

                  <div className="grid gap-3 md:grid-cols-2">
                    {/* Structure (raw JSON) */}
                    <div className="min-w-0">
                      <div className="mb-1 text-xs font-semibold text-gray-600">
                        Structure (raw)
                      </div>
                      <pre className="max-h-64 w-full overflow-auto rounded bg-gray-50 p-2 text-xs">
                        {JSON.stringify(item.structure ?? {}, null, 2)}
                      </pre>
                    </div>

                    {/* Sections (raw JSON) */}
                    <div className="min-w-0">
                      <div className="mb-1 text-xs font-semibold text-gray-600">
                        Sections (raw)
                      </div>
                      <pre className="max-h-64 w-full overflow-auto rounded bg-gray-50 p-2 text-xs">
                        {JSON.stringify(item.sections ?? [], null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600">No active structures.</div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={props.onClose}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              type="button"
            >
              Done
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
