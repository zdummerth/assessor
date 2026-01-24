"use client";

import { useRouter } from "next/navigation";
import BookPrintWizard from "@/components/abstracts/ui/book-print-wizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBookPage() {
  const router = useRouter();

  const handleComplete = (bookId: number) => {
    router.push(`/real-estate-records/abstracts/books/${bookId}`);
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
        <h1 className="text-3xl font-bold">Print New Book</h1>
        <p className="mt-1 text-gray-600">
          Select abstracts, configure book details, and print
        </p>
      </div>

      <BookPrintWizard onComplete={handleComplete} />
    </div>
  );
}
