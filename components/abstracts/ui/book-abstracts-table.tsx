"use client";

import { useState, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Trash } from "lucide-react";
import { toast } from "sonner";
import { removeAbstractsFromBook, getBookAbstracts } from "../actions";
import type { DeedAbstract } from "../types";

interface BookAbstractsTableProps {
  abstracts: DeedAbstract[];
  bookId: number;
}

// Hoist formatters outside component
const formatCurrency = (cents: number | null) => {
  if (cents === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function BookAbstractsTable({
  abstracts,
  bookId,
}: BookAbstractsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRemoveAllDialog, setShowRemoveAllDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === abstracts.length) {
        return new Set();
      } else {
        return new Set(abstracts.map((a) => a.id));
      }
    });
  }, [abstracts]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleRemoveClick = useCallback(() => {
    if (selectedIds.size > 0) {
      setShowConfirmDialog(true);
    }
  }, [selectedIds.size]);

  const handleConfirmRemove = useCallback(() => {
    startTransition(async () => {
      const result = await removeAbstractsFromBook(Array.from(selectedIds));

      if (result.success) {
        toast.success(result.message);
        setSelectedIds(new Set());
        setShowConfirmDialog(false);
      } else {
        toast.error(result.message);
      }
    });
  }, [selectedIds]);

  const handleRemoveAllClick = useCallback(() => {
    setShowRemoveAllDialog(true);
  }, []);

  const handleConfirmRemoveAll = useCallback(() => {
    startTransition(async () => {
      // Fetch all abstracts from the book (not just current page)
      const { abstracts: allAbstracts } = await getBookAbstracts(bookId);
      const allIds = allAbstracts.map((a) => a.id);
      const result = await removeAbstractsFromBook(allIds);

      if (result.success) {
        toast.success(result.message);
        setSelectedIds(new Set());
        setShowRemoveAllDialog(false);
      } else {
        toast.error(result.message);
      }
    });
  }, [bookId]);

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border bg-muted p-4">
          <span className="text-sm font-medium">
            {selectedIds.size} abstract{selectedIds.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAllClick}
              disabled={isPending}
            >
              <Trash className="mr-2 h-4 w-4" />
              Remove All from Book
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveClick}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Selected
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedIds.size === abstracts.length && abstracts.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Daily #</TableHead>
            <TableHead>Date Filed</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Grantor</TableHead>
            <TableHead>Grantee</TableHead>
            <TableHead className="text-right">Consideration</TableHead>
            <TableHead>Transfer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {abstracts.map((abstract) => (
            <TableRow
              key={abstract.id}
              className={selectedIds.has(abstract.id) ? "bg-blue-50" : ""}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(abstract.id)}
                  onCheckedChange={() => toggleSelect(abstract.id)}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">
                {abstract.daily_number || "—"}
              </TableCell>
              <TableCell>{formatDate(abstract.date_filed)}</TableCell>
              <TableCell className="text-sm">
                {abstract.type_of_conveyance || "—"}
              </TableCell>
              <TableCell className="text-sm">
                {abstract.grantor_name || "—"}
              </TableCell>
              <TableCell className="text-sm">
                {abstract.grantee_name || "—"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(abstract.consideration_amount)}
              </TableCell>
              <TableCell>
                {abstract.is_transfer ? (
                  <Badge variant="default">Yes</Badge>
                ) : (
                  <Badge variant="outline">No</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Abstracts from Book?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedIds.size} abstract
              {selectedIds.size !== 1 ? "s" : ""} from this book? This action
              cannot be undone. The abstracts will become unassigned and
              available for other books.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmRemove();
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showRemoveAllDialog}
        onOpenChange={setShowRemoveAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove All Abstracts from Book?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>all abstracts</strong>{" "}
              from this book? This action cannot be undone. All abstracts will
              become unassigned and available for other books.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmRemoveAll();
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Removing..." : "Remove All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
