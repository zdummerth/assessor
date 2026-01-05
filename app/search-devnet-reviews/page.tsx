import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParametersForm } from "./parameters-form";
import { SearchDevnetReviewsServer } from "./data/search-devnet-reviews-server";

interface SearchDevnetReviewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchDevnetReviewsPage({ searchParams }: SearchDevnetReviewsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Devnet Reviews</CardTitle>
          <CardDescription>
            Execute the search_devnet_reviews database function
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParametersForm />
        </CardContent>
      </Card>

      {/* Results Section */}
      <SearchDevnetReviewsServer params={params} currentPage={currentPage} />
    </div>
  );
}
