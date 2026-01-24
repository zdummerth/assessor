import { getBook, getBookAbstracts } from "@/components/abstracts/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompactPagination from "@/components/ui/compact-pagination";
import BookEditForm from "@/components/abstracts/ui/book-edit-form";
import { BookAbstractsTable } from "@/components/abstracts/ui/book-abstracts-table";
import { BookAbstractsWizard } from "@/components/abstracts/ui/book-abstracts-wizard";

const ITEMS_PER_PAGE = 50;

export default async function BookDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id);
  const urlParams = await searchParams;
  const currentPage = Number(urlParams?.page) || 1;

  const [book, { abstracts, count }] = await Promise.all([
    getBook(bookId),
    getBookAbstracts(bookId, { limit: ITEMS_PER_PAGE, page: currentPage }),
  ]);

  if (!book) {
    notFound();
  }

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/real-estate-records/abstracts/books">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Book {book.book_title}</h1>
            <p className="mt-1 text-gray-600">
              Printed {formatDateTime(book.printed_at)}
            </p>
          </div>
          <div className="flex gap-2">
            <BookAbstractsWizard bookId={bookId} />
            <BookEditForm book={book} />
            <Link
              href={`/real-estate-records/abstracts/books/${book.id}/print`}
              target="_blank"
            >
              <Button>
                <Printer className="mr-2 h-4 w-4" />
                Print Book
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Abstracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {abstracts.length > 0
                ? `${formatDate(abstracts[0].date_filed)} - ${formatDate(abstracts[abstracts.length - 1].date_filed)}`
                : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Consideration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(
                abstracts.reduce(
                  (sum: number, a: any) => sum + (a.consideration_amount || 0),
                  0,
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {book.saved_location && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <FolderOpen className="mr-2 h-4 w-4" />
              Saved Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm text-gray-700">
              {book.saved_location}
            </p>
          </CardContent>
        </Card>
      )}

      {book.notes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{book.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Deed Abstracts ({count})
            {count > ITEMS_PER_PAGE && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                — Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, count)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {abstracts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No abstracts in this book
            </div>
          ) : (
            <>
              <CompactPagination
                totalPages={totalPages}
                currentPage={currentPage}
              />
              <BookAbstractsTable abstracts={abstracts} bookId={bookId} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
