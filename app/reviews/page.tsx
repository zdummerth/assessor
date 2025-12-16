// app/test/field-reviews/page.tsx
import Link from "next/link";
import Filters from "./filters";

type SearchParams = {
  type_id?: string;
  status_id?: string;
  nbhds?: string;
  page?: string;
  review_statuses?: string;
  review_types?: string;
};

export default async function FieldReviewsPage({
  searchParams,
}: {
  // In Next.js 15 / latest app router, searchParams is a Promise
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const typeId =
    typeof params?.type_id === "string" && params.type_id
      ? Number(params.type_id)
      : null;

  const statusId =
    typeof params?.status_id === "string" && params.status_id
      ? Number(params.status_id)
      : null;

  // nbhds is an array of ids
  // example: http://localhost:3000/reviews?nbhds=65%2C2%2C3%2C4&page=1
  const nbhds =
    typeof params?.nbhds === "string" && params.nbhds.length > 0
      ? params.nbhds.split(",").map((id) => Number(id))
      : undefined;

  const reviewStatuses =
    typeof params?.review_statuses === "string" &&
    params.review_statuses.length > 0
      ? params.review_statuses.split(",").map((id) => Number(id))
      : undefined;

  const reviewTypes =
    typeof params?.review_types === "string" && params.review_types.length > 0
      ? params.review_types.split(",").map((id) => Number(id))
      : undefined;

  const pageParam =
    typeof params?.page === "string" && params.page.length > 0
      ? params.page
      : "1";
  const currentPage = Number(pageParam) > 0 ? Number(pageParam) : 1;

  return (
    <main className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Reviews</h1>
      </div>

      <Filters
        typeId={typeId}
        statusId={statusId}
        page={currentPage}
        nbhds={nbhds}
        reviewStatuses={reviewStatuses}
        reviewTypes={reviewTypes}
      />
    </main>
  );
}
