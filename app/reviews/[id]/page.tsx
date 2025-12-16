import ServerFieldReview from "./server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  console.log("Rendering review page for id:", id);
  return (
    <div className="w-full flex flex-col gap-6 p-4 mb-10 max-w-3xl mx-auto">
      <ServerFieldReview
        reviewId={id}
        title="Review Thread"
        revalidatePath={`/reviews/${id}`}
      />
    </div>
  );
}
