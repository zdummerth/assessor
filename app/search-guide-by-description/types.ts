// Generated types for search_guide_by_description function
import type { Database } from "@/database-types";

export interface SearchGuideByDescriptionParams {
  p_limit?: number;
}

export interface SearchGuideByDescriptionResult {
  description: string;
  guide_id: number;
  similarity_score: number;
  years: string;
}