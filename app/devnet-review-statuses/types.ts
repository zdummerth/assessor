// Type exports from database-types.ts
import type { Database } from "@/database-types";

export type DevnetReviewStatuses = Database["public"]["Tables"]["devnet_review_statuses"]["Row"];
export type DevnetReviewStatusesInsert = Database["public"]["Tables"]["devnet_review_statuses"]["Insert"];
export type DevnetReviewStatusesUpdate = Database["public"]["Tables"]["devnet_review_statuses"]["Update"];
