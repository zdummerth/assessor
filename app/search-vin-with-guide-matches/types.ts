// Generated types for search_vin_with_guide_matches function
import type { Database } from "@/database-types";
import type { Json } from "@/database-types";

export interface SearchVinWithGuideMatchesParams {
  p_max_guide_results?: number;
}

export interface SearchVinWithGuideMatchesResult {
  guide_results: Json;
  model_year: string;
  type: string;
  vin: string;
  vin_description: string;
  vin_id: number;
}