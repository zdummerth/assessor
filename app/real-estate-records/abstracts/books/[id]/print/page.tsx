import { getBook, getBookAbstracts } from "@/components/abstracts/actions";
import { notFound } from "next/navigation";
import { PrintableAbstracts } from "@/components/abstracts/print/printable-abstracts";

export default async function BookPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id);
  const [book, { abstracts }] = await Promise.all([
    getBook(bookId),
    getBookAbstracts(bookId), // No pagination - gets all abstracts
  ]);

  if (!book || abstracts.length === 0) {
    notFound();
  }

  return (
    <PrintableAbstracts
      deedAbstracts={abstracts}
      bookTitle={bookId.toString()}
    />
  );
}
