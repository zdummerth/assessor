import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import DevnetReviewsTableClient from "./table-client";

interface DevnetReviewsTableServerProps {
  filters?: {
    kind?: string;
    status_ids?: string[];
    assigned_to_id?: string;
    data_status?: string;
    priority?: number;
    entity_type?: string;
    requires_field_review?: boolean;
    search_text?: string;
    overdue_only?: boolean;
    created_after?: string;
    created_before?: string;
    due_after?: string;
    due_before?: string;
    completed_only?: boolean;
    active_only?: boolean;
  };
}

export default async function DevnetReviewsTableServer({
  filters = {},
}: DevnetReviewsTableServerProps) {
  const supabase = await createClient();

  try {
    // Call the search function directly
    const { data: reviews, error } = await supabase.rpc(
      //@ts-expect-error need to generate types for rpc
      "search_devnet_reviews",
      {
        p_filters: filters,
      }
    );

    if (error) {
      console.error("Error fetching reviews:", error);
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-red-600">
              Error loading reviews: {error.message}
            </p>
          </CardContent>
        </Card>
      );
    }

    //@ts-expect-error reviews type error
    if (!reviews || reviews.length === 0) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No reviews found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or create a new review
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Pass data to client component for all rendering and interactions
    //@ts-expect-error reviews type error
    return <DevnetReviewsTableClient initialData={reviews} filters={filters} />;
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-red-600">
            Unexpected error occurred while loading reviews
          </p>
        </CardContent>
      </Card>
    );
  }
}
