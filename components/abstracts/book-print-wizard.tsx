"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import AbstractBatchSelector from "@/components/abstracts/abstract-batch-selector";
import BookConfigForm from "@/components/abstracts/book-config-form";
import type {
  DeedAbstract,
  BookFormData,
} from "@/app/real-estate-records/abstracts/types";
import {
  getNextBookNumber,
  getBookAbstracts,
} from "@/app/real-estate-records/abstracts/actions";
import { createClient } from "@/lib/supabase/client";

interface BookPrintWizardProps {
  onComplete: (bookId: number) => void;
}

type WizardStep = "select" | "configure";

function BookPrintWizard({ onComplete }: BookPrintWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("select");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [nextBookNumber, setNextBookNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //@ts-expect-error check this out
    getNextBookNumber().then(setNextBookNumber);
  }, []);

  const handleSelectNext = (ids: number[]) => {
    setSelectedIds(ids);
    setCurrentStep("configure");
  };

  const handleConfigureNext = async (config: BookFormData) => {
    setLoading(true);

    try {
      // Create the book via server action
      const { createBook } = await import(
        "@/app/real-estate-records/abstracts/actions"
      );
      const result = await createBook(selectedIds, config);

      if (!result.success) {
        alert(result.message);
        setLoading(false);
        return;
      }

      if (result.bookId) {
        // Navigate to the book details page
        onComplete(result.bookId);
      }
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Failed to create book");
      setLoading(false);
    }
  };

  const handleConfigureBack = () => {
    setCurrentStep("select");
  };

  const steps = [
    { id: "select", label: "Select Abstracts" },
    { id: "configure", label: "Configure Book" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <Card>
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
                      <span className="text-sm font-semibold">{index + 1}</span>
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
                      index < currentStepIndex ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === "select" && "Step 1: Select Abstracts"}
            {currentStep === "configure" && "Step 2: Configure Book Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === "select" && (
            <AbstractBatchSelector onNext={handleSelectNext} />
          )}

          {currentStep === "configure" && (
            <BookConfigForm
              selectedCount={selectedIds.length}
              onNext={handleConfigureNext}
              onBack={handleConfigureBack}
              suggestedBookNumber={nextBookNumber}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BookPrintWizard;
