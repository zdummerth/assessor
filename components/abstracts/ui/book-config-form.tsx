"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookFormData } from "../types";

interface BookConfigFormProps {
  selectedCount: number;
  onNext: (data: BookFormData) => void;
  onBack: () => void;
  suggestedBookNumber: string;
  loading?: boolean;
}

export default function BookConfigForm({
  selectedCount,
  onNext,
  onBack,
  suggestedBookNumber,
  loading = false,
}: BookConfigFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    book_title: suggestedBookNumber,
    saved_location: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Selection Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Abstracts:</span>
            <span className="font-medium">
              {selectedCount === -1 ? (
                <span className="text-green-600">All unassigned abstracts</span>
              ) : (
                selectedCount
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="book_title" className="required">
            Book Title
          </Label>
          <Input
            id="book_title"
            type="text"
            required
            value={formData.book_title}
            onChange={(e) =>
              setFormData({ ...formData, book_title: e.target.value })
            }
            placeholder="Enter book number or title..."
          />
          <p className="text-xs text-gray-500">
            Suggested next number: {suggestedBookNumber}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="saved_location">Saved Location (Optional)</Label>
          <Input
            id="saved_location"
            type="text"
            value={formData.saved_location}
            onChange={(e) =>
              setFormData({ ...formData, saved_location: e.target.value })
            }
            placeholder="e.g., Cabinet A, Shelf 3, Box 12"
          />
          <p className="text-xs text-gray-500">
            Where the physical book will be stored
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Add any notes about this book..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Back to Selection
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Book..." : "Create Book"}
        </Button>
      </div>
    </form>
  );
}
