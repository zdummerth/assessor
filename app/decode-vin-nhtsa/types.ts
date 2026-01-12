// Generated types for decode_vin_nhtsa function
import type { Json } from "@/database-types";

export interface DecodeVinNhtsaParams {
  p_vin: string;
  p_year_tolerance?: number;
  p_match_threshold?: number;
  p_make_threshold?: number;
  p_model_threshold?: number;
  p_trim_threshold?: number;
  p_limit?: number;
  p_guide_year?: number;
}

export interface ExtractedFields {
  make: string | null;
  model: string | null;
  model_year: string | null;
  trim: string | null;
  displacement: string | null;
  body_class: string | null;
  drive_type: string | null;
  fuel_type: string | null;
  vehicle_type: string | null;
  series: string | null;
  series2: string | null;
  search_string: string;
}

export interface MatchScores {
  composite_score: number;
  final_score: number;
  make_similarity: number;
  model_similarity: number;
  trim_similarity: number;
  word_trim_similarity: number;
  bonus_score: number;
  confidence_level: "high" | "medium" | "low";
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
  match_scores: MatchScores;
  value_count: number;
  values: GuideValue[] | null;
}

export interface MatchParameters {
  year_tolerance: number;
  match_threshold: number;
  make_threshold: number;
  model_threshold: number;
  trim_threshold: number;
  result_limit: number;
  guide_year: number | null;
}

export interface DecodeVinNhtsaResult {
  vin: string;
  api_data: Json;
  extracted_fields: ExtractedFields;
  match_parameters: MatchParameters;
  guide_matches: GuideMatch[];
  match_count: number;
  error?: boolean;
  message?: string;
}
