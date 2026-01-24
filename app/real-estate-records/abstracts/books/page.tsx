import { getBooks } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Printer, FolderOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function BooksPage() {
  const books = await getBooks();

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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deed Abstract Books</h1>
          <p className="mt-1 text-gray-600">
            Manage and print collections of deed abstracts
          </p>
        </div>
        <Link href="/real-estate-records/abstracts/books/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Print New Book
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Books</CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No books created yet</p>
              <Link href="/real-estate-records/abstracts/books/new">
                <Button className="mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Print Your First Book
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Printed Date</TableHead>
                  <TableHead>Printed By</TableHead>
                  <TableHead className="text-right">Abstracts</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="text-right">
                    Total Consideration
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book: any) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-semibold">
                      {book.book_title}
                    </TableCell>
                    <TableCell>{formatDate(book.printed_at)}</TableCell>
                    <TableCell>
                      {book.printed_by_employee_name || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {book.abstract_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {book.earliest_date_filed && book.latest_date_filed
                        ? `${formatDate(book.earliest_date_filed)} - ${formatDate(book.latest_date_filed)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(book.total_consideration)}
                    </TableCell>
                    <TableCell>
                      {book.saved_location ? (
                        <span className="flex items-center text-sm text-gray-600">
                          <FolderOpen className="mr-1 h-3 w-3" />
                          {book.saved_location.length > 30
                            ? `${book.saved_location.slice(0, 30)}...`
                            : book.saved_location}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/real-estate-records/abstracts/books/${book.id}`}
                        >
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/real-estate-records/abstracts/books/${book.id}/print`}
                        >
                          <Button variant="outline" size="sm">
                            <Printer className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
