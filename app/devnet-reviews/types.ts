// Type exports from database-types.ts
import type { Database } from "@/database-types";

export type DevnetReviews = Database["public"]["Tables"]["devnet_reviews"]["Row"];
export type DevnetReviewsInsert = Database["public"]["Tables"]["devnet_reviews"]["Insert"];
export type DevnetReviewsUpdate = Database["public"]["Tables"]["devnet_reviews"]["Update"];
