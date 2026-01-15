// Generated types for search_vehicle_unified function
import type { Json } from "@/database-types";

export interface SearchVehicleUnifiedParams {
  p_search_text: string;
  p_search_type?: "auto" | "vin" | "description";
  p_guide_year?: number;
  p_match_limit?: number;
  p_similarity_threshold?: number;
  p_year_tolerance?: number;
}

export interface GuideValue {
  guide_year: number;
  year: number;
  value: number;
}

export interface GuideMatch {
  vehicle_id: string;
  type: string | null;
  make: string;
  model: string;
  trim: string | null;
  description: string;
  similarity_score: number;
  values: GuideValue[];
}

export interface VinResult {
  vin_id: number;
  vin: string;
  model_year: string | null;
  type: string | null;
  vin_description: string | null;
  guide_matches: GuideMatch[];
}

export interface DescriptionResult {
  vehicle_id: string;
  type: string | null;
  make: string;
  model: string;
  trim: string | null;
  description: string;
  similarity_score: number;
  values: GuideValue[];
}

export interface NhtsaApiResult {
  vin: string;
  extracted_fields: any;
  guide_matches: GuideMatch[];
  match_count: number;
  [key: string]: any;
}

export interface SearchVehicleUnifiedResult {
  search_text: string;
  search_type: "vin" | "description";
  source: "vin_lookup_table" | "nhtsa_api" | "guide_vehicles" | "none";
  match_count: number;
  results: VinResult[] | DescriptionResult[] | NhtsaApiResult[];
  message?: string;
}
