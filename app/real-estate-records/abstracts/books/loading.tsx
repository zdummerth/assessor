export default function BooksLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-5 w-96 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-gray-100" />
    </div>
  );
}
