import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParametersForm } from "./parameters-form";
import { SearchGuideByDescriptionServer } from "./data/search-guide-by-description-server";

interface SearchGuideByDescriptionPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchGuideByDescriptionPage({
  searchParams,
}: SearchGuideByDescriptionPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Extract and type the parameters
  const searchGuideParams = params.p_search_text
    ? {
        p_search_text: Array.isArray(params.p_search_text)
          ? params.p_search_text[0]
          : params.p_search_text,
        p_limit: params.p_limit
          ? Number(
              Array.isArray(params.p_limit) ? params.p_limit[0] : params.p_limit
            )
          : undefined,
      }
    : undefined;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Guide By Description</CardTitle>
          <CardDescription>
            Execute the search_guide_by_description database function
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParametersForm />
        </CardContent>
      </Card>

      {/* Results Section */}
      <SearchGuideByDescriptionServer
        params={searchGuideParams}
        currentPage={currentPage}
      />
    </div>
  );
}
