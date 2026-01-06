export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      abatement_parcels: {
        Row: {
          abatement_program_id: number
          agr_base_assessed: number
          com_base_assessed: number
          created_at: string
          id: number
          parcel_id: number
          res_base_assessed: number
        }
        Insert: {
          abatement_program_id: number
          agr_base_assessed?: number
          com_base_assessed?: number
          created_at?: string
          id?: number
          parcel_id: number
          res_base_assessed?: number
        }
        Update: {
          abatement_program_id?: number
          agr_base_assessed?: number
          com_base_assessed?: number
          created_at?: string
          id?: number
          parcel_id?: number
          res_base_assessed?: number
        }
        Relationships: [
          {
            foreignKeyName: "abatement_parcels_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abatement_parcels_program_id_fkey"
            columns: ["abatement_program_id"]
            isOneToOne: false
            referencedRelation: "abatement_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      abatement_phases: {
        Row: {
          abatement_program_id: number
          agr_abated: number
          com_abated: number
          created_at: string
          first_year: number
          id: number
          last_year: number
          phase: number
          res_abated: number
        }
        Insert: {
          abatement_program_id: number
          agr_abated: number
          com_abated: number
          created_at?: string
          first_year: number
          id?: number
          last_year: number
          phase: number
          res_abated: number
        }
        Update: {
          abatement_program_id?: number
          agr_abated?: number
          com_abated?: number
          created_at?: string
          first_year?: number
          id?: number
          last_year?: number
          phase?: number
          res_abated?: number
        }
        Relationships: [
          {
            foreignKeyName: "abatement_phases_abatement_program_id_fkey"
            columns: ["abatement_program_id"]
            isOneToOne: false
            referencedRelation: "abatement_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      abatement_programs: {
        Row: {
          created_at: string
          first_year: number
          id: number
          last_year: number
          notes: string | null
          scale_type: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          first_year: number
          id: number
          last_year: number
          notes?: string | null
          scale_type?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          first_year?: number
          id?: number
          last_year?: number
          notes?: string | null
          scale_type?: string | null
          type?: string | null
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          attribution: string | null
          attribution_url: string | null
          category: string | null
          city: string
          country: string | null
          country_code: string | null
          county: string | null
          created_at: string
          created_by: string | null
          devnet_address: string | null
          distance: number | null
          district: string | null
          footway: string | null
          formatted: string | null
          fts_address_line1: unknown
          geocode_id: string | null
          hamlet: string | null
          housenumber: string | null
          id: number
          iso3166_2: string | null
          lat: number | null
          license: string | null
          line1: string
          line2: string | null
          lon: number | null
          match_type: string | null
          name: string | null
          old_name: string | null
          place_id: string
          plus_code: string | null
          plus_code_short: string | null
          postcode: string
          ref: string | null
          result_type: string | null
          sourcename: string | null
          state: string
          state_code: string | null
          street: string | null
          suburb: string | null
          timezone: string | null
          timezone_abbreviation: string | null
          timezone_offset: string | null
          town: string | null
          village: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          attribution?: string | null
          attribution_url?: string | null
          category?: string | null
          city: string
          country?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: string
          created_by?: string | null
          devnet_address?: string | null
          distance?: number | null
          district?: string | null
          footway?: string | null
          formatted?: string | null
          fts_address_line1?: unknown
          geocode_id?: string | null
          hamlet?: string | null
          housenumber?: string | null
          id?: number
          iso3166_2?: string | null
          lat?: number | null
          license?: string | null
          line1: string
          line2?: string | null
          lon?: number | null
          match_type?: string | null
          name?: string | null
          old_name?: string | null
          place_id: string
          plus_code?: string | null
          plus_code_short?: string | null
          postcode: string
          ref?: string | null
          result_type?: string | null
          sourcename?: string | null
          state: string
          state_code?: string | null
          street?: string | null
          suburb?: string | null
          timezone?: string | null
          timezone_abbreviation?: string | null
          timezone_offset?: string | null
          town?: string | null
          village?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          attribution?: string | null
          attribution_url?: string | null
          category?: string | null
          city?: string
          country?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: string
          created_by?: string | null
          devnet_address?: string | null
          distance?: number | null
          district?: string | null
          footway?: string | null
          formatted?: string | null
          fts_address_line1?: unknown
          geocode_id?: string | null
          hamlet?: string | null
          housenumber?: string | null
          id?: number
          iso3166_2?: string | null
          lat?: number | null
          license?: string | null
          line1?: string
          line2?: string | null
          lon?: number | null
          match_type?: string | null
          name?: string | null
          old_name?: string | null
          place_id?: string
          plus_code?: string | null
          plus_code_short?: string | null
          postcode?: string
          ref?: string | null
          result_type?: string | null
          sourcename?: string | null
          state?: string
          state_code?: string | null
          street?: string | null
          suburb?: string | null
          timezone?: string | null
          timezone_abbreviation?: string | null
          timezone_offset?: string | null
          town?: string | null
          village?: string | null
        }
        Relationships: []
      }
      addresses_v2: {
        Row: {
          city: string | null
          created_at: string
          id: number
          latitude: number | null
          longitude: number | null
          state: string | null
          street_address: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: number
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          street_address: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: number
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          street_address?: string
          zip?: string | null
        }
        Relationships: []
      }
      appeal_decisions: {
        Row: {
          appeal_id: number
          decided_at: string
          decision_review_id: number
          decision_type: string
          id: number
          result_value_set_id: number | null
        }
        Insert: {
          appeal_id: number
          decided_at: string
          decision_review_id: number
          decision_type: string
          id?: number
          result_value_set_id?: number | null
        }
        Update: {
          appeal_id?: number
          decided_at?: string
          decision_review_id?: number
          decision_type?: string
          id?: number
          result_value_set_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appeal_decisions_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "appeals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeal_decisions_decision_review_id_fkey"
            columns: ["decision_review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeal_decisions_result_value_set_id_fkey"
            columns: ["result_value_set_id"]
            isOneToOne: false
            referencedRelation: "parcel_value_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      appeal_hearings: {
        Row: {
          appeal_id: number
          created_at: string
          created_by: string | null
          hearing_at: string
          hearing_type: string | null
          id: number
          location: string | null
          outcome_note: string | null
        }
        Insert: {
          appeal_id: number
          created_at?: string
          created_by?: string | null
          hearing_at: string
          hearing_type?: string | null
          id?: number
          location?: string | null
          outcome_note?: string | null
        }
        Update: {
          appeal_id?: number
          created_at?: string
          created_by?: string | null
          hearing_at?: string
          hearing_type?: string | null
          id?: number
          location?: string | null
          outcome_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appeal_hearings_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "appeals"
            referencedColumns: ["id"]
          },
        ]
      }
      appeal_levels: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      appeal_review_status_history: {
        Row: {
          appeal_review_id: number
          created_at: string
          created_by: string
          id: number
          note: string | null
          status_id: number
        }
        Insert: {
          appeal_review_id: number
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          status_id: number
        }
        Update: {
          appeal_review_id?: number
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appeal_review_status_history_appeal_review_id_fkey"
            columns: ["appeal_review_id"]
            isOneToOne: false
            referencedRelation: "appeal_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeal_review_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "appeal_review_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      appeal_review_statuses: {
        Row: {
          created_at: string
          id: number
          is_terminal: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      appeal_reviews: {
        Row: {
          appeal_id: number
          id: number
          review_id: number
        }
        Insert: {
          appeal_id: number
          id?: number
          review_id: number
        }
        Update: {
          appeal_id?: number
          id?: number
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appeal_reviews_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "appeals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeal_reviews_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      appeal_status_history: {
        Row: {
          appeal_id: number
          created_at: string
          created_by: string | null
          id: number
          note: string | null
          status_id: number
        }
        Insert: {
          appeal_id: number
          created_at?: string
          created_by?: string | null
          id?: number
          note?: string | null
          status_id: number
        }
        Update: {
          appeal_id?: number
          created_at?: string
          created_by?: string | null
          id?: number
          note?: string | null
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appeal_status_history_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "appeals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeal_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "appeal_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      appeal_statuses: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          is_terminal: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_terminal?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_terminal?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      appeals: {
        Row: {
          appellant_email: string | null
          appellant_mailing_address_id: number | null
          appellant_name: string | null
          appellant_person_id: number | null
          appellant_phone: string | null
          created_at: string
          created_by: string | null
          id: number
          level_id: number | null
          reason: string | null
          representative_email: string | null
          representative_name: string | null
          representative_phone: string | null
          requested_total_value: number | null
          value_set_id: number
        }
        Insert: {
          appellant_email?: string | null
          appellant_mailing_address_id?: number | null
          appellant_name?: string | null
          appellant_person_id?: number | null
          appellant_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          level_id?: number | null
          reason?: string | null
          representative_email?: string | null
          representative_name?: string | null
          representative_phone?: string | null
          requested_total_value?: number | null
          value_set_id: number
        }
        Update: {
          appellant_email?: string | null
          appellant_mailing_address_id?: number | null
          appellant_name?: string | null
          appellant_person_id?: number | null
          appellant_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          level_id?: number | null
          reason?: string | null
          representative_email?: string | null
          representative_name?: string | null
          representative_phone?: string | null
          requested_total_value?: number | null
          value_set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appeals_appellant_mailing_address_id_fkey"
            columns: ["appellant_mailing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_appellant_person_id_fkey"
            columns: ["appellant_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "appeal_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      appeals_v2: {
        Row: {
          appeal_data: Json
          appeal_level: string
          appeal_number: string
          appellant_address: string | null
          appellant_email: string | null
          appellant_name: string
          appellant_phone: string | null
          created_at: string
          current_assessment: number | null
          filed_date: string
          final_assessment: number | null
          id: number
          parcel_id: number
          reason_for_appeal: string | null
          requested_assessment: number | null
          resolution_date: string | null
          resolution_notes: string | null
          review_id: number | null
        }
        Insert: {
          appeal_data?: Json
          appeal_level: string
          appeal_number: string
          appellant_address?: string | null
          appellant_email?: string | null
          appellant_name: string
          appellant_phone?: string | null
          created_at?: string
          current_assessment?: number | null
          filed_date?: string
          final_assessment?: number | null
          id?: number
          parcel_id: number
          reason_for_appeal?: string | null
          requested_assessment?: number | null
          resolution_date?: string | null
          resolution_notes?: string | null
          review_id?: number | null
        }
        Update: {
          appeal_data?: Json
          appeal_level?: string
          appeal_number?: string
          appellant_address?: string | null
          appellant_email?: string | null
          appellant_name?: string
          appellant_phone?: string | null
          created_at?: string
          current_assessment?: number | null
          filed_date?: string
          final_assessment?: number | null
          id?: number
          parcel_id?: number
          reason_for_appeal?: string | null
          requested_assessment?: number | null
          resolution_date?: string | null
          resolution_notes?: string | null
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appeals_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcel_overview_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      appraisers: {
        Row: {
          email: string | null
          id: number
          name: string | null
          phone: string | null
          supervisor: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          id: number
          name?: string | null
          phone?: string | null
          supervisor?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          supervisor?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assessment_cycles_v2: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: number
          is_active: boolean
          start_date: string
          tax_year: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: number
          is_active?: boolean
          start_date: string
          tax_year: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: number
          is_active?: boolean
          start_date?: string
          tax_year?: number
          updated_at?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          app_bldg_agriculture: number | null
          app_bldg_commercial: number | null
          app_bldg_exempt: number | null
          app_bldg_residential: number | null
          app_land_agriculture: number | null
          app_land_commercial: number | null
          app_land_exempt: number | null
          app_land_residential: number | null
          app_new_const_agriculture: number | null
          app_new_const_commercial: number | null
          app_new_const_exempt: number | null
          app_new_const_residential: number | null
          app_total_value: number | null
          bldg_agriculture: number | null
          bldg_commercial: number | null
          bldg_exempt: number | null
          bldg_residential: number | null
          category: string | null
          changed_by: string | null
          date_of_assessment: string | null
          id: number
          land_agriculture: number | null
          land_commercial: number | null
          land_exempt: number | null
          land_residential: number | null
          last_changed: string | null
          new_const_agriculture: number | null
          new_const_commercial: number | null
          new_const_exempt: number | null
          new_const_residential: number | null
          parcel_id: number
          reason_for_change: string | null
          year: number
        }
        Insert: {
          app_bldg_agriculture?: number | null
          app_bldg_commercial?: number | null
          app_bldg_exempt?: number | null
          app_bldg_residential?: number | null
          app_land_agriculture?: number | null
          app_land_commercial?: number | null
          app_land_exempt?: number | null
          app_land_residential?: number | null
          app_new_const_agriculture?: number | null
          app_new_const_commercial?: number | null
          app_new_const_exempt?: number | null
          app_new_const_residential?: number | null
          app_total_value?: number | null
          bldg_agriculture?: number | null
          bldg_commercial?: number | null
          bldg_exempt?: number | null
          bldg_residential?: number | null
          category?: string | null
          changed_by?: string | null
          date_of_assessment?: string | null
          id?: number
          land_agriculture?: number | null
          land_commercial?: number | null
          land_exempt?: number | null
          land_residential?: number | null
          last_changed?: string | null
          new_const_agriculture?: number | null
          new_const_commercial?: number | null
          new_const_exempt?: number | null
          new_const_residential?: number | null
          parcel_id: number
          reason_for_change?: string | null
          year: number
        }
        Update: {
          app_bldg_agriculture?: number | null
          app_bldg_commercial?: number | null
          app_bldg_exempt?: number | null
          app_bldg_residential?: number | null
          app_land_agriculture?: number | null
          app_land_commercial?: number | null
          app_land_exempt?: number | null
          app_land_residential?: number | null
          app_new_const_agriculture?: number | null
          app_new_const_commercial?: number | null
          app_new_const_exempt?: number | null
          app_new_const_residential?: number | null
          app_total_value?: number | null
          bldg_agriculture?: number | null
          bldg_commercial?: number | null
          bldg_exempt?: number | null
          bldg_residential?: number | null
          category?: string | null
          changed_by?: string | null
          date_of_assessment?: string | null
          id?: number
          land_agriculture?: number | null
          land_commercial?: number | null
          land_exempt?: number | null
          land_residential?: number | null
          last_changed?: string | null
          new_const_agriculture?: number | null
          new_const_commercial?: number | null
          new_const_exempt?: number | null
          new_const_residential?: number | null
          parcel_id?: number
          reason_for_change?: string | null
          year?: number
        }
        Relationships: []
      }
      attachments: {
        Row: {
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: number
          uploaded_at: string | null
          uploaded_by: number | null
        }
        Insert: {
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: number
          uploaded_at?: string | null
          uploaded_by?: number | null
        }
        Update: {
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: number
          uploaded_at?: string | null
          uploaded_by?: number | null
        }
        Relationships: []
      }
      bps: {
        Row: {
          completion_date: string | null
          cost: number | null
          id: number
          issued_date: string | null
          parcel_number: string | null
          permit_type: string | null
          report_date: string | null
          request: string | null
          status: string | null
          year: number | null
        }
        Insert: {
          completion_date?: string | null
          cost?: number | null
          id?: number
          issued_date?: string | null
          parcel_number?: string | null
          permit_type?: string | null
          report_date?: string | null
          request?: string | null
          status?: string | null
          year?: number | null
        }
        Update: {
          completion_date?: string | null
          cost?: number | null
          id?: number
          issued_date?: string | null
          parcel_number?: string | null
          permit_type?: string | null
          report_date?: string | null
          request?: string | null
          status?: string | null
          year?: number | null
        }
        Relationships: []
      }
      building_current_uses_v2: {
        Row: {
          building_id: number
          created_at: string
          effective_date: string
          id: number
          percentage_allocation: number | null
          retired_date: string | null
          updated_at: string
          use_id: number
          use_notes: string | null
        }
        Insert: {
          building_id: number
          created_at?: string
          effective_date?: string
          id?: number
          percentage_allocation?: number | null
          retired_date?: string | null
          updated_at?: string
          use_id: number
          use_notes?: string | null
        }
        Update: {
          building_id?: number
          created_at?: string
          effective_date?: string
          id?: number
          percentage_allocation?: number | null
          retired_date?: string | null
          updated_at?: string
          use_id?: number
          use_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "building_current_uses_v2_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_current_uses_v2_use_id_fkey"
            columns: ["use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      building_snapshots_v2: {
        Row: {
          active_values_at_snapshot: Json | null
          bathrooms: number | null
          bedrooms: number | null
          best_use_at_snapshot: string | null
          building_data: Json
          building_id: number
          building_type: string | null
          condition_rating: number | null
          created_at: string
          current_uses_at_snapshot: Json | null
          finished_area: number | null
          id: number
          review_id: number
          snapshot_date: string
          square_footage: number | null
          year_built: number | null
        }
        Insert: {
          active_values_at_snapshot?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          best_use_at_snapshot?: string | null
          building_data?: Json
          building_id: number
          building_type?: string | null
          condition_rating?: number | null
          created_at?: string
          current_uses_at_snapshot?: Json | null
          finished_area?: number | null
          id?: number
          review_id: number
          snapshot_date?: string
          square_footage?: number | null
          year_built?: number | null
        }
        Update: {
          active_values_at_snapshot?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          best_use_at_snapshot?: string | null
          building_data?: Json
          building_id?: number
          building_type?: string | null
          condition_rating?: number | null
          created_at?: string
          current_uses_at_snapshot?: Json | null
          finished_area?: number | null
          id?: number
          review_id?: number
          snapshot_date?: string
          square_footage?: number | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "building_snapshots_v2_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_snapshots_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_snapshots_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      building_value_components_v2: {
        Row: {
          building_value_id: number
          calculation_notes: string | null
          component_data: Json
          component_id: number
          component_value: number
          created_at: string
          id: number
          percentage_of_total: number | null
        }
        Insert: {
          building_value_id: number
          calculation_notes?: string | null
          component_data?: Json
          component_id: number
          component_value: number
          created_at?: string
          id?: number
          percentage_of_total?: number | null
        }
        Update: {
          building_value_id?: number
          calculation_notes?: string | null
          component_data?: Json
          component_id?: number
          component_value?: number
          created_at?: string
          id?: number
          percentage_of_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "building_value_components_v2_building_value_id_fkey"
            columns: ["building_value_id"]
            isOneToOne: false
            referencedRelation: "building_values_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_value_components_v2_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "value_components_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      building_values_v2: {
        Row: {
          activated_at: string | null
          approval_notes: string | null
          approved_at: string | null
          approved_by: number | null
          assessment_cycle_id: number
          best_use_id: number | null
          building_id: number
          calculation_completed_at: string | null
          calculation_metadata: Json
          calculation_trigger: string
          created_at: string
          created_by: string
          current_use_id: number | null
          id: number
          is_active: boolean
          method_id: number
          scheduled_calculation_date: string
          status: string
          total_value: number | null
          triggered_by_changes: Json
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: number | null
          assessment_cycle_id: number
          best_use_id?: number | null
          building_id: number
          calculation_completed_at?: string | null
          calculation_metadata?: Json
          calculation_trigger?: string
          created_at?: string
          created_by?: string
          current_use_id?: number | null
          id?: number
          is_active?: boolean
          method_id: number
          scheduled_calculation_date: string
          status?: string
          total_value?: number | null
          triggered_by_changes?: Json
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: number | null
          assessment_cycle_id?: number
          best_use_id?: number | null
          building_id?: number
          calculation_completed_at?: string | null
          calculation_metadata?: Json
          calculation_trigger?: string
          created_at?: string
          created_by?: string
          current_use_id?: number | null
          id?: number
          is_active?: boolean
          method_id?: number
          scheduled_calculation_date?: string
          status?: string
          total_value?: number | null
          triggered_by_changes?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "building_values_v2_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_values_v2_assessment_cycle_id_fkey"
            columns: ["assessment_cycle_id"]
            isOneToOne: false
            referencedRelation: "assessment_cycles_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_values_v2_best_use_id_fkey"
            columns: ["best_use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_values_v2_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_values_v2_current_use_id_fkey"
            columns: ["current_use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_values_v2_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "valuation_methods_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings_v2: {
        Row: {
          basement_area: number | null
          bathrooms: number | null
          bedrooms: number | null
          best_use_id: number | null
          best_use_reason: string | null
          best_use_updated_at: string | null
          building_data: Json
          building_type: string | null
          condition_rating: number | null
          cooling_type: string | null
          created_at: string
          current_review_id: number | null
          deck_area: number | null
          effective_date: string
          exterior_material: string | null
          finished_area: number | null
          foundation_type: string | null
          garage_area: number | null
          half_baths: number | null
          heating_type: string | null
          id: number
          occupancy_type: string | null
          parcel_id: number
          porch_area: number | null
          retired_at: string | null
          roof_type: string | null
          square_footage: number | null
          stories: number | null
          unfinished_area: number | null
          year_built: number | null
        }
        Insert: {
          basement_area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          best_use_id?: number | null
          best_use_reason?: string | null
          best_use_updated_at?: string | null
          building_data?: Json
          building_type?: string | null
          condition_rating?: number | null
          cooling_type?: string | null
          created_at?: string
          current_review_id?: number | null
          deck_area?: number | null
          effective_date?: string
          exterior_material?: string | null
          finished_area?: number | null
          foundation_type?: string | null
          garage_area?: number | null
          half_baths?: number | null
          heating_type?: string | null
          id?: number
          occupancy_type?: string | null
          parcel_id: number
          porch_area?: number | null
          retired_at?: string | null
          roof_type?: string | null
          square_footage?: number | null
          stories?: number | null
          unfinished_area?: number | null
          year_built?: number | null
        }
        Update: {
          basement_area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          best_use_id?: number | null
          best_use_reason?: string | null
          best_use_updated_at?: string | null
          building_data?: Json
          building_type?: string | null
          condition_rating?: number | null
          cooling_type?: string | null
          created_at?: string
          current_review_id?: number | null
          deck_area?: number | null
          effective_date?: string
          exterior_material?: string | null
          finished_area?: number | null
          foundation_type?: string | null
          garage_area?: number | null
          half_baths?: number | null
          heating_type?: string | null
          id?: number
          occupancy_type?: string | null
          parcel_id?: number
          porch_area?: number | null
          retired_at?: string | null
          roof_type?: string | null
          square_footage?: number | null
          stories?: number | null
          unfinished_area?: number | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_v2_best_use_id_fkey"
            columns: ["best_use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildings_v2_current_review_id_fkey"
            columns: ["current_review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildings_v2_current_review_id_fkey"
            columns: ["current_review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildings_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcel_overview_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildings_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      cda_codes: {
        Row: {
          code: number
          name: string | null
        }
        Insert: {
          code: number
          name?: string | null
        }
        Update: {
          code?: number
          name?: string | null
        }
        Relationships: []
      }
      cda_detail: {
        Row: {
          avg_appraised_value_2024_commercial: number | null
          avg_appraised_value_2024_condo: number | null
          avg_appraised_value_2024_multi_family: number | null
          avg_appraised_value_2024_other: number | null
          avg_appraised_value_2024_single_family: number | null
          avg_appraised_value_2025_commercial: number | null
          avg_appraised_value_2025_condo: number | null
          avg_appraised_value_2025_multi_family: number | null
          avg_appraised_value_2025_other: number | null
          avg_appraised_value_2025_single_family: number | null
          cda: string
          commercial_percent_change: number | null
          condo_percent_change: number | null
          count_2024_commercial: number | null
          count_2024_condo: number | null
          count_2024_multi_family: number | null
          count_2024_other: number | null
          count_2024_single_family: number | null
          count_2025_commercial: number | null
          count_2025_condo: number | null
          count_2025_multi_family: number | null
          count_2025_other: number | null
          count_2025_single_family: number | null
          multi_family_percent_change: number | null
          other_percent_change: number | null
          single_family_percent_change: number | null
          total_appraised_value_2024_commercial: number | null
          total_appraised_value_2024_condo: number | null
          total_appraised_value_2024_multi_family: number | null
          total_appraised_value_2024_other: number | null
          total_appraised_value_2024_single_family: number | null
          total_appraised_value_2025_commercial: number | null
          total_appraised_value_2025_condo: number | null
          total_appraised_value_2025_multi_family: number | null
          total_appraised_value_2025_other: number | null
          total_appraised_value_2025_single_family: number | null
        }
        Insert: {
          avg_appraised_value_2024_commercial?: number | null
          avg_appraised_value_2024_condo?: number | null
          avg_appraised_value_2024_multi_family?: number | null
          avg_appraised_value_2024_other?: number | null
          avg_appraised_value_2024_single_family?: number | null
          avg_appraised_value_2025_commercial?: number | null
          avg_appraised_value_2025_condo?: number | null
          avg_appraised_value_2025_multi_family?: number | null
          avg_appraised_value_2025_other?: number | null
          avg_appraised_value_2025_single_family?: number | null
          cda: string
          commercial_percent_change?: number | null
          condo_percent_change?: number | null
          count_2024_commercial?: number | null
          count_2024_condo?: number | null
          count_2024_multi_family?: number | null
          count_2024_other?: number | null
          count_2024_single_family?: number | null
          count_2025_commercial?: number | null
          count_2025_condo?: number | null
          count_2025_multi_family?: number | null
          count_2025_other?: number | null
          count_2025_single_family?: number | null
          multi_family_percent_change?: number | null
          other_percent_change?: number | null
          single_family_percent_change?: number | null
          total_appraised_value_2024_commercial?: number | null
          total_appraised_value_2024_condo?: number | null
          total_appraised_value_2024_multi_family?: number | null
          total_appraised_value_2024_other?: number | null
          total_appraised_value_2024_single_family?: number | null
          total_appraised_value_2025_commercial?: number | null
          total_appraised_value_2025_condo?: number | null
          total_appraised_value_2025_multi_family?: number | null
          total_appraised_value_2025_other?: number | null
          total_appraised_value_2025_single_family?: number | null
        }
        Update: {
          avg_appraised_value_2024_commercial?: number | null
          avg_appraised_value_2024_condo?: number | null
          avg_appraised_value_2024_multi_family?: number | null
          avg_appraised_value_2024_other?: number | null
          avg_appraised_value_2024_single_family?: number | null
          avg_appraised_value_2025_commercial?: number | null
          avg_appraised_value_2025_condo?: number | null
          avg_appraised_value_2025_multi_family?: number | null
          avg_appraised_value_2025_other?: number | null
          avg_appraised_value_2025_single_family?: number | null
          cda?: string
          commercial_percent_change?: number | null
          condo_percent_change?: number | null
          count_2024_commercial?: number | null
          count_2024_condo?: number | null
          count_2024_multi_family?: number | null
          count_2024_other?: number | null
          count_2024_single_family?: number | null
          count_2025_commercial?: number | null
          count_2025_condo?: number | null
          count_2025_multi_family?: number | null
          count_2025_other?: number | null
          count_2025_single_family?: number | null
          multi_family_percent_change?: number | null
          other_percent_change?: number | null
          single_family_percent_change?: number | null
          total_appraised_value_2024_commercial?: number | null
          total_appraised_value_2024_condo?: number | null
          total_appraised_value_2024_multi_family?: number | null
          total_appraised_value_2024_other?: number | null
          total_appraised_value_2024_single_family?: number | null
          total_appraised_value_2025_commercial?: number | null
          total_appraised_value_2025_condo?: number | null
          total_appraised_value_2025_multi_family?: number | null
          total_appraised_value_2025_other?: number | null
          total_appraised_value_2025_single_family?: number | null
        }
        Relationships: []
      }
      cda_summary: {
        Row: {
          cda: string
          other_2024: number | null
          other_2025: number | null
          residential_2024: number | null
          residential_2025: number | null
          total_2024: number | null
          total_2025: number | null
          total_percent_change: number | null
        }
        Insert: {
          cda: string
          other_2024?: number | null
          other_2025?: number | null
          residential_2024?: number | null
          residential_2025?: number | null
          total_2024?: number | null
          total_2025?: number | null
          total_percent_change?: number | null
        }
        Update: {
          cda?: string
          other_2024?: number | null
          other_2025?: number | null
          residential_2024?: number | null
          residential_2025?: number | null
          total_2024?: number | null
          total_2025?: number | null
          total_percent_change?: number | null
        }
        Relationships: []
      }
      construction_materials: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string | null
          created_at: string
          created_by: string
          id: number
          name: string
          parent_department_id: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          created_by?: string
          id?: number
          name: string
          parent_department_id?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string
          created_by?: string
          id?: number
          name?: string
          parent_department_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      devnet_employees: {
        Row: {
          can_approve: boolean
          created_at: string
          email: string | null
          first_name: string
          id: number
          last_name: string
          role: string | null
          specialties: string[] | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          can_approve?: boolean
          created_at?: string
          email?: string | null
          first_name: string
          id?: number
          last_name: string
          role?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          can_approve?: boolean
          created_at?: string
          email?: string | null
          first_name?: string
          id?: number
          last_name?: string
          role?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      devnet_neighborhood_report: {
        Row: {
          created_at: string
          data: Json
          devnet_id: string | null
          end_year: number | null
          id: number
          neighborhood_name: string
          start_year: number | null
          sync_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          devnet_id?: string | null
          end_year?: number | null
          id?: number
          neighborhood_name: string
          start_year?: number | null
          sync_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          devnet_id?: string | null
          end_year?: number | null
          id?: number
          neighborhood_name?: string
          start_year?: number | null
          sync_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      devnet_parcels: {
        Row: {
          created_at: string
          data: Json
          devnet_id: string | null
          end_year: number | null
          id: number
          parcel_number: string
          start_year: number | null
          sync_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          devnet_id?: string | null
          end_year?: number | null
          id?: number
          parcel_number: string
          start_year?: number | null
          sync_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          devnet_id?: string | null
          end_year?: number | null
          id?: number
          parcel_number?: string
          start_year?: number | null
          sync_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      devnet_review_assignments: {
        Row: {
          assigned_at: string
          assigned_by_id: number | null
          completed_at: string | null
          completed_by_id: number | null
          completion_notes: string | null
          due_date: string | null
          employee_id: number
          id: number
          is_active: boolean | null
          notes: string | null
          review_id: number
          status_id: number
        }
        Insert: {
          assigned_at?: string
          assigned_by_id?: number | null
          completed_at?: string | null
          completed_by_id?: number | null
          completion_notes?: string | null
          due_date?: string | null
          employee_id: number
          id?: number
          is_active?: boolean | null
          notes?: string | null
          review_id: number
          status_id: number
        }
        Update: {
          assigned_at?: string
          assigned_by_id?: number | null
          completed_at?: string | null
          completed_by_id?: number | null
          completion_notes?: string | null
          due_date?: string | null
          employee_id?: number
          id?: number
          is_active?: boolean | null
          notes?: string | null
          review_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "devnet_review_assignments_assigned_by_id_fkey"
            columns: ["assigned_by_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_assignments_completed_by_id_fkey"
            columns: ["completed_by_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_assignments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "devnet_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_assignments_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "devnet_review_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      devnet_review_history: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by_id: number | null
          from_data_status:
            | Database["public"]["Enums"]["devnet_data_status"]
            | null
          from_employee_id: number | null
          from_status_id: number | null
          id: number
          notes: string | null
          review_id: number
          to_data_status:
            | Database["public"]["Enums"]["devnet_data_status"]
            | null
          to_employee_id: number | null
          to_status_id: number
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by_id?: number | null
          from_data_status?:
            | Database["public"]["Enums"]["devnet_data_status"]
            | null
          from_employee_id?: number | null
          from_status_id?: number | null
          id?: number
          notes?: string | null
          review_id: number
          to_data_status?:
            | Database["public"]["Enums"]["devnet_data_status"]
            | null
          to_employee_id?: number | null
          to_status_id: number
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by_id?: number | null
          from_data_status?:
            | Database["public"]["Enums"]["devnet_data_status"]
            | null
          from_employee_id?: number | null
          from_status_id?: number | null
          id?: number
          notes?: string | null
          review_id?: number
          to_data_status?:
            | Database["public"]["Enums"]["devnet_data_status"]
            | null
          to_employee_id?: number | null
          to_status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "devnet_review_history_changed_by_id_fkey"
            columns: ["changed_by_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_history_from_employee_id_fkey"
            columns: ["from_employee_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_history_from_status_id_fkey"
            columns: ["from_status_id"]
            isOneToOne: false
            referencedRelation: "devnet_review_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_history_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "devnet_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_history_to_employee_id_fkey"
            columns: ["to_employee_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_review_history_to_status_id_fkey"
            columns: ["to_status_id"]
            isOneToOne: false
            referencedRelation: "devnet_review_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      devnet_review_statuses: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_terminal: boolean
          name: string
          needs_approval: boolean
          preferred_role: string | null
          required_specialties: string[] | null
          requires_assignment: boolean
          review_kind: Database["public"]["Enums"]["devnet_review_kind"]
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_terminal?: boolean
          name: string
          needs_approval?: boolean
          preferred_role?: string | null
          required_specialties?: string[] | null
          requires_assignment?: boolean
          review_kind: Database["public"]["Enums"]["devnet_review_kind"]
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_terminal?: boolean
          name?: string
          needs_approval?: boolean
          preferred_role?: string | null
          required_specialties?: string[] | null
          requires_assignment?: boolean
          review_kind?: Database["public"]["Enums"]["devnet_review_kind"]
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      devnet_reviews: {
        Row: {
          assigned_to_id: number | null
          completed_at: string | null
          completion_criteria: Json | null
          copied_to_devnet_at: string | null
          copied_to_devnet_by_id: number | null
          created_at: string
          current_status_id: number
          data: Json
          data_collected_at: string | null
          data_collected_by_id: number | null
          data_status: Database["public"]["Enums"]["devnet_data_status"] | null
          data_validation_rules: Json | null
          description: string | null
          devnet_copy_confirmed: boolean | null
          due_date: string | null
          entity_id: number | null
          entity_type: string | null
          field_data: Json | null
          field_notes: string | null
          id: number
          kind: Database["public"]["Enums"]["devnet_review_kind"]
          priority: string | null
          required_data_fields: Json | null
          requires_field_review: boolean | null
          title: string | null
          updated_at: string
        }
        Insert: {
          assigned_to_id?: number | null
          completed_at?: string | null
          completion_criteria?: Json | null
          copied_to_devnet_at?: string | null
          copied_to_devnet_by_id?: number | null
          created_at?: string
          current_status_id: number
          data?: Json
          data_collected_at?: string | null
          data_collected_by_id?: number | null
          data_status?: Database["public"]["Enums"]["devnet_data_status"] | null
          data_validation_rules?: Json | null
          description?: string | null
          devnet_copy_confirmed?: boolean | null
          due_date?: string | null
          entity_id?: number | null
          entity_type?: string | null
          field_data?: Json | null
          field_notes?: string | null
          id?: number
          kind: Database["public"]["Enums"]["devnet_review_kind"]
          priority?: string | null
          required_data_fields?: Json | null
          requires_field_review?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to_id?: number | null
          completed_at?: string | null
          completion_criteria?: Json | null
          copied_to_devnet_at?: string | null
          copied_to_devnet_by_id?: number | null
          created_at?: string
          current_status_id?: number
          data?: Json
          data_collected_at?: string | null
          data_collected_by_id?: number | null
          data_status?: Database["public"]["Enums"]["devnet_data_status"] | null
          data_validation_rules?: Json | null
          description?: string | null
          devnet_copy_confirmed?: boolean | null
          due_date?: string | null
          entity_id?: number | null
          entity_type?: string | null
          field_data?: Json | null
          field_notes?: string | null
          id?: number
          kind?: Database["public"]["Enums"]["devnet_review_kind"]
          priority?: string | null
          required_data_fields?: Json | null
          requires_field_review?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devnet_reviews_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_reviews_copied_to_devnet_by_id_fkey"
            columns: ["copied_to_devnet_by_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_reviews_current_status_id_fkey"
            columns: ["current_status_id"]
            isOneToOne: false
            referencedRelation: "devnet_review_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_reviews_data_collected_by_id_fkey"
            columns: ["data_collected_by_id"]
            isOneToOne: false
            referencedRelation: "devnet_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      devnet_sale_parcels: {
        Row: {
          created_at: string
          data: Json
          id: number
          parcel_id: number
          sale_id: number
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: number
          parcel_id: number
          sale_id: number
        }
        Update: {
          created_at?: string
          data?: Json
          id?: number
          parcel_id?: number
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "devnet_sale_parcels_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "devnet_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devnet_sale_parcels_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "devnet_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      devnet_sales: {
        Row: {
          created_at: string
          data: Json
          devnet_id: string | null
          id: number
          sale_date: string | null
          sale_price: number | null
          sale_status: string | null
          sale_type: string | null
          sync_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          devnet_id?: string | null
          id?: number
          sale_date?: string | null
          sale_price?: number | null
          sale_status?: string | null
          sale_type?: string | null
          sync_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          devnet_id?: string | null
          id?: number
          sale_date?: string | null
          sale_price?: number | null
          sale_status?: string | null
          sale_type?: string | null
          sync_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_position_history: {
        Row: {
          created_at: string
          created_by: string
          effective_date: string
          employee_id: number
          end_date: string | null
          fte_percent: number | null
          id: number
          notes: string | null
          position_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_date?: string
          employee_id: number
          end_date?: string | null
          fte_percent?: number | null
          id?: number
          notes?: string | null
          position_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_date?: string
          employee_id?: number
          end_date?: string | null
          fte_percent?: number | null
          id?: number
          notes?: string | null
          position_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_position_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_position_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_supervisor_relationships: {
        Row: {
          created_at: string
          created_by: string
          effective_date: string
          employee_id: number
          end_date: string | null
          id: number
          supervisor_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_date?: string
          employee_id: number
          end_date?: string | null
          id?: number
          supervisor_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_date?: string
          employee_id?: number
          end_date?: string | null
          id?: number
          supervisor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_supervisor_relationships_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_supervisor_relationships_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          created_by: string
          email: string | null
          first_name: string
          hire_date: string
          id: number
          last_name: string
          status: string
          termination_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          email?: string | null
          first_name: string
          hire_date: string
          id?: number
          last_name: string
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          email?: string | null
          first_name?: string
          hire_date?: string
          id?: number
          last_name?: string
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      employees_v2: {
        Row: {
          can_approve: boolean
          created_at: string
          email: string | null
          first_name: string
          id: number
          last_name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          can_approve?: boolean
          created_at?: string
          email?: string | null
          first_name: string
          id?: number
          last_name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          can_approve?: boolean
          created_at?: string
          email?: string | null
          first_name?: string
          id?: number
          last_name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          bucket_name: string
          checksum_md5: string | null
          created_at: string
          created_by: string | null
          extension: string | null
          id: number
          mime_type: string
          original_name: string | null
          path: string
          size_bytes: number
        }
        Insert: {
          bucket_name: string
          checksum_md5?: string | null
          created_at?: string
          created_by?: string | null
          extension?: string | null
          id?: number
          mime_type: string
          original_name?: string | null
          path: string
          size_bytes: number
        }
        Update: {
          bucket_name?: string
          checksum_md5?: string | null
          created_at?: string
          created_by?: string | null
          extension?: string | null
          id?: number
          mime_type?: string
          original_name?: string | null
          path?: string
          size_bytes?: number
        }
        Relationships: []
      }
      fires: {
        Row: {
          fd_apartment: string | null
          fd_distict: string | null
          fd_incident: string | null
          fd_station: string | null
          fd_street_name: string | null
          fd_street_number: string | null
          fd_street_prefix: string | null
          fd_time: string | null
          fd_zip: string | null
          id: number
          parcel_number: string | null
        }
        Insert: {
          fd_apartment?: string | null
          fd_distict?: string | null
          fd_incident?: string | null
          fd_station?: string | null
          fd_street_name?: string | null
          fd_street_number?: string | null
          fd_street_prefix?: string | null
          fd_time?: string | null
          fd_zip?: string | null
          id?: number
          parcel_number?: string | null
        }
        Update: {
          fd_apartment?: string | null
          fd_distict?: string | null
          fd_incident?: string | null
          fd_station?: string | null
          fd_street_name?: string | null
          fd_street_number?: string | null
          fd_street_prefix?: string | null
          fd_time?: string | null
          fd_zip?: string | null
          id?: number
          parcel_number?: string | null
        }
        Relationships: []
      }
      guide_2026: {
        Row: {
          created_at: string
          description: string | null
          id: number
          updated_at: string
          years: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          updated_at?: string
          years?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          updated_at?: string
          years?: string | null
        }
        Relationships: []
      }
      invoice_line_item: {
        Row: {
          amount: number | null
          description: string | null
          id: number
          invoice_id: number
          qty: number | null
          unit: string | null
        }
        Insert: {
          amount?: number | null
          description?: string | null
          id?: number
          invoice_id: number
          qty?: number | null
          unit?: string | null
        }
        Update: {
          amount?: number | null
          description?: string | null
          id?: number
          invoice_id?: number
          qty?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_item_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_name: string | null
          id: number
          paid_at: string | null
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          id?: number
          paid_at?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          id?: number
          paid_at?: string | null
        }
        Relationships: []
      }
      land_components: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
        }
        Relationships: []
      }
      land_current_uses_v2: {
        Row: {
          created_at: string
          effective_date: string
          id: number
          land_id: number
          percentage_allocation: number | null
          retired_date: string | null
          updated_at: string
          use_id: number
          use_notes: string | null
        }
        Insert: {
          created_at?: string
          effective_date?: string
          id?: number
          land_id: number
          percentage_allocation?: number | null
          retired_date?: string | null
          updated_at?: string
          use_id: number
          use_notes?: string | null
        }
        Update: {
          created_at?: string
          effective_date?: string
          id?: number
          land_id?: number
          percentage_allocation?: number | null
          retired_date?: string | null
          updated_at?: string
          use_id?: number
          use_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "land_current_uses_v2_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_current_uses_v2_use_id_fkey"
            columns: ["use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      land_parcel_links: {
        Row: {
          created_at: string
          created_by: string
          effective_at: string
          id: number
          land_id: number
          parcel_id: number
          review_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          land_id: number
          parcel_id: number
          review_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          land_id?: number
          parcel_id?: number
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "land_parcel_links_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_parcel_links_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      land_snapshots: {
        Row: {
          area_sqft: number | null
          created_at: string
          created_by: string
          depth_ft: number | null
          effective_at: string
          frontage_ft: number | null
          id: number
          land_id: number
          land_use_id: number | null
          review_id: number | null
          shape_detail: Json
        }
        Insert: {
          area_sqft?: number | null
          created_at?: string
          created_by?: string
          depth_ft?: number | null
          effective_at?: string
          frontage_ft?: number | null
          id?: number
          land_id: number
          land_use_id?: number | null
          review_id?: number | null
          shape_detail?: Json
        }
        Update: {
          area_sqft?: number | null
          created_at?: string
          created_by?: string
          depth_ft?: number | null
          effective_at?: string
          frontage_ft?: number | null
          id?: number
          land_id?: number
          land_use_id?: number | null
          review_id?: number | null
          shape_detail?: Json
        }
        Relationships: [
          {
            foreignKeyName: "land_snapshots_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_snapshots_land_use_id_fkey"
            columns: ["land_use_id"]
            isOneToOne: false
            referencedRelation: "land_uses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_snapshots_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      land_snapshots_v2: {
        Row: {
          active_values_at_snapshot: Json | null
          area_sqft: number | null
          best_use_at_snapshot: string | null
          created_at: string
          current_uses_at_snapshot: Json | null
          depth_ft: number | null
          frontage_ft: number | null
          id: number
          land_data: Json
          land_id: number
          land_use: string | null
          review_id: number
          snapshot_date: string
          topography: string | null
        }
        Insert: {
          active_values_at_snapshot?: Json | null
          area_sqft?: number | null
          best_use_at_snapshot?: string | null
          created_at?: string
          current_uses_at_snapshot?: Json | null
          depth_ft?: number | null
          frontage_ft?: number | null
          id?: number
          land_data?: Json
          land_id: number
          land_use?: string | null
          review_id: number
          snapshot_date?: string
          topography?: string | null
        }
        Update: {
          active_values_at_snapshot?: Json | null
          area_sqft?: number | null
          best_use_at_snapshot?: string | null
          created_at?: string
          current_uses_at_snapshot?: Json | null
          depth_ft?: number | null
          frontage_ft?: number | null
          id?: number
          land_data?: Json
          land_id?: number
          land_use?: string | null
          review_id?: number
          snapshot_date?: string
          topography?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "land_snapshots_v2_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_snapshots_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_snapshots_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      land_use_codes: {
        Row: {
          code: number
          name: string | null
        }
        Insert: {
          code: number
          name?: string | null
        }
        Update: {
          code?: number
          name?: string | null
        }
        Relationships: []
      }
      land_use_histories: {
        Row: {
          created_at: string
          created_by: string
          effective_at: string
          id: number
          land_id: number
          land_use_id: number
          review_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          land_id: number
          land_use_id: number
          review_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          land_id?: number
          land_use_id?: number
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "land_use_histories_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_use_histories_land_use_id_fkey"
            columns: ["land_use_id"]
            isOneToOne: false
            referencedRelation: "land_uses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_use_histories_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      land_uses: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      land_value_components_v2: {
        Row: {
          calculation_notes: string | null
          component_data: Json
          component_id: number
          component_value: number
          created_at: string
          id: number
          land_value_id: number
          percentage_of_total: number | null
        }
        Insert: {
          calculation_notes?: string | null
          component_data?: Json
          component_id: number
          component_value: number
          created_at?: string
          id?: number
          land_value_id: number
          percentage_of_total?: number | null
        }
        Update: {
          calculation_notes?: string | null
          component_data?: Json
          component_id?: number
          component_value?: number
          created_at?: string
          id?: number
          land_value_id?: number
          percentage_of_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "land_value_components_v2_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "value_components_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_value_components_v2_land_value_id_fkey"
            columns: ["land_value_id"]
            isOneToOne: false
            referencedRelation: "land_values_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      land_values_v2: {
        Row: {
          activated_at: string | null
          approval_notes: string | null
          approved_at: string | null
          approved_by: number | null
          assessment_cycle_id: number
          best_use_id: number | null
          calculation_completed_at: string | null
          calculation_metadata: Json
          calculation_trigger: string
          created_at: string
          created_by: string
          current_use_id: number | null
          id: number
          is_active: boolean
          land_id: number
          method_id: number
          scheduled_calculation_date: string
          status: string
          total_value: number | null
          triggered_by_changes: Json
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: number | null
          assessment_cycle_id: number
          best_use_id?: number | null
          calculation_completed_at?: string | null
          calculation_metadata?: Json
          calculation_trigger?: string
          created_at?: string
          created_by?: string
          current_use_id?: number | null
          id?: number
          is_active?: boolean
          land_id: number
          method_id: number
          scheduled_calculation_date: string
          status?: string
          total_value?: number | null
          triggered_by_changes?: Json
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: number | null
          assessment_cycle_id?: number
          best_use_id?: number | null
          calculation_completed_at?: string | null
          calculation_metadata?: Json
          calculation_trigger?: string
          created_at?: string
          created_by?: string
          current_use_id?: number | null
          id?: number
          is_active?: boolean
          land_id?: number
          method_id?: number
          scheduled_calculation_date?: string
          status?: string
          total_value?: number | null
          triggered_by_changes?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "land_values_v2_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_values_v2_assessment_cycle_id_fkey"
            columns: ["assessment_cycle_id"]
            isOneToOne: false
            referencedRelation: "assessment_cycles_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_values_v2_best_use_id_fkey"
            columns: ["best_use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_values_v2_current_use_id_fkey"
            columns: ["current_use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_values_v2_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_values_v2_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "valuation_methods_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      land_versions: {
        Row: {
          area_sqft: number | null
          created_at: string
          created_by: string
          data: Json
          effective_at: string
          id: number
          land_id: number
          review_id: number
        }
        Insert: {
          area_sqft?: number | null
          created_at?: string
          created_by?: string
          data: Json
          effective_at?: string
          id?: number
          land_id: number
          review_id: number
        }
        Update: {
          area_sqft?: number | null
          created_at?: string
          created_by?: string
          data?: Json
          effective_at?: string
          id?: number
          land_id?: number
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "land_versions_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_versions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      lands: {
        Row: {
          created_at: string
          id: number
          retired_at: string | null
          review_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          retired_at?: string | null
          review_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          retired_at?: string | null
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lands_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      lands_v2: {
        Row: {
          access_type: string | null
          area_sqft: number | null
          best_use_id: number | null
          best_use_reason: string | null
          best_use_updated_at: string | null
          created_at: string
          current_review_id: number | null
          depth_ft: number | null
          effective_date: string
          flood_zone: string | null
          frontage_ft: number | null
          id: number
          land_data: Json
          land_use: string | null
          parcel_id: number
          retired_at: string | null
          topography: string | null
          utilities: string[] | null
          wetlands: boolean | null
          zoning: string | null
        }
        Insert: {
          access_type?: string | null
          area_sqft?: number | null
          best_use_id?: number | null
          best_use_reason?: string | null
          best_use_updated_at?: string | null
          created_at?: string
          current_review_id?: number | null
          depth_ft?: number | null
          effective_date?: string
          flood_zone?: string | null
          frontage_ft?: number | null
          id?: number
          land_data?: Json
          land_use?: string | null
          parcel_id: number
          retired_at?: string | null
          topography?: string | null
          utilities?: string[] | null
          wetlands?: boolean | null
          zoning?: string | null
        }
        Update: {
          access_type?: string | null
          area_sqft?: number | null
          best_use_id?: number | null
          best_use_reason?: string | null
          best_use_updated_at?: string | null
          created_at?: string
          current_review_id?: number | null
          depth_ft?: number | null
          effective_date?: string
          flood_zone?: string | null
          frontage_ft?: number | null
          id?: number
          land_data?: Json
          land_use?: string | null
          parcel_id?: number
          retired_at?: string | null
          topography?: string | null
          utilities?: string[] | null
          wetlands?: boolean | null
          zoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lands_v2_best_use_id_fkey"
            columns: ["best_use_id"]
            isOneToOne: false
            referencedRelation: "property_uses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lands_v2_current_review_id_fkey"
            columns: ["current_review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lands_v2_current_review_id_fkey"
            columns: ["current_review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lands_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcel_overview_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lands_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      list: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      list_parcel_year: {
        Row: {
          list: number
          parcel_number: string
          year: number
        }
        Insert: {
          list: number
          parcel_number: string
          year: number
        }
        Update: {
          list?: number
          parcel_number?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "list_parcel_year_list_fkey"
            columns: ["list"]
            isOneToOne: false
            referencedRelation: "list"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_model_coefficients: {
        Row: {
          conf_high: number | null
          conf_low: number | null
          estimate: number
          id: number
          is_intercept: boolean
          model_run_id: number
          ordinal: number | null
          p_value: number | null
          statistic: number | null
          std_error: number | null
          term: string
        }
        Insert: {
          conf_high?: number | null
          conf_low?: number | null
          estimate: number
          id?: number
          is_intercept?: boolean
          model_run_id: number
          ordinal?: number | null
          p_value?: number | null
          statistic?: number | null
          std_error?: number | null
          term: string
        }
        Update: {
          conf_high?: number | null
          conf_low?: number | null
          estimate?: number
          id?: number
          is_intercept?: boolean
          model_run_id?: number
          ordinal?: number | null
          p_value?: number | null
          statistic?: number | null
          std_error?: number | null
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "ml_model_coefficients_model_run_id_fkey"
            columns: ["model_run_id"]
            isOneToOne: false
            referencedRelation: "ml_model_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_model_metrics: {
        Row: {
          dataset: string
          id: number
          metric: string
          model_run_id: number
          value: number
        }
        Insert: {
          dataset: string
          id?: number
          metric: string
          model_run_id: number
          value: number
        }
        Update: {
          dataset?: string
          id?: number
          metric?: string
          model_run_id?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "ml_model_metrics_model_run_id_fkey"
            columns: ["model_run_id"]
            isOneToOne: false
            referencedRelation: "ml_model_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_model_runs: {
        Row: {
          adj_r_squared: number | null
          created_at: string
          created_by: string | null
          df: number | null
          df_residual: number | null
          district: string | null
          engine: string
          features: string[]
          filters: Json | null
          formula: string | null
          id: number
          model_type: string
          n_test: number
          n_train: number
          notes: string | null
          params: Json | null
          r_squared: number | null
          recipe: Json | null
          run_key: string | null
          scope: string
          sigma: number | null
          status: string
          target_column: string
        }
        Insert: {
          adj_r_squared?: number | null
          created_at?: string
          created_by?: string | null
          df?: number | null
          df_residual?: number | null
          district?: string | null
          engine: string
          features: string[]
          filters?: Json | null
          formula?: string | null
          id?: number
          model_type: string
          n_test: number
          n_train: number
          notes?: string | null
          params?: Json | null
          r_squared?: number | null
          recipe?: Json | null
          run_key?: string | null
          scope: string
          sigma?: number | null
          status?: string
          target_column: string
        }
        Update: {
          adj_r_squared?: number | null
          created_at?: string
          created_by?: string | null
          df?: number | null
          df_residual?: number | null
          district?: string | null
          engine?: string
          features?: string[]
          filters?: Json | null
          formula?: string | null
          id?: number
          model_type?: string
          n_test?: number
          n_train?: number
          notes?: string | null
          params?: Json | null
          r_squared?: number | null
          recipe?: Json | null
          run_key?: string | null
          scope?: string
          sigma?: number | null
          status?: string
          target_column?: string
        }
        Relationships: []
      }
      neighborhood_sets: {
        Row: {
          created_at: string
          created_by: string
          id: number
          name: string
          retired_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          name: string
          retired_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          name?: string
          retired_at?: string | null
        }
        Relationships: []
      }
      neighborhoods: {
        Row: {
          group: number | null
          id: number
          name: string | null
          neighborhood: number
          polygon: Json[] | null
          set_id: number | null
        }
        Insert: {
          group?: number | null
          id?: number
          name?: string | null
          neighborhood?: number
          polygon?: Json[] | null
          set_id?: number | null
        }
        Update: {
          group?: number | null
          id?: number
          name?: string | null
          neighborhood?: number
          polygon?: Json[] | null
          set_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "neighborhoods_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "neighborhood_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods_v2: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      owner_address: {
        Row: {
          address_1: string | null
          address_2: string | null
          city: string | null
          id: string
          name_id: string
          state: string | null
          zip: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          id: string
          name_id: string
          state?: string | null
          zip?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          id?: string
          name_id?: string
          state?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_address_name_id_fkey"
            columns: ["name_id"]
            isOneToOne: false
            referencedRelation: "owner_name"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_name: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      parcel_addresses: {
        Row: {
          address_id: number
          created_at: string
          created_by: string
          effective_date: string
          end_date: string | null
          id: number
          parcel_id: number
        }
        Insert: {
          address_id: number
          created_at?: string
          created_by?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          parcel_id: number
        }
        Update: {
          address_id?: number
          created_at?: string
          created_by?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_addresses_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_addresses_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_attribute_definitions: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          name: string
          slug: string
          value_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          name: string
          slug: string
          value_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string
          slug?: string
          value_type?: string
        }
        Relationships: []
      }
      parcel_neighborhoods: {
        Row: {
          created_at: string
          created_by: string
          effective_date: string
          end_date: string | null
          id: number
          neighborhood_id: number
          parcel_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_date: string
          end_date?: string | null
          id?: number
          neighborhood_id: number
          parcel_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          neighborhood_id?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_neighborhoods_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_neighborhoods_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_property_classes: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          parcel_id: number | null
          property_class_id: number | null
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          parcel_id?: number | null
          property_class_id?: number | null
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          parcel_id?: number | null
          property_class_id?: number | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcel_preoperty_classes_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_property_classes_property_class_id_fkey"
            columns: ["property_class_id"]
            isOneToOne: false
            referencedRelation: "property_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_review_status_history: {
        Row: {
          created_at: string
          created_by: string
          id: number
          note: string | null
          parcel_review_id: number
          status_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          parcel_review_id: number
          status_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          parcel_review_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_review_status_history_parcel_review_id_fkey"
            columns: ["parcel_review_id"]
            isOneToOne: false
            referencedRelation: "parcel_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_review_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "parcel_review_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_review_statuses: {
        Row: {
          created_at: string
          id: number
          is_terminal: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      parcel_reviews: {
        Row: {
          id: number
          parcel_id: number
          review_id: number
        }
        Insert: {
          id?: number
          parcel_id: number
          review_id: number
        }
        Update: {
          id?: number
          parcel_id?: number
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_reviews_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_snapshots_v2: {
        Row: {
          block: number | null
          created_at: string
          created_by: string | null
          ext: number | null
          id: number
          lot: number | null
          neighborhood_id: number | null
          owner_address_id: number | null
          owner_name: string | null
          parcel_data: Json
          parcel_id: number
          parcel_number: string | null
          property_class: string | null
          review_id: number
          site_address_id: number | null
          snapshot_date: string
          tax_status_id: number | null
        }
        Insert: {
          block?: number | null
          created_at?: string
          created_by?: string | null
          ext?: number | null
          id?: number
          lot?: number | null
          neighborhood_id?: number | null
          owner_address_id?: number | null
          owner_name?: string | null
          parcel_data?: Json
          parcel_id: number
          parcel_number?: string | null
          property_class?: string | null
          review_id: number
          site_address_id?: number | null
          snapshot_date?: string
          tax_status_id?: number | null
        }
        Update: {
          block?: number | null
          created_at?: string
          created_by?: string | null
          ext?: number | null
          id?: number
          lot?: number | null
          neighborhood_id?: number | null
          owner_address_id?: number | null
          owner_name?: string | null
          parcel_data?: Json
          parcel_id?: number
          parcel_number?: string | null
          property_class?: string | null
          review_id?: number
          site_address_id?: number | null
          snapshot_date?: string
          tax_status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_snapshots_v2_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_owner_address_id_fkey"
            columns: ["owner_address_id"]
            isOneToOne: false
            referencedRelation: "addresses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcel_overview_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_site_address_id_fkey"
            columns: ["site_address_id"]
            isOneToOne: false
            referencedRelation: "addresses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_snapshots_v2_tax_status_id_fkey"
            columns: ["tax_status_id"]
            isOneToOne: false
            referencedRelation: "tax_statuses_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_tax_rates: {
        Row: {
          id: number
          parcel_id: number
          rate_year_id: number
        }
        Insert: {
          id?: number
          parcel_id: number
          rate_year_id: number
        }
        Update: {
          id?: number
          parcel_id?: number
          rate_year_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_tax_rates_rate_year_id_fkey"
            columns: ["rate_year_id"]
            isOneToOne: false
            referencedRelation: "tax_rate_years"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_tax_statuses: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          parcel_id: number | null
          start_date: string
          tax_status_id: number | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          parcel_id?: number | null
          start_date: string
          tax_status_id?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          parcel_id?: number | null
          start_date?: string
          tax_status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_tax_statuses_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_tax_statuses_tax_status_id_fkey"
            columns: ["tax_status_id"]
            isOneToOne: false
            referencedRelation: "tax_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_value_set_snapshots: {
        Row: {
          agricultural_improvement_value: number | null
          agricultural_land_value: number | null
          commercial_improvement_value: number | null
          commercial_land_value: number | null
          created_at: string
          effective_at: string
          id: number
          residential_improvement_value: number | null
          residential_land_value: number | null
          review_id: number
          total_improvement_value: number
          total_land_value: number
          total_value: number
          value_set_id: number
        }
        Insert: {
          agricultural_improvement_value?: number | null
          agricultural_land_value?: number | null
          commercial_improvement_value?: number | null
          commercial_land_value?: number | null
          created_at?: string
          effective_at?: string
          id?: number
          residential_improvement_value?: number | null
          residential_land_value?: number | null
          review_id: number
          total_improvement_value: number
          total_land_value: number
          total_value: number
          value_set_id: number
        }
        Update: {
          agricultural_improvement_value?: number | null
          agricultural_land_value?: number | null
          commercial_improvement_value?: number | null
          commercial_land_value?: number | null
          created_at?: string
          effective_at?: string
          id?: number
          residential_improvement_value?: number | null
          residential_land_value?: number | null
          review_id?: number
          total_improvement_value?: number
          total_land_value?: number
          total_value?: number
          value_set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_value_set_snapshots_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_value_set_snapshots_value_set_id_fkey"
            columns: ["value_set_id"]
            isOneToOne: false
            referencedRelation: "parcel_value_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_value_sets: {
        Row: {
          approach: string
          created_at: string
          id: number
          parcel_id: number
          review_id: number
          supersedes_value_set_id: number | null
          tax_year: number
          totals: Json
        }
        Insert: {
          approach: string
          created_at?: string
          id?: number
          parcel_id: number
          review_id: number
          supersedes_value_set_id?: number | null
          tax_year: number
          totals?: Json
        }
        Update: {
          approach?: string
          created_at?: string
          id?: number
          parcel_id?: number
          review_id?: number
          supersedes_value_set_id?: number | null
          tax_year?: number
          totals?: Json
        }
        Relationships: [
          {
            foreignKeyName: "parcel_value_sets_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_value_sets_supersedes_value_set_id_fkey"
            columns: ["supersedes_value_set_id"]
            isOneToOne: false
            referencedRelation: "parcel_value_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      parcels: {
        Row: {
          block: number | null
          created_at: string
          ext: number | null
          id: number
          lot: number | null
          retired_at: string | null
        }
        Insert: {
          block?: number | null
          created_at?: string
          ext?: number | null
          id?: number
          lot?: number | null
          retired_at?: string | null
        }
        Update: {
          block?: number | null
          created_at?: string
          ext?: number | null
          id?: number
          lot?: number | null
          retired_at?: string | null
        }
        Relationships: []
      }
      parcels_v2: {
        Row: {
          block: number | null
          created_at: string
          current_review_id: number | null
          default_appraiser_id: number | null
          ext: number | null
          id: number
          last_updated_at: string
          lot: number | null
          neighborhood_id: number | null
          owner_address_id: number | null
          owner_name: string | null
          parcel_data: Json
          parcel_number: string | null
          property_class: string | null
          site_address_id: number | null
          tax_status_id: number | null
        }
        Insert: {
          block?: number | null
          created_at?: string
          current_review_id?: number | null
          default_appraiser_id?: number | null
          ext?: number | null
          id?: number
          last_updated_at?: string
          lot?: number | null
          neighborhood_id?: number | null
          owner_address_id?: number | null
          owner_name?: string | null
          parcel_data?: Json
          parcel_number?: string | null
          property_class?: string | null
          site_address_id?: number | null
          tax_status_id?: number | null
        }
        Update: {
          block?: number | null
          created_at?: string
          current_review_id?: number | null
          default_appraiser_id?: number | null
          ext?: number | null
          id?: number
          last_updated_at?: string
          lot?: number | null
          neighborhood_id?: number | null
          owner_address_id?: number | null
          owner_name?: string | null
          parcel_data?: Json
          parcel_number?: string | null
          property_class?: string | null
          site_address_id?: number | null
          tax_status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcels_v2_current_review_id_fkey"
            columns: ["current_review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_v2_current_review_id_fkey"
            columns: ["current_review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_v2_default_appraiser_id_fkey"
            columns: ["default_appraiser_id"]
            isOneToOne: false
            referencedRelation: "employees_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_v2_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_v2_owner_address_id_fkey"
            columns: ["owner_address_id"]
            isOneToOne: false
            referencedRelation: "addresses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_v2_site_address_id_fkey"
            columns: ["site_address_id"]
            isOneToOne: false
            referencedRelation: "addresses_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_v2_tax_status_id_fkey"
            columns: ["tax_status_id"]
            isOneToOne: false
            referencedRelation: "tax_statuses_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          created_at: string
          created_by: string | null
          display_name: string
          id: number
          kind: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_name: string
          id?: number
          kind?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_name?: string
          id?: number
          kind?: string
        }
        Relationships: []
      }
      permit_parcels: {
        Row: {
          created_at: string
          created_by: string | null
          parcel_id: number
          permit_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          parcel_id: number
          permit_id: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          parcel_id?: number
          permit_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "permit_parcels_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permits"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_review_status_history: {
        Row: {
          created_at: string
          created_by: string
          id: number
          note: string | null
          permit_review_id: number
          status_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          permit_review_id: number
          status_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          permit_review_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "permit_review_status_history_permit_review_id_fkey"
            columns: ["permit_review_id"]
            isOneToOne: false
            referencedRelation: "permit_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_review_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "permit_review_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_review_statuses: {
        Row: {
          created_at: string
          id: number
          is_terminal: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      permit_reviews: {
        Row: {
          created_at: string
          created_by: string
          id: number
          payload: Json | null
          permit_id: number
          review_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          payload?: Json | null
          permit_id: number
          review_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          payload?: Json | null
          permit_id?: number
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "permit_reviews_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_reviews_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_types: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      permits: {
        Row: {
          closed_date: string | null
          created_at: string
          created_by: string | null
          id: number
          issued_date: string | null
          permit_number: string
          permit_type_id: number | null
        }
        Insert: {
          closed_date?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          issued_date?: string | null
          permit_number: string
          permit_type_id?: number | null
        }
        Update: {
          closed_date?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          issued_date?: string | null
          permit_number?: string
          permit_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "permits_permit_type_id_fkey"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      permits_v2: {
        Row: {
          affects_value: boolean | null
          completed_date: string | null
          contractor_name: string | null
          created_at: string
          estimated_value_impact: number | null
          id: number
          issued_date: string | null
          parcel_id: number
          permit_data: Json
          permit_number: string
          permit_type: string
          permit_value: number | null
          review_id: number | null
          work_description: string | null
        }
        Insert: {
          affects_value?: boolean | null
          completed_date?: string | null
          contractor_name?: string | null
          created_at?: string
          estimated_value_impact?: number | null
          id?: number
          issued_date?: string | null
          parcel_id: number
          permit_data?: Json
          permit_number: string
          permit_type: string
          permit_value?: number | null
          review_id?: number | null
          work_description?: string | null
        }
        Update: {
          affects_value?: boolean | null
          completed_date?: string | null
          contractor_name?: string | null
          created_at?: string
          estimated_value_impact?: number | null
          id?: number
          issued_date?: string | null
          parcel_id?: number
          permit_data?: Json
          permit_number?: string
          permit_type?: string
          permit_value?: number | null
          review_id?: number | null
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permits_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcel_overview_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      permits_versions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          effective_at: string
          id: number
          issue_date: string
          permit_id: number
          permit_number: string
          permit_type: string
          property_details: Json
          review_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          effective_at?: string
          id?: number
          issue_date: string
          permit_id: number
          permit_number: string
          permit_type: string
          property_details?: Json
          review_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          effective_at?: string
          id?: number
          issue_date?: string
          permit_id?: number
          permit_number?: string
          permit_type?: string
          property_details?: Json
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "permits_versions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_versions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          code: string | null
          created_at: string
          created_by: string
          department_id: number
          id: number
          pay_grade: string | null
          title: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          created_by?: string
          department_id: number
          id?: number
          pay_grade?: string | null
          title: string
        }
        Update: {
          code?: string | null
          created_at?: string
          created_by?: string
          department_id?: number
          id?: number
          pay_grade?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      property_classes: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      property_uses_v2: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      regression_model_coefficients: {
        Row: {
          coefficient: number
          created_at: string
          created_by: string | null
          id: number
          p_value: number | null
          run_id: number
          std_error: number | null
          t_value: number | null
          term: string
        }
        Insert: {
          coefficient: number
          created_at?: string
          created_by?: string | null
          id?: number
          p_value?: number | null
          run_id: number
          std_error?: number | null
          t_value?: number | null
          term: string
        }
        Update: {
          coefficient?: number
          created_at?: string
          created_by?: string | null
          id?: number
          p_value?: number | null
          run_id?: number
          std_error?: number | null
          t_value?: number | null
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "regression_model_coefficients_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "regression_model_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      regression_model_runs: {
        Row: {
          as_of_date: string
          created_at: string
          created_by: string | null
          id: number
          metrics: Json | null
          model_id: number
          trained_at: string
          training_filters: Json | null
        }
        Insert: {
          as_of_date: string
          created_at?: string
          created_by?: string | null
          id?: number
          metrics?: Json | null
          model_id: number
          trained_at?: string
          training_filters?: Json | null
        }
        Update: {
          as_of_date?: string
          created_at?: string
          created_by?: string | null
          id?: number
          metrics?: Json | null
          model_id?: number
          trained_at?: string
          training_filters?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "regression_model_runs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "regression_models"
            referencedColumns: ["id"]
          },
        ]
      }
      regression_models: {
        Row: {
          algorithm: string | null
          created_at: string
          created_by: string | null
          feature_spec: Json | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          algorithm?: string | null
          created_at?: string
          created_by?: string | null
          feature_spec?: Json | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          algorithm?: string | null
          created_at?: string
          created_by?: string | null
          feature_spec?: Json | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      regression_predictions: {
        Row: {
          as_of_date: string
          created_at: string
          created_by: string | null
          extra: Json | null
          id: number
          parcel_id: number
          predicted_total_value: number
          run_id: number
        }
        Insert: {
          as_of_date: string
          created_at?: string
          created_by?: string | null
          extra?: Json | null
          id?: number
          parcel_id: number
          predicted_total_value: number
          run_id: number
        }
        Update: {
          as_of_date?: string
          created_at?: string
          created_by?: string | null
          extra?: Json | null
          id?: number
          parcel_id?: number
          predicted_total_value?: number
          run_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "regression_predictions_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "regression_model_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      report_dates: {
        Row: {
          id: number
          report_date: string | null
          source: string | null
          year: number | null
        }
        Insert: {
          id?: number
          report_date?: string | null
          source?: string | null
          year?: number | null
        }
        Update: {
          id?: number
          report_date?: string | null
          source?: string | null
          year?: number | null
        }
        Relationships: []
      }
      report_info: {
        Row: {
          column_name: string | null
          id: number
          table_name: string | null
        }
        Insert: {
          column_name?: string | null
          id?: number
          table_name?: string | null
        }
        Update: {
          column_name?: string | null
          id?: number
          table_name?: string | null
        }
        Relationships: []
      }
      review_assignments: {
        Row: {
          assigned_by: string
          created_at: string
          employee_id: number
          id: number
          review_id: number
          valid: unknown
        }
        Insert: {
          assigned_by?: string
          created_at?: string
          employee_id: number
          id?: number
          review_id: number
          valid: unknown
        }
        Update: {
          assigned_by?: string
          created_at?: string
          employee_id?: number
          id?: number
          review_id?: number
          valid?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "review_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_assignments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_files: {
        Row: {
          caption: string | null
          created_at: string
          created_by: string
          file_id: number
          review_id: number
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          created_by?: string
          file_id: number
          review_id: number
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          created_by?: string
          file_id?: number
          review_id?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_files_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_files_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_history_v2: {
        Row: {
          changed_at: string
          changed_by: string
          id: number
          note: string | null
          review_id: number
          status_id: number
        }
        Insert: {
          changed_at?: string
          changed_by?: string
          id?: number
          note?: string | null
          review_id: number
          status_id: number
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: number
          note?: string | null
          review_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_history_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_history_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_history_v2_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "review_statuses_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      review_lands: {
        Row: {
          land_id: number
          review_id: number
        }
        Insert: {
          land_id: number
          review_id: number
        }
        Update: {
          land_id?: number
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_lands_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_lands_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_notes: {
        Row: {
          created_at: string
          created_by: string
          id: number
          note: string
          review_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          note: string
          review_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_notes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_statuses_v2: {
        Row: {
          created_at: string
          id: number
          is_terminal: boolean
          name: string
          needs_approval: boolean
          review_kind: Database["public"]["Enums"]["review_kind_v2"]
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name: string
          needs_approval?: boolean
          review_kind: Database["public"]["Enums"]["review_kind_v2"]
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name?: string
          needs_approval?: boolean
          review_kind?: Database["public"]["Enums"]["review_kind_v2"]
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: number
          kind: Database["public"]["Enums"]["review_kind"]
          title: string | null
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: number
          kind: Database["public"]["Enums"]["review_kind"]
          title?: string | null
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: number
          kind?: Database["public"]["Enums"]["review_kind"]
          title?: string | null
        }
        Relationships: []
      }
      reviews_v2: {
        Row: {
          assigned_to_id: number | null
          completed_at: string | null
          created_at: string
          created_by: string
          current_status_id: number | null
          data: Json
          due_date: string | null
          id: number
          kind: Database["public"]["Enums"]["review_kind_v2"]
          title: string | null
        }
        Insert: {
          assigned_to_id?: number | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          current_status_id?: number | null
          data?: Json
          due_date?: string | null
          id?: number
          kind: Database["public"]["Enums"]["review_kind_v2"]
          title?: string | null
        }
        Update: {
          assigned_to_id?: number | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          current_status_id?: number | null
          data?: Json
          due_date?: string | null
          id?: number
          kind?: Database["public"]["Enums"]["review_kind_v2"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_v2_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "employees_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_v2_current_status_id_fkey"
            columns: ["current_status_id"]
            isOneToOne: false
            referencedRelation: "review_statuses_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_parcels: {
        Row: {
          created_at: string
          created_by: string
          id: number
          parcel_id: number
          sale_version_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          parcel_id: number
          sale_version_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          parcel_id?: number
          sale_version_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_parcels_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_parcels_sale_version_id_fkey"
            columns: ["sale_version_id"]
            isOneToOne: false
            referencedRelation: "sales_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_review_status_history: {
        Row: {
          created_at: string
          created_by: string
          id: number
          note: string | null
          sale_review_id: number
          status_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          sale_review_id: number
          status_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          note?: string | null
          sale_review_id?: number
          status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_review_status_history_sale_review_id_fkey"
            columns: ["sale_review_id"]
            isOneToOne: false
            referencedRelation: "sale_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_review_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "sale_review_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_review_statuses: {
        Row: {
          created_at: string
          id: number
          is_terminal: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          is_terminal?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      sale_reviews: {
        Row: {
          created_at: string
          created_by: string
          id: number
          review_id: number | null
          sale_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          review_id?: number | null
          sale_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          review_id?: number | null
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_reviews_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_reviews_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_types: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string
          created_by: string
          id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
        }
        Relationships: []
      }
      sales_parcels_v2: {
        Row: {
          allocated_price: number | null
          created_at: string
          id: number
          parcel_id: number
          percentage: number | null
          sale_id: number
        }
        Insert: {
          allocated_price?: number | null
          created_at?: string
          id?: number
          parcel_id: number
          percentage?: number | null
          sale_id: number
        }
        Update: {
          allocated_price?: number | null
          created_at?: string
          id?: number
          parcel_id?: number
          percentage?: number | null
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_parcels_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcel_overview_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_parcels_v2_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_parcels_v2_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_v2: {
        Row: {
          building_condition_at_sale: Json | null
          created_at: string
          financing_terms: string | null
          grantee: string | null
          grantor: string | null
          id: number
          is_valid: boolean | null
          market_conditions: string | null
          review_id: number | null
          sale_data: Json
          sale_date: string
          sale_price: number
          sale_type: string
          validity_reason: string | null
        }
        Insert: {
          building_condition_at_sale?: Json | null
          created_at?: string
          financing_terms?: string | null
          grantee?: string | null
          grantor?: string | null
          id?: number
          is_valid?: boolean | null
          market_conditions?: string | null
          review_id?: number | null
          sale_data?: Json
          sale_date: string
          sale_price: number
          sale_type?: string
          validity_reason?: string | null
        }
        Update: {
          building_condition_at_sale?: Json | null
          created_at?: string
          financing_terms?: string | null
          grantee?: string | null
          grantor?: string | null
          id?: number
          is_valid?: boolean | null
          market_conditions?: string | null
          review_id?: number | null
          sale_data?: Json
          sale_date?: string
          sale_price?: number
          sale_type?: string
          validity_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "active_reviews_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_v2_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_versions: {
        Row: {
          created_at: string
          created_by: string
          effective_at: string
          grantee: string | null
          grantor: string | null
          id: number
          review_id: number
          sale_date: string | null
          sale_id: number
          sale_price: number
          sale_type_id: number | null
          version_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_at?: string
          grantee?: string | null
          grantor?: string | null
          id?: number
          review_id: number
          sale_date?: string | null
          sale_id: number
          sale_price: number
          sale_type_id?: number | null
          version_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_at?: string
          grantee?: string | null
          grantor?: string | null
          id?: number
          review_id?: number
          sale_date?: string | null
          sale_id?: number
          sale_price?: number
          sale_type_id?: number | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_versions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_versions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_versions_sale_type_id_fkey"
            columns: ["sale_type_id"]
            isOneToOne: false
            referencedRelation: "sale_types"
            referencedColumns: ["id"]
          },
        ]
      }
      sched_hearing_slots: {
        Row: {
          duration_minutes: number
          id: number
          slot_time: string
        }
        Insert: {
          duration_minutes?: number
          id?: number
          slot_time: string
        }
        Update: {
          duration_minutes?: number
          id?: number
          slot_time?: string
        }
        Relationships: []
      }
      sched_scheduled_hearings: {
        Row: {
          appeal_id: number
          hearing_slot_id: number
          id: number
          scheduled_at: string | null
          scheduled_by: string | null
        }
        Insert: {
          appeal_id: number
          hearing_slot_id: number
          id?: number
          scheduled_at?: string | null
          scheduled_by?: string | null
        }
        Update: {
          appeal_id?: number
          hearing_slot_id?: number
          id?: number
          scheduled_at?: string | null
          scheduled_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sched_scheduled_hearings_hearing_slot_id_fkey"
            columns: ["hearing_slot_id"]
            isOneToOne: false
            referencedRelation: "sched_hearing_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      search_table_2: {
        Row: {
          created_at: string | null
          fts: unknown
          house_number: string | null
          id: number
          name: string | null
          parcel_number: string | null
          retired_at: string | null
          street_name: string | null
          street_suffix: string | null
          zip_code: string | null
        }
        Insert: {
          created_at?: string | null
          fts?: unknown
          house_number?: string | null
          id?: number
          name?: string | null
          parcel_number?: string | null
          retired_at?: string | null
          street_name?: string | null
          street_suffix?: string | null
          zip_code?: string | null
        }
        Update: {
          created_at?: string | null
          fts?: unknown
          house_number?: string | null
          id?: number
          name?: string | null
          parcel_number?: string | null
          retired_at?: string | null
          street_name?: string | null
          street_suffix?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      senior_tax_credits: {
        Row: {
          approval_letter_printed_timestamp: string | null
          parcel_number: string
          status: string
          submission_type: string | null
          year: number | null
        }
        Insert: {
          approval_letter_printed_timestamp?: string | null
          parcel_number: string
          status: string
          submission_type?: string | null
          year?: number | null
        }
        Update: {
          approval_letter_printed_timestamp?: string | null
          parcel_number?: string
          status?: string
          submission_type?: string | null
          year?: number | null
        }
        Relationships: []
      }
      spec_bus_dist_codes: {
        Row: {
          code: number
          name: string
        }
        Insert: {
          code?: number
          name: string
        }
        Update: {
          code?: number
          name?: string
        }
        Relationships: []
      }
      statuses: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      structure_condition_histories: {
        Row: {
          condition_id: number
          created_at: string
          created_by: string
          effective_at: string
          id: number
          review_id: number | null
          structure_id: number
        }
        Insert: {
          condition_id: number
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          review_id?: number | null
          structure_id: number
        }
        Update: {
          condition_id?: number
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          review_id?: number | null
          structure_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "structure_condition_histories_condition_id_fkey"
            columns: ["condition_id"]
            isOneToOne: false
            referencedRelation: "structure_conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "structure_condition_histories_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      structure_conditions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name: string
          slug: string
          sort_order: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      structure_parcel_links: {
        Row: {
          created_at: string
          created_by: string
          effective_at: string
          id: number
          parcel_id: number
          review_id: number | null
          structure_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          parcel_id: number
          review_id?: number | null
          structure_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_at?: string
          id?: number
          parcel_id?: number
          review_id?: number | null
          structure_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "structure_parcel_links_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      structure_section_types: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      structure_section_versions: {
        Row: {
          area_sqft: number
          created_at: string
          created_by: string
          details: Json
          effective_at: string
          id: number
          living_area_sqft: number
          review_id: number | null
          section_type: number
          structure_id: number
        }
        Insert: {
          area_sqft: number
          created_at?: string
          created_by?: string
          details?: Json
          effective_at?: string
          id?: number
          living_area_sqft: number
          review_id?: number | null
          section_type: number
          structure_id: number
        }
        Update: {
          area_sqft?: number
          created_at?: string
          created_by?: string
          details?: Json
          effective_at?: string
          id?: number
          living_area_sqft?: number
          review_id?: number | null
          section_type?: number
          structure_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "structure_section_versions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "structure_section_versions_section_type_fkey"
            columns: ["section_type"]
            isOneToOne: false
            referencedRelation: "structure_section_types"
            referencedColumns: ["id"]
          },
        ]
      }
      structure_snapshots: {
        Row: {
          attached_garage_sqft: number | null
          attic_livable_sqft: number | null
          attic_unfinished_sqft: number | null
          base_material_id: number | null
          basement_finished_sqft: number | null
          basement_unfinished_sqft: number | null
          best_use_id: number | null
          brick_sqft: number | null
          category: string | null
          concrete_sqft: number | null
          condition_id: number | null
          created_at: string
          created_by: string
          effective_at: string
          frame_sqft: number | null
          id: number
          number_of_bathrooms: number | null
          number_of_bedrooms: number | null
          number_of_stories: number | null
          number_of_units: number | null
          replacement_cost_new: number | null
          review_id: number | null
          sections_detail: Json
          structure_id: number
          total_area_sqft: number | null
          total_livable_sqft: number | null
          year_built: number | null
        }
        Insert: {
          attached_garage_sqft?: number | null
          attic_livable_sqft?: number | null
          attic_unfinished_sqft?: number | null
          base_material_id?: number | null
          basement_finished_sqft?: number | null
          basement_unfinished_sqft?: number | null
          best_use_id?: number | null
          brick_sqft?: number | null
          category?: string | null
          concrete_sqft?: number | null
          condition_id?: number | null
          created_at?: string
          created_by?: string
          effective_at?: string
          frame_sqft?: number | null
          id?: number
          number_of_bathrooms?: number | null
          number_of_bedrooms?: number | null
          number_of_stories?: number | null
          number_of_units?: number | null
          replacement_cost_new?: number | null
          review_id?: number | null
          sections_detail?: Json
          structure_id: number
          total_area_sqft?: number | null
          total_livable_sqft?: number | null
          year_built?: number | null
        }
        Update: {
          attached_garage_sqft?: number | null
          attic_livable_sqft?: number | null
          attic_unfinished_sqft?: number | null
          base_material_id?: number | null
          basement_finished_sqft?: number | null
          basement_unfinished_sqft?: number | null
          best_use_id?: number | null
          brick_sqft?: number | null
          category?: string | null
          concrete_sqft?: number | null
          condition_id?: number | null
          created_at?: string
          created_by?: string
          effective_at?: string
          frame_sqft?: number | null
          id?: number
          number_of_bathrooms?: number | null
          number_of_bedrooms?: number | null
          number_of_stories?: number | null
          number_of_units?: number | null
          replacement_cost_new?: number | null
          review_id?: number | null
          sections_detail?: Json
          structure_id?: number
          total_area_sqft?: number | null
          total_livable_sqft?: number | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "structure_snapshots_base_material_id_fkey"
            columns: ["base_material_id"]
            isOneToOne: false
            referencedRelation: "construction_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "structure_snapshots_best_use_id_fkey"
            columns: ["best_use_id"]
            isOneToOne: false
            referencedRelation: "structure_uses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "structure_snapshots_condition_id_fkey"
            columns: ["condition_id"]
            isOneToOne: false
            referencedRelation: "structure_conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "structure_snapshots_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      structure_uses: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      structures: {
        Row: {
          created_at: string
          id: number
          retired_at: string | null
          review_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          retired_at?: string | null
          review_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          retired_at?: string | null
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "structures_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_districts: {
        Row: {
          code: string
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          code: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          code?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      tax_rate_years: {
        Row: {
          applies_to: Json[] | null
          cap: number | null
          created_at: string | null
          id: number
          rate: number
          rate_type: string
          subdistrict_id: number
          tax_year: number
        }
        Insert: {
          applies_to?: Json[] | null
          cap?: number | null
          created_at?: string | null
          id?: number
          rate: number
          rate_type: string
          subdistrict_id: number
          tax_year: number
        }
        Update: {
          applies_to?: Json[] | null
          cap?: number | null
          created_at?: string | null
          id?: number
          rate?: number
          rate_type?: string
          subdistrict_id?: number
          tax_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_rate_years_subdistrict_id_fkey"
            columns: ["subdistrict_id"]
            isOneToOne: false
            referencedRelation: "tax_subdistricts"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_statuses: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      tax_statuses_v2: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      tax_subdistricts: {
        Row: {
          description: string | null
          id: number
          name: string | null
          tax_district_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
          tax_district_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          tax_district_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_subdistricts_tax_district_id_fkey"
            columns: ["tax_district_id"]
            isOneToOne: false
            referencedRelation: "tax_districts"
            referencedColumns: ["id"]
          },
        ]
      }
      test_conditions: {
        Row: {
          condition: string
          created_at: string
          effective_date: string
          id: number
          structure_id: number
        }
        Insert: {
          condition: string
          created_at?: string
          effective_date: string
          id?: number
          structure_id: number
        }
        Update: {
          condition?: string
          created_at?: string
          effective_date?: string
          id?: number
          structure_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_conditions_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "test_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      test_garages: {
        Row: {
          garage_type: string
          id: number
          parcel_id: number
          total_garage_area: number
        }
        Insert: {
          garage_type: string
          id?: number
          parcel_id: number
          total_garage_area?: number
        }
        Update: {
          garage_type?: string
          id?: number
          parcel_id?: number
          total_garage_area?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_garages_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_geocoded_addresses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          attribution: string | null
          attribution_url: string | null
          category: string | null
          city: string | null
          country: string | null
          country_code: string | null
          county: string | null
          devnet_address: string | null
          distance: number | null
          district: string | null
          footway: string | null
          formatted: string | null
          fts_address_line1: unknown
          geocode_id: string | null
          hamlet: string | null
          housenumber: string | null
          iso3166_2: string | null
          lat: number | null
          license: string | null
          lon: number | null
          match_type: string | null
          name: string | null
          old_name: string | null
          place_id: string
          plus_code: string | null
          plus_code_short: string | null
          postcode: string | null
          ref: string | null
          result_type: string | null
          sourcename: string | null
          state: string | null
          state_code: string | null
          street: string | null
          suburb: string | null
          timezone: string | null
          timezone_abbreviation: string | null
          timezone_offset: string | null
          town: string | null
          village: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          attribution?: string | null
          attribution_url?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          devnet_address?: string | null
          distance?: number | null
          district?: string | null
          footway?: string | null
          formatted?: string | null
          fts_address_line1?: unknown
          geocode_id?: string | null
          hamlet?: string | null
          housenumber?: string | null
          iso3166_2?: string | null
          lat?: number | null
          license?: string | null
          lon?: number | null
          match_type?: string | null
          name?: string | null
          old_name?: string | null
          place_id: string
          plus_code?: string | null
          plus_code_short?: string | null
          postcode?: string | null
          ref?: string | null
          result_type?: string | null
          sourcename?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          suburb?: string | null
          timezone?: string | null
          timezone_abbreviation?: string | null
          timezone_offset?: string | null
          town?: string | null
          village?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          attribution?: string | null
          attribution_url?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          devnet_address?: string | null
          distance?: number | null
          district?: string | null
          footway?: string | null
          formatted?: string | null
          fts_address_line1?: unknown
          geocode_id?: string | null
          hamlet?: string | null
          housenumber?: string | null
          iso3166_2?: string | null
          lat?: number | null
          license?: string | null
          lon?: number | null
          match_type?: string | null
          name?: string | null
          old_name?: string | null
          place_id?: string
          plus_code?: string | null
          plus_code_short?: string | null
          postcode?: string | null
          ref?: string | null
          result_type?: string | null
          sourcename?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          suburb?: string | null
          timezone?: string | null
          timezone_abbreviation?: string | null
          timezone_offset?: string | null
          town?: string | null
          village?: string | null
        }
        Relationships: []
      }
      test_images: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string
        }
        Relationships: []
      }
      test_parcel_addresses: {
        Row: {
          effective_date: string
          end_date: string | null
          parcel_id: number
          place_id: string
        }
        Insert: {
          effective_date?: string
          end_date?: string | null
          parcel_id: number
          place_id: string
        }
        Update: {
          effective_date?: string
          end_date?: string | null
          parcel_id?: number
          place_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_addresses_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_addresses_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "test_geocoded_addresses"
            referencedColumns: ["place_id"]
          },
        ]
      }
      test_parcel_image_primary: {
        Row: {
          created_at: string | null
          effective_date: string
          id: number
          image_id: number
          parcel_id: number
        }
        Insert: {
          created_at?: string | null
          effective_date?: string
          id?: number
          image_id: number
          parcel_id: number
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          id?: number
          image_id?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_image_primary_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "test_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_image_primary_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcel_images: {
        Row: {
          created_at: string | null
          id: number
          image_id: number
          parcel_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_id: number
          parcel_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          image_id?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "test_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_images_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcel_join: {
        Row: {
          child_parcel: number | null
          parent_parcel: number | null
        }
        Insert: {
          child_parcel?: number | null
          parent_parcel?: number | null
        }
        Update: {
          child_parcel?: number | null
          parent_parcel?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_join_child_parcel_fkey"
            columns: ["child_parcel"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcel_land_areas: {
        Row: {
          area: number
          created_at: string
          effective_date: string
          end_date: string | null
          id: number
          parcel_id: number
        }
        Insert: {
          area?: number
          created_at?: string
          effective_date: string
          end_date?: string | null
          id?: number
          parcel_id: number
        }
        Update: {
          area?: number
          created_at?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_parcel_land_area_parcel"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcel_land_uses: {
        Row: {
          created_at: string
          effective_date: string
          end_date: string | null
          id: number
          land_use: number
          parcel_id: number
        }
        Insert: {
          created_at?: string
          effective_date: string
          end_date?: string | null
          id?: number
          land_use: number
          parcel_id: number
        }
        Update: {
          created_at?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          land_use?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_parcel_land_use_parcel"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_land_uses_land_use_fkey"
            columns: ["land_use"]
            isOneToOne: false
            referencedRelation: "land_use_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      test_parcel_neighborhoods: {
        Row: {
          created_at: string
          created_by: string
          effective_date: string
          end_date: string | null
          id: number
          neighborhood_id: number
          parcel_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          effective_date: string
          end_date?: string | null
          id?: number
          neighborhood_id: number
          parcel_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          neighborhood_id?: number
          parcel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_neighborhoods_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_neighborhoods_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcel_sales: {
        Row: {
          parcel_id: number
          report_timestamp: string
          sale_id: number
        }
        Insert: {
          parcel_id: number
          report_timestamp?: string
          sale_id: number
        }
        Update: {
          parcel_id?: number
          report_timestamp?: string
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_sales_parcel_fk"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_sales_sale_fk"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "test_sales"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      test_parcel_structures: {
        Row: {
          created_at: string
          effective_date: string
          end_date: string | null
          id: number
          parcel_id: number
          structure_id: number
        }
        Insert: {
          created_at?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          parcel_id: number
          structure_id: number
        }
        Update: {
          created_at?: string
          effective_date?: string
          end_date?: string | null
          id?: number
          parcel_id?: number
          structure_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_structures_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcel_structures_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "test_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcel_values: {
        Row: {
          app_bldg_agriculture: number | null
          app_bldg_commercial: number | null
          app_bldg_exempt: number | null
          app_bldg_residential: number | null
          app_land_agriculture: number | null
          app_land_commercial: number | null
          app_land_exempt: number | null
          app_land_residential: number | null
          app_new_const_agriculture: number | null
          app_new_const_commercial: number | null
          app_new_const_exempt: number | null
          app_new_const_residential: number | null
          app_total_value: number | null
          bldg_agriculture: number | null
          bldg_commercial: number | null
          bldg_exempt: number | null
          bldg_residential: number | null
          category: string | null
          changed_by: string | null
          date_of_assessment: string | null
          id: number
          land_agriculture: number | null
          land_commercial: number | null
          land_exempt: number | null
          land_residential: number | null
          last_changed: string | null
          new_const_agriculture: number | null
          new_const_commercial: number | null
          new_const_exempt: number | null
          new_const_residential: number | null
          parcel_id: number
          reason_for_change: string | null
          year: number
        }
        Insert: {
          app_bldg_agriculture?: number | null
          app_bldg_commercial?: number | null
          app_bldg_exempt?: number | null
          app_bldg_residential?: number | null
          app_land_agriculture?: number | null
          app_land_commercial?: number | null
          app_land_exempt?: number | null
          app_land_residential?: number | null
          app_new_const_agriculture?: number | null
          app_new_const_commercial?: number | null
          app_new_const_exempt?: number | null
          app_new_const_residential?: number | null
          app_total_value?: number | null
          bldg_agriculture?: number | null
          bldg_commercial?: number | null
          bldg_exempt?: number | null
          bldg_residential?: number | null
          category?: string | null
          changed_by?: string | null
          date_of_assessment?: string | null
          id?: number
          land_agriculture?: number | null
          land_commercial?: number | null
          land_exempt?: number | null
          land_residential?: number | null
          last_changed?: string | null
          new_const_agriculture?: number | null
          new_const_commercial?: number | null
          new_const_exempt?: number | null
          new_const_residential?: number | null
          parcel_id: number
          reason_for_change?: string | null
          year: number
        }
        Update: {
          app_bldg_agriculture?: number | null
          app_bldg_commercial?: number | null
          app_bldg_exempt?: number | null
          app_bldg_residential?: number | null
          app_land_agriculture?: number | null
          app_land_commercial?: number | null
          app_land_exempt?: number | null
          app_land_residential?: number | null
          app_new_const_agriculture?: number | null
          app_new_const_commercial?: number | null
          app_new_const_exempt?: number | null
          app_new_const_residential?: number | null
          app_total_value?: number | null
          bldg_agriculture?: number | null
          bldg_commercial?: number | null
          bldg_exempt?: number | null
          bldg_residential?: number | null
          category?: string | null
          changed_by?: string | null
          date_of_assessment?: string | null
          id?: number
          land_agriculture?: number | null
          land_commercial?: number | null
          land_exempt?: number | null
          land_residential?: number | null
          last_changed?: string | null
          new_const_agriculture?: number | null
          new_const_commercial?: number | null
          new_const_exempt?: number | null
          new_const_residential?: number | null
          parcel_id?: number
          reason_for_change?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_parcel_values_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_parcels: {
        Row: {
          block: number
          created_at: string | null
          ext: number
          id: number
          lot: number
          retired_at: string | null
        }
        Insert: {
          block: number
          created_at?: string | null
          ext?: number
          id: number
          lot: number
          retired_at?: string | null
        }
        Update: {
          block?: number
          created_at?: string | null
          ext?: number
          id?: number
          lot?: number
          retired_at?: string | null
        }
        Relationships: []
      }
      test_parcels_join: {
        Row: {
          child_parcel: number | null
          parent_parcel: number | null
        }
        Insert: {
          child_parcel?: number | null
          parent_parcel?: number | null
        }
        Update: {
          child_parcel?: number | null
          parent_parcel?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_parcels_join_child_parcel_fkey"
            columns: ["child_parcel"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_parcels_join_parent_parcel_fkey"
            columns: ["parent_parcel"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      test_sale_types: {
        Row: {
          created_at: string
          id: number
          is_valid: boolean
          retired_at: string | null
          sale_type: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_valid?: boolean
          retired_at?: string | null
          sale_type: string
        }
        Update: {
          created_at?: string
          id?: number
          is_valid?: boolean
          retired_at?: string | null
          sale_type?: string
        }
        Relationships: []
      }
      test_sales: {
        Row: {
          date_of_sale: string | null
          listing_links: Json | null
          net_selling_price: number | null
          report_timestamp: string
          sale_id: number
          sale_year: number | null
          year: number | null
        }
        Insert: {
          date_of_sale?: string | null
          listing_links?: Json | null
          net_selling_price?: number | null
          report_timestamp?: string
          sale_id: number
          sale_year?: number | null
          year?: number | null
        }
        Update: {
          date_of_sale?: string | null
          listing_links?: Json | null
          net_selling_price?: number | null
          report_timestamp?: string
          sale_id?: number
          sale_year?: number | null
          year?: number | null
        }
        Relationships: []
      }
      test_sales_sale_types: {
        Row: {
          created_at: string | null
          effective_date: string
          report_timestamp: string
          sale_id: number
          sale_type_id: number
        }
        Insert: {
          created_at?: string | null
          effective_date?: string
          report_timestamp?: string
          sale_id: number
          sale_type_id: number
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          report_timestamp?: string
          sale_id?: number
          sale_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_sales_sale_fk"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "test_sales"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "test_sales_sale_type_fk"
            columns: ["sale_type_id"]
            isOneToOne: false
            referencedRelation: "test_sale_types"
            referencedColumns: ["id"]
          },
        ]
      }
      test_structure_sections: {
        Row: {
          construction_end: string | null
          construction_start: string | null
          demolition_date: string | null
          finished_area: number | null
          floor_number: number | null
          id: number
          material: string | null
          structure_id: number
          type: string
          unfinished_area: number | null
        }
        Insert: {
          construction_end?: string | null
          construction_start?: string | null
          demolition_date?: string | null
          finished_area?: number | null
          floor_number?: number | null
          id?: number
          material?: string | null
          structure_id: number
          type: string
          unfinished_area?: number | null
        }
        Update: {
          construction_end?: string | null
          construction_start?: string | null
          demolition_date?: string | null
          finished_area?: number | null
          floor_number?: number | null
          id?: number
          material?: string | null
          structure_id?: number
          type?: string
          unfinished_area?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_structure_sections_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "test_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      test_structures: {
        Row: {
          bedrooms: number | null
          category: string | null
          full_bathrooms: number | null
          half_bathrooms: number | null
          id: number
          material: string | null
          rooms: number | null
          type: string | null
          units: number
          year_built: number | null
        }
        Insert: {
          bedrooms?: number | null
          category?: string | null
          full_bathrooms?: number | null
          half_bathrooms?: number | null
          id: number
          material?: string | null
          rooms?: number | null
          type?: string | null
          units?: number
          year_built?: number | null
        }
        Update: {
          bedrooms?: number | null
          category?: string | null
          full_bathrooms?: number | null
          half_bathrooms?: number | null
          id?: number
          material?: string | null
          rooms?: number | null
          type?: string | null
          units?: number
          year_built?: number | null
        }
        Relationships: []
      }
      tif_district_codes: {
        Row: {
          code: number
          devnet_code: number | null
          end_year: number | null
          name: string | null
          start_year: number | null
        }
        Insert: {
          code: number
          devnet_code?: number | null
          end_year?: number | null
          name?: string | null
          start_year?: number | null
        }
        Update: {
          code?: number
          devnet_code?: number | null
          end_year?: number | null
          name?: string | null
          start_year?: number | null
        }
        Relationships: []
      }
      valuation_methods_v2: {
        Row: {
          calculation_formula: string | null
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          requires_comparables: boolean
          requires_cost_data: boolean
          requires_income_data: boolean
          updated_at: string
        }
        Insert: {
          calculation_formula?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          requires_comparables?: boolean
          requires_cost_data?: boolean
          requires_income_data?: boolean
          updated_at?: string
        }
        Update: {
          calculation_formula?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          requires_comparables?: boolean
          requires_cost_data?: boolean
          requires_income_data?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      value_components_v2: {
        Row: {
          applies_to: string
          calculation_method: string | null
          component_category: string
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          applies_to: string
          calculation_method?: string | null
          component_category: string
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          applies_to?: string
          calculation_method?: string | null
          component_category?: string
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      value_type_allocations_v2: {
        Row: {
          allocation_notes: string | null
          created_at: string
          custom_value_override: number | null
          id: number
          percentage_allocation: number | null
          updated_at: string
          value_id: number
          value_table: string
          value_type_id: number
        }
        Insert: {
          allocation_notes?: string | null
          created_at?: string
          custom_value_override?: number | null
          id?: number
          percentage_allocation?: number | null
          updated_at?: string
          value_id: number
          value_table: string
          value_type_id: number
        }
        Update: {
          allocation_notes?: string | null
          created_at?: string
          custom_value_override?: number | null
          id?: number
          percentage_allocation?: number | null
          updated_at?: string
          value_id?: number
          value_table?: string
          value_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "value_type_allocations_v2_value_type_id_fkey"
            columns: ["value_type_id"]
            isOneToOne: false
            referencedRelation: "value_types_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      value_types_v2: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          tax_category: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          tax_category?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          tax_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vin_lookup_2026: {
        Row: {
          created_at: string
          description: string | null
          id: number
          model_year: string | null
          type: string | null
          updated_at: string
          vin: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          model_year?: string | null
          type?: string | null
          updated_at?: string
          vin: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          model_year?: string | null
          type?: string | null
          updated_at?: string
          vin?: string
        }
        Relationships: []
      }
      wards_detail: {
        Row: {
          avg_appraised_value_2024_commercial: number | null
          avg_appraised_value_2024_condo: number | null
          avg_appraised_value_2024_multi_family: number | null
          avg_appraised_value_2024_other: number | null
          avg_appraised_value_2024_single_family: number | null
          avg_appraised_value_2025_commercial: number | null
          avg_appraised_value_2025_condo: number | null
          avg_appraised_value_2025_multi_family: number | null
          avg_appraised_value_2025_other: number | null
          avg_appraised_value_2025_single_family: number | null
          commercial_percent_change: number | null
          condo_percent_change: number | null
          count_2024_commercial: number | null
          count_2024_condo: number | null
          count_2024_multi_family: number | null
          count_2024_other: number | null
          count_2024_single_family: number | null
          count_2025_commercial: number | null
          count_2025_condo: number | null
          count_2025_multi_family: number | null
          count_2025_other: number | null
          count_2025_single_family: number | null
          multi_family_percent_change: number | null
          other_percent_change: number | null
          single_family_percent_change: number | null
          total_appraised_value_2024_commercial: number | null
          total_appraised_value_2024_condo: number | null
          total_appraised_value_2024_multi_family: number | null
          total_appraised_value_2024_other: number | null
          total_appraised_value_2024_single_family: number | null
          total_appraised_value_2025_commercial: number | null
          total_appraised_value_2025_condo: number | null
          total_appraised_value_2025_multi_family: number | null
          total_appraised_value_2025_other: number | null
          total_appraised_value_2025_single_family: number | null
          ward: number
        }
        Insert: {
          avg_appraised_value_2024_commercial?: number | null
          avg_appraised_value_2024_condo?: number | null
          avg_appraised_value_2024_multi_family?: number | null
          avg_appraised_value_2024_other?: number | null
          avg_appraised_value_2024_single_family?: number | null
          avg_appraised_value_2025_commercial?: number | null
          avg_appraised_value_2025_condo?: number | null
          avg_appraised_value_2025_multi_family?: number | null
          avg_appraised_value_2025_other?: number | null
          avg_appraised_value_2025_single_family?: number | null
          commercial_percent_change?: number | null
          condo_percent_change?: number | null
          count_2024_commercial?: number | null
          count_2024_condo?: number | null
          count_2024_multi_family?: number | null
          count_2024_other?: number | null
          count_2024_single_family?: number | null
          count_2025_commercial?: number | null
          count_2025_condo?: number | null
          count_2025_multi_family?: number | null
          count_2025_other?: number | null
          count_2025_single_family?: number | null
          multi_family_percent_change?: number | null
          other_percent_change?: number | null
          single_family_percent_change?: number | null
          total_appraised_value_2024_commercial?: number | null
          total_appraised_value_2024_condo?: number | null
          total_appraised_value_2024_multi_family?: number | null
          total_appraised_value_2024_other?: number | null
          total_appraised_value_2024_single_family?: number | null
          total_appraised_value_2025_commercial?: number | null
          total_appraised_value_2025_condo?: number | null
          total_appraised_value_2025_multi_family?: number | null
          total_appraised_value_2025_other?: number | null
          total_appraised_value_2025_single_family?: number | null
          ward: number
        }
        Update: {
          avg_appraised_value_2024_commercial?: number | null
          avg_appraised_value_2024_condo?: number | null
          avg_appraised_value_2024_multi_family?: number | null
          avg_appraised_value_2024_other?: number | null
          avg_appraised_value_2024_single_family?: number | null
          avg_appraised_value_2025_commercial?: number | null
          avg_appraised_value_2025_condo?: number | null
          avg_appraised_value_2025_multi_family?: number | null
          avg_appraised_value_2025_other?: number | null
          avg_appraised_value_2025_single_family?: number | null
          commercial_percent_change?: number | null
          condo_percent_change?: number | null
          count_2024_commercial?: number | null
          count_2024_condo?: number | null
          count_2024_multi_family?: number | null
          count_2024_other?: number | null
          count_2024_single_family?: number | null
          count_2025_commercial?: number | null
          count_2025_condo?: number | null
          count_2025_multi_family?: number | null
          count_2025_other?: number | null
          count_2025_single_family?: number | null
          multi_family_percent_change?: number | null
          other_percent_change?: number | null
          single_family_percent_change?: number | null
          total_appraised_value_2024_commercial?: number | null
          total_appraised_value_2024_condo?: number | null
          total_appraised_value_2024_multi_family?: number | null
          total_appraised_value_2024_other?: number | null
          total_appraised_value_2024_single_family?: number | null
          total_appraised_value_2025_commercial?: number | null
          total_appraised_value_2025_condo?: number | null
          total_appraised_value_2025_multi_family?: number | null
          total_appraised_value_2025_other?: number | null
          total_appraised_value_2025_single_family?: number | null
          ward?: number
        }
        Relationships: []
      }
      wards_summary: {
        Row: {
          other_2024: number | null
          other_2025: number | null
          residential_2024: number | null
          residential_2025: number | null
          total_2024: number | null
          total_2025: number | null
          total_percent_change: number | null
          ward: number
        }
        Insert: {
          other_2024?: number | null
          other_2025?: number | null
          residential_2024?: number | null
          residential_2025?: number | null
          total_2024?: number | null
          total_2025?: number | null
          total_percent_change?: number | null
          ward: number
        }
        Update: {
          other_2024?: number | null
          other_2025?: number | null
          residential_2024?: number | null
          residential_2025?: number | null
          total_2024?: number | null
          total_2025?: number | null
          total_percent_change?: number | null
          ward?: number
        }
        Relationships: []
      }
    }
    Views: {
      active_reviews_v2: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          days_until_due: number | null
          due_date: string | null
          id: number | null
          kind: Database["public"]["Enums"]["review_kind_v2"] | null
          needs_approval: boolean | null
          status_name: string | null
          title: string | null
        }
        Relationships: []
      }
      mv_structure_area_totals: {
        Row: {
          finished_area_total: number | null
          structure_id: number | null
          unfinished_area_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_structure_sections_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "test_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_structure_section_totals: {
        Row: {
          addition_finished_total: number | null
          addition_unfinished_total: number | null
          attic_finished_total: number | null
          attic_unfinished_total: number | null
          basement_finished_total: number | null
          basement_unfinished_total: number | null
          crawl_finished_total: number | null
          crawl_unfinished_total: number | null
          floor_finished_total: number | null
          floor_unfinished_total: number | null
          structure_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_structure_sections_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "test_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_overview_v2: {
        Row: {
          block: number | null
          building_count: number | null
          current_review_kind:
            | Database["public"]["Enums"]["review_kind_v2"]
            | null
          current_review_status: string | null
          ext: number | null
          id: number | null
          land_count: number | null
          last_sale_date: string | null
          lot: number | null
          neighborhood: string | null
          owner_name: string | null
          parcel_number: string | null
          sale_count: number | null
          site_address: string | null
          tax_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_value_calculation_v2: {
        Args: {
          p_activate?: boolean
          p_approval_notes?: string
          p_approve?: boolean
          p_entity_type: string
          p_value_ids: number[]
        }
        Returns: undefined
      }
      assign_devnet_review: {
        Args: {
          p_assigned_by_employee_id?: number
          p_employee_id: number
          p_notes?: string
          p_review_id: number
        }
        Returns: boolean
      }
      auto_assign_field_reviews: { Args: never; Returns: number }
      bulk_assign_field_review_employees: {
        Args: {
          p_employee_ids: number[]
          p_review_ids: number[]
          p_valid?: unknown
        }
        Returns: number
      }
      bulk_create_field_review_statuses: {
        Args: {
          p_description?: string
          p_review_ids: number[]
          p_status_id: number
        }
        Returns: number
      }
      check_review_data_completeness: {
        Args: { p_review_id: number }
        Returns: Json
      }
      compare_parcel_to_comp_sales: {
        Args: { p_comp_sale_ids: number[]; p_subject_parcel_id: number }
        Returns: {
          comp_avg_condition: number
          comp_avg_year_built: number
          comp_block: number
          comp_ext: number
          comp_land_use: string
          comp_lat: number
          comp_lon: number
          comp_lot: string
          comp_parcel_id: number
          comp_sale_date: string
          comp_sale_id: number
          comp_sale_price: number
          comp_sale_type: string
          comp_structure_count: number
          comp_total_finished_area: number
          comp_total_unfinished_area: number
          diff_avg_condition: number
          diff_avg_year_built: number
          diff_structure_count: number
          diff_total_finished_area: number
          diff_total_unfinished_area: number
          distance_miles: number
          same_land_use: boolean
          subject_avg_condition: number
          subject_avg_year_built: number
          subject_block: number
          subject_ext: number
          subject_land_use: string
          subject_lat: number
          subject_lon: number
          subject_lot: string
          subject_parcel_id: number
          subject_structure_count: number
          subject_total_finished_area: number
          subject_total_unfinished_area: number
        }[]
      }
      create_devnet_review: {
        Args: {
          p_assigned_to_employee_id?: number
          p_data?: Json
          p_description?: string
          p_entity_id: number
          p_entity_type: string
          p_kind: Database["public"]["Enums"]["devnet_review_kind"]
          p_title?: string
        }
        Returns: number
      }
      create_field_review: {
        Args: {
          p_due_date: string
          p_initial_note: string
          p_initial_status: string
          p_parcel_id: number
          p_type_id: number
        }
        Returns: {
          note_id: number
          review_created_at: string
          review_id: number
          status_id: number
        }[]
      }
      create_field_reviews_bulk: {
        Args: {
          p_due_date: string
          p_initial_status_id: number
          p_note?: string
          p_parcel_ids: number[]
          p_type_id: number
        }
        Returns: {
          parcel_id: number
          review_id: number
        }[]
      }
      create_file_and_field_review_image: {
        Args: {
          p_bucket_name: string
          p_caption: string
          p_extension: string
          p_height?: number
          p_mime_type: string
          p_original_name: string
          p_path: string
          p_review_id: number
          p_size_bytes: number
          p_sort_order?: number
          p_width?: number
        }
        Returns: {
          file_id: number
          image_id: number
        }[]
      }
      delete_field_review_images_and_files: {
        Args: { p_image_ids: number[] }
        Returns: {
          bucket_name: string
          deleted_file_id: number
          deleted_image_id: number
          path: string
        }[]
      }
      delete_parcel_image: { Args: { p_image_url: string }; Returns: undefined }
      delete_parcel_images: {
        Args: { p_image_urls: string[] }
        Returns: undefined
      }
      detect_value_triggering_changes_v2: {
        Args: { p_entity_type: string; p_new_data: Json; p_old_data: Json }
        Returns: Json
      }
      enforce_review_editable: {
        Args: { p_review_id: number }
        Returns: undefined
      }
      find_comps: {
        Args: {
          p_k?: number
          p_living_area_band?: number
          p_max_distance_miles?: number
          p_max_living_area?: number
          p_min_living_area?: number
          p_parcel_ids?: number[]
          p_require_same_land_use?: boolean
          p_weights?: Json
          p_years?: number
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          comp_block: number
          comp_ext: number
          comp_lot: string
          distance_miles: number
          district: string
          gower_distance: number
          house_number: string
          land_use: string
          lat: number
          lon: number
          parcel_id: number
          postcode: string
          price_per_sqft: number
          sale_date: string
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          subject_features: Json
          subject_parcel_id: number
          total_finished_area: number
          total_unfinished_area: number
        }[]
      }
      get_buildings_as_of_date_v2: {
        Args: { p_as_of_date: string; p_parcel_id: number }
        Returns: {
          bathrooms: number
          bedrooms: number
          building_data: Json
          building_id: number
          building_type: string
          condition_rating: number
          finished_area: number
          snapshot_date: string
          square_footage: number
          year_built: number
        }[]
      }
      get_category_sums_asof: {
        Args: { p_as_of_date?: string }
        Returns: {
          assessed_bldg_count: number
          assessed_bldg_sum: number
          assessed_land_count: number
          assessed_land_sum: number
          assessed_total_count: number
          assessed_total_sum: number
          category: string
          new_const_count: number
          new_const_sum: number
          taxable_total_count: number
          taxable_total_sum: number
        }[]
      }
      get_category_totals_asof: {
        Args: { p_as_of_date?: string }
        Returns: {
          assessed_total: number
          category: string
          taxable_total: number
        }[]
      }
      get_complete_parcel_as_of_date_v2: {
        Args: { p_as_of_date: string; p_parcel_id: number }
        Returns: Json
      }
      get_devnet_filter_options: { Args: never; Returns: Json }
      get_devnet_review_counts: {
        Args: { p_filters?: Json }
        Returns: {
          kind: string
          review_count: number
          status_name: string
          status_slug: string
        }[]
      }
      get_employee_permissions_v2: {
        Args: { p_user_id: string }
        Returns: {
          can_approve: boolean
          employee_id: number
          full_name: string
        }[]
      }
      get_field_reviews_with_parcel_data: {
        Args: { p_as_of_date?: string }
        Returns: {
          address_city: string
          address_formatted: string
          address_lat: number
          address_line1: string
          address_lon: number
          address_place_id: string
          address_postcode: string
          address_state: string
          assessor_neighborhood: number
          assessor_neighborhood_id: number
          block: number
          cda_neighborhood: string
          cda_neighborhood_id: number
          ext: number
          field_review_id: number
          latest_status_hist_id: number
          latest_status_id: number
          latest_status_name: string
          latest_status_set_at: string
          lot: number
          notes: Json
          parcel_created_at: string
          parcel_id: number
          parcel_retired_at: string
          pf_abatement: Json
          pf_avg_condition: number
          pf_avg_year_built: number
          pf_current_value: number
          pf_date_of_assessment: string
          pf_district: string
          pf_house_number: string
          pf_land_area: number
          pf_land_to_building_area_ratio: number
          pf_land_use: string
          pf_lat: number
          pf_lon: number
          pf_neighborhoods_at_as_of: Json
          pf_postcode: string
          pf_property_class_id: number
          pf_property_class_name: string
          pf_street: string
          pf_structure_count: number
          pf_structures: Json
          pf_tax_status_id: number
          pf_tax_status_name: string
          pf_total_finished_area: number
          pf_total_unfinished_area: number
          pf_total_units: number
          pf_value_row_id: number
          pf_value_year: number
          pf_values_per_sqft_building_total: number
          pf_values_per_sqft_finished: number
          pf_values_per_sqft_land: number
          pf_values_per_unit: number
          review_created_at: string
          review_due_date: string
          review_type_id: number
          review_type_name: string
          review_type_slug: string
          site_visited_at: string
          status_history: Json
        }[]
      }
      get_field_reviews_with_parcel_details: {
        Args: never
        Returns: {
          address_city: string
          address_formatted: string
          address_lat: number
          address_line1: string
          address_lon: number
          address_place_id: string
          address_postcode: string
          address_state: string
          assessor_neighborhood: number
          assessor_neighborhood_id: number
          block: number
          cda_neighborhood: string
          cda_neighborhood_id: number
          ext: number
          field_review_id: number
          latest_status_hist_id: number
          latest_status_id: number
          latest_status_name: string
          latest_status_set_at: string
          lot: number
          parcel_created_at: string
          parcel_id: number
          parcel_retired_at: string
          review_created_at: string
          review_due_date: string
          review_type_id: number
          review_type_name: string
          review_type_slug: string
          site_visited_at: string
        }[]
      }
      get_field_reviews_with_parcel_details_v2: {
        Args: { p_neighborhood_ids?: number[] }
        Returns: {
          address_city: string
          address_formatted: string
          address_house_number: string
          address_lat: number
          address_line1: string
          address_lon: number
          address_place_id: string
          address_postcode: string
          address_state: string
          address_street: string
          assessor_neighborhood: number
          assessor_neighborhood_id: number
          block: number
          cda_neighborhood: string
          cda_neighborhood_id: number
          current_land_use: number
          current_structures: Json
          ext: number
          field_review_id: number
          latest_status_hist_id: number
          latest_status_id: number
          latest_status_name: string
          latest_status_set_at: string
          lot: number
          notes: Json
          parcel_created_at: string
          parcel_id: number
          parcel_retired_at: string
          review_created_at: string
          review_due_date: string
          review_type_id: number
          review_type_name: string
          review_type_slug: string
          site_visited_at: string
          status_history: Json
        }[]
      }
      get_field_reviews_with_parcel_details_v3: {
        Args: { p_employee_id?: number; p_neighborhood_ids?: number[] }
        Returns: {
          address_city: string
          address_formatted: string
          address_lat: number
          address_line1: string
          address_lon: number
          address_place_id: string
          address_postcode: string
          address_state: string
          assessor_neighborhood: number
          assessor_neighborhood_id: number
          assignments: Json
          block: number
          cda_neighborhood: string
          cda_neighborhood_id: number
          current_land_use: number
          current_structures: Json
          ext: number
          field_review_id: number
          latest_status_hist_id: number
          latest_status_id: number
          latest_status_name: string
          latest_status_set_at: string
          lot: number
          notes: Json
          parcel_created_at: string
          parcel_id: number
          parcel_retired_at: string
          review_created_at: string
          review_due_date: string
          review_type_id: number
          review_type_name: string
          review_type_slug: string
          site_visited_at: string
          status_history: Json
        }[]
      }
      get_field_reviews_with_parcel_details_v4: {
        Args: { p_employee_id?: number; p_neighborhood_ids?: number[] }
        Returns: {
          address_city: string
          address_formatted: string
          address_lat: number
          address_line1: string
          address_lon: number
          address_place_id: string
          address_postcode: string
          address_state: string
          assessor_neighborhood: number
          assessor_neighborhood_id: number
          assignments: Json
          block: number
          cda_neighborhood: string
          cda_neighborhood_id: number
          current_land_use: number
          current_structures: Json
          ext: number
          field_review_id: number
          latest_status_hist_id: number
          latest_status_id: number
          latest_status_name: string
          latest_status_set_at: string
          lot: number
          notes: Json
          parcel_created_at: string
          parcel_id: number
          parcel_retired_at: string
          parcel_sales: Json
          parcels: Json
          review_created_at: string
          review_due_date: string
          review_sales: Json
          review_type_id: number
          review_type_name: string
          review_type_slug: string
          site_visited_at: string
          status_history: Json
        }[]
      }
      get_land_as_of_date_v2: {
        Args: { p_as_of_date: string; p_parcel_id: number }
        Returns: {
          area_sqft: number
          depth_ft: number
          frontage_ft: number
          land_data: Json
          land_id: number
          land_use: string
          snapshot_date: string
          topography: string
        }[]
      }
      get_parcel_as_of_date_v2: {
        Args: { p_as_of_date: string; p_parcel_id: number }
        Returns: {
          block: number
          ext: number
          lot: number
          neighborhood: string
          owner_address: string
          owner_name: string
          parcel_data: Json
          parcel_id: number
          parcel_number: string
          property_class: string
          site_address: string
          snapshot_date: string
          tax_status: string
        }[]
      }
      get_parcel_current_values_v2: {
        Args: { p_parcel_id: number }
        Returns: {
          approved_date: string
          calculation_date: string
          entity_id: number
          entity_type: string
          method_name: string
          total_value: number
          value_type_name: string
        }[]
      }
      get_parcel_features: {
        Args: {
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      get_parcel_snapshots_asof: {
        Args: { p_asof_date: string; p_parcel_ids: number[] }
        Returns: {
          parcel_id: number
          snapshot: Json
        }[]
      }
      get_parcel_summary_v2: {
        Args: { p_parcel_id: number }
        Returns: {
          building_count: number
          current_review_kind: Database["public"]["Enums"]["review_kind_v2"]
          current_review_status: string
          land_count: number
          last_sale_date: string
          last_sale_price: number
          owner_name: string
          parcel_id: number
          parcel_number: string
          site_address: string
        }[]
      }
      get_parcel_timeline_v2: {
        Args: {
          p_end_date?: string
          p_parcel_id: number
          p_start_date?: string
        }
        Returns: {
          changes: Json
          owner_name: string
          property_class: string
          review_id: number
          snapshot_date: string
          tax_status: string
        }[]
      }
      get_ratios: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          land_use_asof: string
          land_use_sale: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_sale: Json
          parcel_id: number
          postcode: string
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          structures: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
        }[]
      }
      get_ratios_v6: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          land_use_asof: string
          land_use_sale: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_sale: Json
          parcel_id: number
          postcode: string
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          structures: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
        }[]
      }
      get_sale_features_v1: {
        Args: {
          p_abatement_programs?: number[]
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_review_status_ids?: number[]
          p_review_type_ids?: number[]
          p_sale_end_date?: string
          p_sale_price_max?: number
          p_sale_price_min?: number
          p_sale_start_date?: string
          p_sale_type_ids?: number[]
          p_sale_valid_only?: boolean
          p_tax_status_ids?: number[]
        }
        Returns: {
          abatement_at_asof: Json
          abatement_at_sale: Json
          avg_condition_at_asof: number
          avg_condition_at_sale: number
          avg_year_built_at_asof: number
          avg_year_built_at_sale: number
          block: number
          current_value_at_asof: number
          current_value_at_sale: number
          date_of_assessment_at_asof: string
          date_of_assessment_at_sale: string
          district_at_asof: string
          district_at_sale: string
          ext: number
          field_reviews_at_asof: Json
          field_reviews_at_sale: Json
          house_number_at_asof: string
          house_number_at_sale: string
          is_valid: boolean
          land_area_at_asof: number
          land_area_at_sale: number
          land_to_building_area_ratio_at_asof: number
          land_to_building_area_ratio_at_sale: number
          land_use_at_asof: string
          land_use_at_sale: string
          lat_at_asof: number
          lat_at_sale: number
          lon_at_asof: number
          lon_at_sale: number
          lot: string
          neighborhoods_at_asof: Json
          neighborhoods_at_sale: Json
          parcel_id: number
          postcode_at_asof: string
          postcode_at_sale: string
          price_per_sqft_building_total_at_asof: number
          price_per_sqft_building_total_at_sale: number
          price_per_sqft_finished_at_asof: number
          price_per_sqft_finished_at_sale: number
          price_per_sqft_land_at_asof: number
          price_per_sqft_land_at_sale: number
          price_per_unit_at_asof: number
          price_per_unit_at_sale: number
          property_class_id_at_asof: number
          property_class_id_at_sale: number
          property_class_name_at_asof: string
          property_class_name_at_sale: string
          ratio_at_asof: number
          ratio_at_sale: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type_id: number
          sale_type_name: string
          street_at_asof: string
          street_at_sale: string
          structure_count_at_asof: number
          structure_count_at_sale: number
          structures_at_asof: Json
          structures_at_sale: Json
          tax_status_id_at_asof: number
          tax_status_id_at_sale: number
          tax_status_name_at_asof: string
          tax_status_name_at_sale: string
          total_finished_area_at_asof: number
          total_finished_area_at_sale: number
          total_unfinished_area_at_asof: number
          total_unfinished_area_at_sale: number
          total_units_at_asof: number
          total_units_at_sale: number
          value_row_id_at_asof: number
          value_row_id_at_sale: number
          value_year_at_asof: number
          value_year_at_sale: number
          values_per_sqft_building_total_at_asof: number
          values_per_sqft_building_total_at_sale: number
          values_per_sqft_finished_at_asof: number
          values_per_sqft_finished_at_sale: number
          values_per_sqft_land_at_asof: number
          values_per_sqft_land_at_sale: number
          values_per_unit_at_asof: number
          values_per_unit_at_sale: number
        }[]
      }
      get_sale_features_v2: {
        Args: {
          p_abatement_programs?: number[]
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_review_status_ids?: number[]
          p_review_type_ids?: number[]
          p_sale_end_date?: string
          p_sale_price_max?: number
          p_sale_price_min?: number
          p_sale_start_date?: string
          p_sale_type_ids?: number[]
          p_sale_valid_only?: boolean
          p_tax_status_ids?: number[]
        }
        Returns: {
          abatement_at_sale: Json
          avg_condition_at_sale: number
          avg_year_built_at_sale: number
          block: number
          current_value_at_sale: number
          date_of_assessment_at_sale: string
          district_at_sale: string
          ext: number
          field_reviews_at_sale: Json
          house_number_at_sale: string
          is_valid: boolean
          land_area_at_sale: number
          land_to_building_area_ratio_at_sale: number
          land_use_at_sale: string
          lat_at_sale: number
          lon_at_sale: number
          lot: string
          neighborhoods_at_sale: Json
          parcel_id: number
          postcode_at_sale: string
          price_per_sqft_building_total_at_sale: number
          price_per_sqft_finished_at_sale: number
          price_per_sqft_land_at_sale: number
          price_per_unit_at_sale: number
          property_class_id_at_sale: number
          property_class_name_at_sale: string
          ratio_at_sale: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type_id: number
          sale_type_name: string
          street_at_sale: string
          structure_count_at_sale: number
          structures_at_sale: Json
          tax_status_id_at_sale: number
          tax_status_name_at_sale: string
          total_finished_area_at_sale: number
          total_unfinished_area_at_sale: number
          total_units_at_sale: number
          value_row_id_at_sale: number
          value_year_at_sale: number
          values_per_sqft_building_total_at_sale: number
          values_per_sqft_finished_at_sale: number
          values_per_sqft_land_at_sale: number
          values_per_unit_at_sale: number
        }[]
      }
      get_sale_features_v4: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          land_use_asof: string
          land_use_sale: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_sale: Json
          parcel_id: number
          postcode: string
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
        }[]
      }
      get_sale_features_v5: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          land_use_asof: string
          land_use_sale: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_sale: Json
          parcel_features: Json
          parcel_id: number
          postcode: string
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_parcel_count: number
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
        }[]
      }
      get_sale_features_v6: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          parcel_features: Json
          parcel_id: number
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_parcel_count: number
          sale_price: number
          sale_type: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
        }[]
      }
      get_sale_parcel_aggregates_v12: {
        Args: {
          p_avg_condition_max?: number
          p_avg_condition_min?: number
          p_end_date?: string
          p_finished_area_max?: number
          p_finished_area_min?: number
          p_land_area_max?: number
          p_land_area_min?: number
          p_land_uses?: number[]
          p_neighborhood_ids?: number[]
          p_sale_price_max?: number
          p_sale_price_min?: number
          p_sale_type_ids?: number[]
          p_section_materials_any?: string[]
          p_start_date?: string
          p_upper_floor_same_materials?: string[]
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          parcel_features: Json
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          sale_date: string
          sale_id: number
          sale_parcel_count: number
          sale_price: number
          sale_type: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
        }[]
      }
      get_sale_parcel_aggregates_v13: {
        Args: {
          p_avg_condition_max?: number
          p_avg_condition_min?: number
          p_end_date?: string
          p_finished_area_max?: number
          p_finished_area_min?: number
          p_has_basement?: boolean
          p_land_area_max?: number
          p_land_area_min?: number
          p_land_uses?: number[]
          p_neighborhood_ids?: number[]
          p_sale_price_max?: number
          p_sale_price_min?: number
          p_sale_type_ids?: number[]
          p_section_materials_any?: string[]
          p_start_date?: string
          p_stories_max?: number
          p_stories_min?: number
          p_upper_floor_same_materials?: string[]
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          parcel_features: Json
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          sale_date: string
          sale_id: number
          sale_parcel_count: number
          sale_price: number
          sale_type: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
        }[]
      }
      get_single_parcel_sale_ratios_v1: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          current_value: number
          date_of_assessment: string
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          parcel_features: Json
          parcel_id: number
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_parcel_count: number
          sale_price: number
          sale_type: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
        }[]
      }
      get_sold_parcel_features_multi: {
        Args: {
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          is_valid: boolean
          land_area_total: number
          land_to_building_area_ratio: number
          parcel_count: number
          parcels: Json
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
        }[]
      }
      get_value_stats_asof: {
        Args: { p_as_of_date?: string }
        Returns: {
          column_name: string
          count_nonzero: number
          mean: number
          median: number
          sum_nonzero: number
        }[]
      }
      insert_parcel_image: {
        Args: { p_image_url: string; p_parcel_id: number }
        Returns: number
      }
      load_parcel_site_addresses: { Args: never; Returns: undefined }
      mark_copied_to_devnet: {
        Args: {
          p_copied_by_employee_id: number
          p_notes?: string
          p_review_id: number
        }
        Returns: boolean
      }
      mark_data_collected: {
        Args: {
          p_collected_by_employee_id: number
          p_field_data: Json
          p_notes?: string
          p_review_id: number
        }
        Returns: boolean
      }
      mass_assign_devnet_reviews: {
        Args: {
          p_assigned_by_employee_id?: number
          p_due_date?: string
          p_employee_id: number
          p_review_ids: number[]
        }
        Returns: boolean
      }
      mass_assign_reviews_v2: {
        Args: { p_employee_id: number; p_review_ids: number[] }
        Returns: boolean
      }
      mass_complete_devnet_assignments: {
        Args: {
          p_assignment_ids: number[]
          p_completed_by_employee_id: number
          p_completion_notes?: string
        }
        Returns: number
      }
      mass_create_devnet_assignments: {
        Args: {
          p_assigned_by_employee_id?: number
          p_due_date?: string
          p_employee_id: number
          p_notes?: string
          p_review_ids: number[]
          p_status_ids: number[]
        }
        Returns: number
      }
      mass_create_devnet_reviews: {
        Args: { p_review_configs: Json }
        Returns: number[]
      }
      mass_create_reviews_v2: {
        Args: {
          p_data?: Json
          p_due_date?: string
          p_kind: Database["public"]["Enums"]["review_kind_v2"]
          p_parcel_ids: number[]
          p_title?: string
        }
        Returns: number[]
      }
      mass_reassign_devnet_reviews: {
        Args: {
          p_assigned_by_employee_id?: number
          p_due_date?: string
          p_from_employee_id: number
          p_notes?: string
          p_review_ids: number[]
          p_to_employee_id: number
        }
        Returns: number
      }
      mass_update_assignment_due_dates: {
        Args: {
          p_assignment_ids: number[]
          p_new_due_date: string
          p_notes?: string
          p_updated_by_employee_id?: number
        }
        Returns: number
      }
      mass_update_devnet_review_status: {
        Args: {
          p_changed_by_employee_id?: number
          p_new_status_slug: string
          p_notes?: string
          p_review_ids: number[]
        }
        Returns: boolean
      }
      mass_update_review_status_v2: {
        Args: { p_note?: string; p_review_ids: number[]; p_status_slug: string }
        Returns: boolean
      }
      publish_review: { Args: { p_review_id: number }; Returns: undefined }
      schedule_value_recalculation_v2: {
        Args: {
          p_assessment_cycle_id: number
          p_entity_id: number
          p_entity_type: string
          p_scheduled_date?: string
          p_trigger_type?: string
          p_triggered_by_changes?: Json
        }
        Returns: number[]
      }
      score_sales_with_model_with_coeff: {
        Args: { p_limit?: number; p_parcel_ids?: number[]; p_run_id?: number }
        Returns: {
          addition_finished_total: number
          addition_unfinished_total: number
          attached_garage_area: number
          attic_finished_total: number
          attic_unfinished_total: number
          basement_finished_total: number
          basement_garage_area: number
          basement_unfinished_total: number
          bedrooms: number
          block: number
          building_count_total: number
          carport_area: number
          city: string
          condition_at_sale: string
          crawl_finished_total: number
          crawl_unfinished_total: number
          detached_garage_area: number
          district: string
          ext: number
          feature_breakdown: Json
          floor_finished_total: number
          floor_unfinished_total: number
          full_bathrooms: number
          half_bathrooms: number
          house_number: string
          land_use: string
          lat: number
          living_area_total: number
          lon: number
          lot: string
          material: string
          material_finished_sqft: Json
          material_total_sqft: Json
          material_unfinished_sqft: Json
          parcel_id: number
          postcode: string
          rooms: number
          state: string
          street: string
          structure_id: number
          y_pred: number
          year_built: number
        }[]
      }
      search_all_parcels: {
        Args: { search_term: string }
        Returns: {
          created_at: string | null
          fts: unknown
          house_number: string | null
          id: number
          name: string | null
          parcel_number: string | null
          retired_at: string | null
          street_name: string | null
          street_suffix: string | null
          zip_code: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "search_table_2"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      search_devnet_reviews: {
        Args: {
          p_active_only?: boolean
          p_assigned_to_devnet_employees_id?: number
          p_completed_only?: boolean
          p_created_after?: string
          p_created_before?: string
          p_data_status?: string
          p_devnet_review_statuses_ids?: string
          p_due_after?: string
          p_due_before?: string
          p_entity_type?: string
          p_kind?: string
          p_overdue_only?: boolean
          p_priority?: string
          p_requires_field_review?: boolean
          p_search_text?: string
        }
        Returns: {
          assigned_to_email: string
          assigned_to_name: string
          assigned_to_role: string
          completed_at: string
          created_at: string
          data_status: string
          days_until_due: number
          description: string
          due_date: string
          entity_id: number
          entity_type: string
          id: number
          kind: string
          neighborhood_name: string
          parcel_address: string
          parcel_data: Json
          parcel_number: string
          priority: string
          requires_field_review: boolean
          sale_date: string
          sale_parcels_data: Json
          sale_price: number
          sales_data: Json
          status_name: string
          status_slug: string
          title: string
          updated_at: string
        }[]
      }
      search_parcel_rollup_asof_v1: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_limit?: number
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhood: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v10: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_structure_count?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_max_value_per_livable_sqft?: number
          p_max_value_per_total_sqft?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_structure_count?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_min_value_per_livable_sqft?: number
          p_min_value_per_total_sqft?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          address_housenumber: string
          address_street: string
          block: number
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_count: number
          structure_snapshot: Json
          total_structure_livable_sqft: number
          total_structure_sqft: number
          total_value: number
          value_per_livable_sqft: number
          value_per_total_sqft: number
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v11: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_best_use_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_structure_count?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_max_value_per_livable_sqft?: number
          p_max_value_per_total_sqft?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_structure_count?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_min_value_per_livable_sqft?: number
          p_min_value_per_total_sqft?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          address_housenumber: string
          address_street: string
          best_use_ids: number[]
          best_use_names: string[]
          block: number
          condition_ids: number[]
          condition_names: string[]
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_count: number
          structure_snapshot: Json
          total_structure_livable_sqft: number
          total_structure_sqft: number
          total_value: number
          value_per_livable_sqft: number
          value_per_total_sqft: number
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v12: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_best_use_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_structure_count?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_max_value_per_livable_sqft?: number
          p_max_value_per_total_sqft?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_structure_count?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_min_value_per_livable_sqft?: number
          p_min_value_per_total_sqft?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          address_housenumber: string
          address_street: string
          block: number
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_count: number
          structure_snapshot: Json
          total_structure_livable_sqft: number
          total_structure_sqft: number
          total_value: number
          value_per_livable_sqft: number
          value_per_total_sqft: number
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v2: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_limit?: number
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhoods: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v3: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_limit?: number
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhoods: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v4: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_limit?: number
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhoods: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v5: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v6: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v7: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          block: number
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_snapshot: Json
          value_snapshot: Json
        }[]
      }
      search_parcel_rollup_asof_v9: {
        Args: {
          p_as_of_date?: string
          p_base_material_ids?: number[]
          p_condition_ids?: number[]
          p_max_impr_value?: number
          p_max_land_value?: number
          p_max_livable_sqft?: number
          p_max_stories?: number
          p_max_total_area_sqft?: number
          p_max_total_value?: number
          p_min_impr_value?: number
          p_min_land_value?: number
          p_min_livable_sqft?: number
          p_min_stories?: number
          p_min_total_area_sqft?: number
          p_min_total_value?: number
          p_neighborhood_ids?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_year?: number
        }
        Returns: {
          address: Json
          address_housenumber: string
          address_street: string
          block: number
          ext: number
          lot: number
          neighborhoods_at_as_of: Json
          parcel_id: number
          property_class: Json
          structure_count: number
          structure_snapshot: Json
          total_structure_livable_sqft: number
          total_structure_sqft: number
          total_value: number
          value_per_livable_sqft: number
          value_per_total_sqft: number
          value_snapshot: Json
        }[]
      }
      search_parcel_snapshots_asof: {
        Args: {
          p_asof_date: string
          p_cursor?: Json
          p_filters?: Json
          p_limit?: number
          p_sort_dir?: string
          p_sort_key?: string
        }
        Returns: {
          parcel_id: number
          snapshot: Json
          total_count: number
        }[]
      }
      search_parcels_by_prefix: {
        Args: { active?: boolean; prefix: string }
        Returns: {
          addresses: Json[]
          names: string[]
          parcel_number: string
          retired_at: string
        }[]
      }
      search_parcels_v2: {
        Args: {
          p_as_of_date?: string
          p_filters?: Json
          p_limit?: number
          p_offset?: number
          p_sort_by?: string
          p_sort_direction?: string
        }
        Returns: {
          block: number
          building_summary: Json
          current_building_value: number
          current_land_value: number
          ext: number
          lot: number
          neighborhood_name: string
          owner_name: string
          parcel_data: Json
          parcel_id: number
          parcel_number: string
          property_class: string
          site_address: string
          tax_status_name: string
          total_buildings: number
          total_count: number
          total_property_value: number
          value_summary: Json
        }[]
      }
      search_sold_parcels_by_address_prefix: {
        Args: { p_prefix: string; p_valid_only?: boolean }
        Returns: {
          address_line1: string
          block: number
          ext: number
          lot: string
          parcel_id: number
          postcode: string
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
        }[]
      }
      search_vin_with_guide_matches: {
        Args: { p_max_guide_results?: number; p_vin: string }
        Returns: {
          guide_results: Json
          model_year: string
          type: string
          vin: string
          vin_description: string
          vin_id: number
        }[]
      }
      set_review_data_requirements: {
        Args: {
          p_completion_criteria?: Json
          p_required_fields: Json
          p_review_id: number
          p_validation_rules?: Json
        }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      test_get_parcel_features: {
        Args: {
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          structures_summary: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      test_get_sold_parcel_ratios_features: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: number[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          is_valid: boolean
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          land_use_asof: string
          land_use_sale: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_sale: Json
          parcel_id: number
          postcode: string
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          price_per_sqft_land: number
          price_per_unit: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
        }[]
      }
      testing_get_parcel_features: {
        Args: {
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      testing_get_parcel_features_v2: {
        Args: {
          p_abatement_programs?: number[]
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
        }
        Returns: {
          abatement: Json
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      testing_get_parcel_features_v3: {
        Args: {
          p_abatement_programs?: number[]
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_review_status_ids?: number[]
          p_review_type_ids?: number[]
        }
        Returns: {
          abatement: Json
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          field_reviews: Json
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      testing_get_parcel_features_v3_simple: {
        Args: {
          p_abatement_programs?: number[]
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_review_status_ids?: number[]
          p_review_type_ids?: number[]
        }
        Returns: {
          abatements_json: Json
          block: number
          ext: number
          field_reviews_json: Json
          geo_json: Json
          land_areas_json: Json
          land_uses_json: Json
          lot: string
          neighborhoods_json: Json
          parcel_id: number
          retired_at: string
          structures_json: Json
          values_json: Json
        }[]
      }
      testing_get_parcel_features_v4: {
        Args: {
          p_abatement_programs?: number[]
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_review_status_ids?: number[]
          p_review_type_ids?: number[]
          p_tax_status_ids?: number[]
        }
        Returns: {
          abatement: Json
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          field_reviews: Json
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          property_class_id: number
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          tax_status_id: number
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      testing_get_parcel_features_v5: {
        Args: {
          p_abatement_programs?: number[]
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_review_status_ids?: number[]
          p_review_type_ids?: number[]
          p_tax_status_ids?: number[]
        }
        Returns: {
          abatement: Json
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          field_reviews: Json
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          property_class_id: number
          property_class_name: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          tax_status_id: number
          tax_status_name: string
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      testing_get_parcel_features_v6: {
        Args: {
          p_abatement_programs?: number[]
          p_as_of_date?: string
          p_exclude_retired_parcels?: boolean
          p_is_abated?: boolean
          p_land_uses?: number[]
          p_neighborhoods?: number[]
          p_parcel_ids?: number[]
          p_property_class_ids?: number[]
          p_tax_status_ids?: number[]
        }
        Returns: {
          abatement: Json
          avg_condition: number
          avg_year_built: number
          block: number
          current_value: number
          date_of_assessment: string
          district: string
          ext: number
          house_number: string
          land_area: number
          land_to_building_area_ratio: number
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods_at_as_of: Json
          parcel_id: number
          postcode: string
          property_class_id: number
          property_class_name: string
          retired_at: string
          street: string
          structure_count: number
          structures: Json
          tax_status_id: number
          tax_status_name: string
          total_finished_area: number
          total_unfinished_area: number
          total_units: number
          value_row_id: number
          value_year: number
          values_per_sqft_building_total: number
          values_per_sqft_finished: number
          values_per_sqft_land: number
          values_per_unit: number
        }[]
      }
      transition_devnet_review_status: {
        Args: {
          p_changed_by_employee_id?: number
          p_new_status_slug: string
          p_notes?: string
          p_review_id: number
        }
        Returns: boolean
      }
    }
    Enums: {
      devnet_data_status:
        | "not_collected"
        | "in_field"
        | "collected"
        | "entered"
        | "copied_to_devnet"
        | "verified"
      devnet_review_kind:
        | "sale_review"
        | "permit_review"
        | "appeal_review"
        | "custom_review"
      review_item_status: "requested" | "in_progress" | "received" | "canceled"
      review_kind: "custom"
      review_kind_v2:
        | "sale_review"
        | "permit_review"
        | "appeal_review"
        | "building_review"
        | "land_review"
        | "parcel_review"
        | "building_valuation"
        | "land_valuation"
        | "value_calculation"
        | "use_conversion"
    }
    CompositeTypes: {
      regression_coef: {
        term: string | null
        coefficient: number | null
      }
      sales_parcel_data: {
        parcel_number: string | null
        date_of_sale: string | null
        net_selling_price: number | null
        parcel_year: number | null
        occupancy: string | null
        appraised_total: number | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      devnet_data_status: [
        "not_collected",
        "in_field",
        "collected",
        "entered",
        "copied_to_devnet",
        "verified",
      ],
      devnet_review_kind: [
        "sale_review",
        "permit_review",
        "appeal_review",
        "custom_review",
      ],
      review_item_status: ["requested", "in_progress", "received", "canceled"],
      review_kind: ["custom"],
      review_kind_v2: [
        "sale_review",
        "permit_review",
        "appeal_review",
        "building_review",
        "land_review",
        "parcel_review",
        "building_valuation",
        "land_valuation",
        "value_calculation",
        "use_conversion",
      ],
    },
  },
} as const
