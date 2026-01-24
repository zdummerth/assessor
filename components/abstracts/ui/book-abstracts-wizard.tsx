"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Plus, BookPlus } from "lucide-react";
import AbstractBatchSelector from "./abstract-batch-selector";
import BookConfigForm from "./book-config-form";
import type { BookFormData } from "../types";
import {
  getNextBookNumber,
  createBook,
  assignAbstractsToBook,
  getAllPrintableAbstracts,
} from "../actions";
import { toast } from "sonner";

interface BookAbstractsWizardProps {
  bookId?: number;
  trigger?: React.ReactNode;
  onComplete?: (bookId: number) => void;
}

type WizardStep = "select" | "configure";

export function BookAbstractsWizard({
  bookId,
  trigger,
  onComplete,
}: BookAbstractsWizardProps) {
  const isAddToExisting = bookId !== undefined;
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>("select");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [nextBookNumber, setNextBookNumber] = useState<string>("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !isAddToExisting) {
      getNextBookNumber().then(setNextBookNumber);
    }
  }, [open, isAddToExisting]);

  useEffect(() => {
    if (!open) {
      // Reset wizard state when dialog closes
      setCurrentStep("select");
      setSelectedIds([]);
      setLoading(false);
    }
  }, [open]);

  const handleSelectNext = useCallback(
    (ids: number[]) => {
      setSelectedIds(ids);
      if (isAddToExisting) {
        // Skip directly to adding abstracts
        handleAddToExisting(ids);
      } else {
        // Continue to configure step
        setCurrentStep("configure");
      }
    },
    [isAddToExisting],
  );

  const handleAddToExisting = useCallback(
    async (ids: number[]) => {
      if (!bookId) return;

      setLoading(true);

      // Check if -1 is passed (select all mode)
      let abstractIds = ids;
      if (ids.length === 1 && ids[0] === -1) {
        // Fetch all unassigned abstracts
        abstractIds = await getAllPrintableAbstracts();
      }

      const result = await assignAbstractsToBook(abstractIds, bookId);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        onComplete?.(bookId);
      } else {
        toast.error(result.message);
        setLoading(false);
      }
    },
    [bookId, onComplete],
  );

  const handleConfigureNext = useCallback(
    async (config: BookFormData) => {
      setLoading(true);

      try {
        // Check if -1 is passed (select all mode)
        let abstractIds = selectedIds;
        if (selectedIds.length === 1 && selectedIds[0] === -1) {
          // Fetch all unassigned abstracts
          abstractIds = await getAllPrintableAbstracts();
        }

        const result = await createBook(abstractIds, config);

        if (!result.success) {
          toast.error(result.message);
          setLoading(false);
          return;
        }

        if (result.bookId) {
          toast.success(result.message);
          setOpen(false);
          onComplete?.(result.bookId);
        }
      } catch (error) {
        console.error("Error creating book:", error);
        toast.error("Failed to create book");
        setLoading(false);
      }
    },
    [selectedIds, onComplete],
  );

  const handleConfigureBack = useCallback(() => {
    setCurrentStep("select");
  }, []);

  const steps = [
    { id: "select", label: "Select Abstracts" },
    { id: "configure", label: "Configure Book" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isAddToExisting ? "outline" : "default"}>
            {isAddToExisting ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Abstracts
              </>
            ) : (
              <>
                <BookPlus className="mr-2 h-4 w-4" />
                Print New Book
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[50vw] max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isAddToExisting
              ? "Add Abstracts to Book"
              : "Create New Abstract Book"}
          </DialogTitle>
          <DialogDescription>
            {isAddToExisting
              ? "Select unassigned abstracts to add to this book"
              : "Select abstracts and configure book details"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {!isAddToExisting && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-1 items-center">
                      <div className="flex items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                            index < currentStepIndex
                              ? "border-green-500 bg-green-500 text-white"
                              : index === currentStepIndex
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300 bg-white text-gray-400"
                          }`}
                        >
                          {index < currentStepIndex ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <span className="text-sm font-semibold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div
                            className={`text-sm font-medium ${
                              index <= currentStepIndex
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </div>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-4 h-0.5 flex-1 ${
                            index < currentStepIndex
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === "select" && "Select Abstracts"}
                {currentStep === "configure" && "Configure Book Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === "select" && (
                <AbstractBatchSelector onNext={handleSelectNext} />
              )}

              {currentStep === "configure" && !isAddToExisting && (
                <BookConfigForm
                  selectedCount={
                    selectedIds.length === 1 && selectedIds[0] === -1
                      ? -1
                      : selectedIds.length
                  }
                  onNext={handleConfigureNext}
                  onBack={handleConfigureBack}
                  suggestedBookNumber={nextBookNumber}
                  loading={loading}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
