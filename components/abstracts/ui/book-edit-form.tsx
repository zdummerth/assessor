"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { updateBook } from "../actions";
import { useRouter } from "next/navigation";

interface BookEditFormProps {
  book: {
    id: number;
    book_title: string;
    saved_location: string | null;
    notes: string | null;
  };
}

export default function BookEditForm({ book }: BookEditFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    book_title: book.book_title,
    saved_location: book.saved_location || "",
    notes: book.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await updateBook(book.id, {
        book_title: formData.book_title,
        saved_location: formData.saved_location || undefined,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error updating book:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Book Details</DialogTitle>
          <DialogDescription>
            Update the book title, saved location, or notes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book_title">
              Book Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="book_title"
              name="book_title"
              value={formData.book_title}
              onChange={(e) =>
                setFormData({ ...formData, book_title: e.target.value })
              }
              placeholder="e.g., 1875"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saved_location">Saved Location</Label>
            <Input
              id="saved_location"
              name="saved_location"
              value={formData.saved_location}
              onChange={(e) =>
                setFormData({ ...formData, saved_location: e.target.value })
              }
              placeholder="File path or storage location"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional notes about this book"
              rows={4}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
