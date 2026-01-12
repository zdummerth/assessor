// Generated types for search_guide_by_description function
import type { Database } from "@/database-types";

export interface SearchGuideByDescriptionParams {
  p_search_text: string;
  p_guide_year?: number;
  p_limit?: number;
}

export interface GuideVehicleValue {
  guide_year: number;
  year: number;
  value: number;
}

// New normalized structure
export interface SearchGuideByDescriptionResult {
  vehicle_id: string;
  type: string | null;
  make: string;
  model: string;
  trim: string | null;
  similarity_score: number;
  values: GuideVehicleValue[];
}

// Old schema structure (deprecated)
// export interface SearchGuideByDescriptionResult {
//   description: string;
//   guide_id: number;
//   similarity_score: number;
//   years: string;
// }
