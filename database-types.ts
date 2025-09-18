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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      abatement_parcel_year: {
        Row: {
          ag_percent_abated: number | null
          app_ag_base_value: number | null
          app_com_base_value: number | null
          app_res_base_value: number | null
          com_percent_abated: number | null
          id: number
          parcel_number: string | null
          program_id: number
          res_percent_abated: number | null
          year: number | null
        }
        Insert: {
          ag_percent_abated?: number | null
          app_ag_base_value?: number | null
          app_com_base_value?: number | null
          app_res_base_value?: number | null
          com_percent_abated?: number | null
          id?: number
          parcel_number?: string | null
          program_id: number
          res_percent_abated?: number | null
          year?: number | null
        }
        Update: {
          ag_percent_abated?: number | null
          app_ag_base_value?: number | null
          app_com_base_value?: number | null
          app_res_base_value?: number | null
          com_percent_abated?: number | null
          id?: number
          parcel_number?: string | null
          program_id?: number
          res_percent_abated?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abatement_parcel_year_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "abatement_programs"
            referencedColumns: ["name_id"]
          },
        ]
      }
      abatement_programs: {
        Row: {
          description: string | null
          name: string | null
          name_id: number
          notes: string | null
          pa_type: string | null
          scale_type: string | null
          year_created: number | null
          year_expires: number | null
        }
        Insert: {
          description?: string | null
          name?: string | null
          name_id: number
          notes?: string | null
          pa_type?: string | null
          scale_type?: string | null
          year_created?: number | null
          year_expires?: number | null
        }
        Update: {
          description?: string | null
          name?: string | null
          name_id?: number
          notes?: string | null
          pa_type?: string | null
          scale_type?: string | null
          year_created?: number | null
          year_expires?: number | null
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address: string | null
          address_line1: string | null
          address_line2: string | null
          bbox: string | null
          category: string | null
          city: string | null
          country: string | null
          distance: number | null
          district: string | null
          footway: string | null
          formatted: string | null
          hamlet: string | null
          housenumber: string | null
          id: number
          lat: number | null
          lon: number | null
          name: string | null
          old_name: string | null
          place_id: string | null
          postcode: string | null
          result_type: string | null
          state: string | null
          state_code: string | null
          street: string | null
          suburb: string | null
          town: string | null
          village: string | null
        }
        Insert: {
          address?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bbox?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          distance?: number | null
          district?: string | null
          footway?: string | null
          formatted?: string | null
          hamlet?: string | null
          housenumber?: string | null
          id?: number
          lat?: number | null
          lon?: number | null
          name?: string | null
          old_name?: string | null
          place_id?: string | null
          postcode?: string | null
          result_type?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          suburb?: string | null
          town?: string | null
          village?: string | null
        }
        Update: {
          address?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bbox?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          distance?: number | null
          district?: string | null
          footway?: string | null
          formatted?: string | null
          hamlet?: string | null
          housenumber?: string | null
          id?: number
          lat?: number | null
          lon?: number | null
          name?: string | null
          old_name?: string | null
          place_id?: string | null
          postcode?: string | null
          result_type?: string | null
          state?: string | null
          state_code?: string | null
          street?: string | null
          suburb?: string | null
          town?: string | null
          village?: string | null
        }
        Relationships: []
      }
      appeal_complaint_types: {
        Row: {
          complaint_type: string
        }
        Insert: {
          complaint_type: string
        }
        Update: {
          complaint_type?: string
        }
        Relationships: []
      }
      appeal_re_appraisers: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      appeal_statuses: {
        Row: {
          status: string
        }
        Insert: {
          status: string
        }
        Update: {
          status?: string
        }
        Relationships: []
      }
      appeal_types: {
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
      appeals: {
        Row: {
          after_bldg: number | null
          after_land: number | null
          after_total: number | null
          appeal_appraiser: string | null
          appeal_number: number
          appeal_type: string | null
          appraiser_id: number | null
          before_bldg: number | null
          before_land: number | null
          before_total: number | null
          bldg_difference: number | null
          complaint_type: string | null
          filed_ts: string | null
          hearing_ts: string | null
          land_difference: number | null
          parcel_number: string
          report_date_hearing_status: string | null
          report_date_sequence: string | null
          status: string | null
          total_difference: number | null
          year: number | null
        }
        Insert: {
          after_bldg?: number | null
          after_land?: number | null
          after_total?: number | null
          appeal_appraiser?: string | null
          appeal_number: number
          appeal_type?: string | null
          appraiser_id?: number | null
          before_bldg?: number | null
          before_land?: number | null
          before_total?: number | null
          bldg_difference?: number | null
          complaint_type?: string | null
          filed_ts?: string | null
          hearing_ts?: string | null
          land_difference?: number | null
          parcel_number: string
          report_date_hearing_status?: string | null
          report_date_sequence?: string | null
          status?: string | null
          total_difference?: number | null
          year?: number | null
        }
        Update: {
          after_bldg?: number | null
          after_land?: number | null
          after_total?: number | null
          appeal_appraiser?: string | null
          appeal_number?: number
          appeal_type?: string | null
          appraiser_id?: number | null
          before_bldg?: number | null
          before_land?: number | null
          before_total?: number | null
          bldg_difference?: number | null
          complaint_type?: string | null
          filed_ts?: string | null
          hearing_ts?: string | null
          land_difference?: number | null
          parcel_number?: string
          report_date_hearing_status?: string | null
          report_date_sequence?: string | null
          status?: string | null
          total_difference?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_review_appeals_appraiser_id_fkey"
            columns: ["appraiser_id"]
            isOneToOne: false
            referencedRelation: "appraisers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_review_appeals_parcel_number_year_fkey"
            columns: ["parcel_number", "year"]
            isOneToOne: false
            referencedRelation: "parcel_year"
            referencedColumns: ["parcel_number", "year"]
          },
        ]
      }
      appraiser_appeal_stats: {
        Row: {
          appraiser_id: number
          count: number | null
          status: string
        }
        Insert: {
          appraiser_id: number
          count?: number | null
          status: string
        }
        Update: {
          appraiser_id?: number
          count?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appraiser_appeal_stats_appraiser_id_fkey"
            columns: ["appraiser_id"]
            isOneToOne: false
            referencedRelation: "appraisers"
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
        Relationships: [
          {
            foreignKeyName: "bps_parcel_number_fkey"
            columns: ["parcel_number"]
            isOneToOne: false
            referencedRelation: "parcel_reviews_2025"
            referencedColumns: ["parcel_number"]
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
      comparables: {
        Row: {
          address: string | null
          condition: string | null
          construction_type: string | null
          date_of_sale: string | null
          gla: number | null
          gower_dist: number | null
          id: number
          lat: number | null
          lon: number | null
          neighborhood: string | null
          net_selling_price: number | null
          parcel_number: string | null
          subject_parcel: string | null
          touched: number | null
        }
        Insert: {
          address?: string | null
          condition?: string | null
          construction_type?: string | null
          date_of_sale?: string | null
          gla?: number | null
          gower_dist?: number | null
          id?: number
          lat?: number | null
          lon?: number | null
          neighborhood?: string | null
          net_selling_price?: number | null
          parcel_number?: string | null
          subject_parcel?: string | null
          touched?: number | null
        }
        Update: {
          address?: string | null
          condition?: string | null
          construction_type?: string | null
          date_of_sale?: string | null
          gla?: number | null
          gower_dist?: number | null
          id?: number
          lat?: number | null
          lon?: number | null
          neighborhood?: string | null
          net_selling_price?: number | null
          parcel_number?: string | null
          subject_parcel?: string | null
          touched?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comparables_subject_parcel_fkey"
            columns: ["subject_parcel"]
            isOneToOne: false
            referencedRelation: "parcel_master"
            referencedColumns: ["parcel_number"]
          },
        ]
      }
      compare_appraised_total_results: {
        Row: {
          appraiser_id: number | null
          difference: number | null
          end_total: number | null
          land_use: string | null
          neighborhood: string | null
          neighborhood_int: number | null
          occupancy: string | null
          parcel_number: string | null
          pct_change: number | null
          prefix_directional: string | null
          prop_class: string | null
          site_street_name: string | null
          site_street_number: string | null
          site_zip_code: string | null
          start_total: number | null
          tax_status: string | null
        }
        Insert: {
          appraiser_id?: number | null
          difference?: number | null
          end_total?: number | null
          land_use?: string | null
          neighborhood?: string | null
          neighborhood_int?: number | null
          occupancy?: string | null
          parcel_number?: string | null
          pct_change?: number | null
          prefix_directional?: string | null
          prop_class?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
          start_total?: number | null
          tax_status?: string | null
        }
        Update: {
          appraiser_id?: number | null
          difference?: number | null
          end_total?: number | null
          land_use?: string | null
          neighborhood?: string | null
          neighborhood_int?: number | null
          occupancy?: string | null
          parcel_number?: string | null
          pct_change?: number | null
          prefix_directional?: string | null
          prop_class?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
          start_total?: number | null
          tax_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compare_appraised_total_results_appraiser_id_fkey"
            columns: ["appraiser_id"]
            isOneToOne: false
            referencedRelation: "appraisers"
            referencedColumns: ["id"]
          },
        ]
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
      field_review_images: {
        Row: {
          caption: string | null
          created_at: string
          created_by: string | null
          file_id: number
          height: number
          id: number
          review_id: number
          sort_order: number
          width: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          created_by?: string | null
          file_id: number
          height: number
          id?: number
          review_id: number
          sort_order?: number
          width: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          created_by?: string | null
          file_id?: number
          height?: number
          id?: number
          review_id?: number
          sort_order?: number
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "field_review_images_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "field_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "field_reviews_with_current_status"
            referencedColumns: ["id"]
          },
        ]
      }
      field_review_notes: {
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
            foreignKeyName: "field_review_notes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "field_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_review_notes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "field_reviews_with_current_status"
            referencedColumns: ["id"]
          },
        ]
      }
      field_review_statuses: {
        Row: {
          created_at: string
          created_by: string
          id: number
          review_id: number
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          review_id: number
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          review_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_review_statuses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "field_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_review_statuses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "field_reviews_with_current_status"
            referencedColumns: ["id"]
          },
        ]
      }
      field_reviews: {
        Row: {
          created_at: string
          created_by: string
          due_date: string | null
          id: number
          parcel_id: number
          type: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: number
          parcel_id: number
          type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: number
          parcel_id?: number
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_reviews_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "list_parcel_year_parcel_number_year_fkey"
            columns: ["parcel_number", "year"]
            isOneToOne: false
            referencedRelation: "parcel_year"
            referencedColumns: ["parcel_number", "year"]
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
      parcel_master: {
        Row: {
          created_at: string | null
          parcel_number: string
          retired_at: string | null
        }
        Insert: {
          created_at?: string | null
          parcel_number: string
          retired_at?: string | null
        }
        Update: {
          created_at?: string | null
          parcel_number?: string
          retired_at?: string | null
        }
        Relationships: []
      }
      parcel_review_abatements: {
        Row: {
          abate_description: string | null
          abate_notes: string | null
          id: number
          name: string | null
          parcel_number: string | null
          year_created: number | null
          year_expires: number | null
        }
        Insert: {
          abate_description?: string | null
          abate_notes?: string | null
          id?: number
          name?: string | null
          parcel_number?: string | null
          year_created?: number | null
          year_expires?: number | null
        }
        Update: {
          abate_description?: string | null
          abate_notes?: string | null
          id?: number
          name?: string | null
          parcel_number?: string | null
          year_created?: number | null
          year_expires?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_review_abatements_parcel_number_fkey"
            columns: ["parcel_number"]
            isOneToOne: false
            referencedRelation: "parcel_reviews_2025"
            referencedColumns: ["parcel_number"]
          },
        ]
      }
      parcel_review_sales: {
        Row: {
          date_of_sale: string | null
          document_number: string | null
          field_review_date: string | null
          id: number
          net_selling_price: number | null
          parcel_number: string | null
          report_date: string | null
          sale_type: string | null
          sale_year: number | null
          year: number | null
        }
        Insert: {
          date_of_sale?: string | null
          document_number?: string | null
          field_review_date?: string | null
          id?: number
          net_selling_price?: number | null
          parcel_number?: string | null
          report_date?: string | null
          sale_type?: string | null
          sale_year?: number | null
          year?: number | null
        }
        Update: {
          date_of_sale?: string | null
          document_number?: string | null
          field_review_date?: string | null
          id?: number
          net_selling_price?: number | null
          parcel_number?: string | null
          report_date?: string | null
          sale_type?: string | null
          sale_year?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_review_sales_parcel_number_fkey"
            columns: ["parcel_number"]
            isOneToOne: false
            referencedRelation: "parcel_reviews_2025"
            referencedColumns: ["parcel_number"]
          },
        ]
      }
      parcel_reviews_2025: {
        Row: {
          appraised_total_2024: number | null
          appraised_total_2025: number | null
          appraiser_id: number | null
          current_value_difference: number | null
          data_collection: string | null
          difference: number | null
          field_reviewed: string | null
          fire_time: string | null
          geometry: Json | null
          neighborhood: string | null
          neighborhood_int: number | null
          occupancy: string | null
          owner_address1: string | null
          owner_address2: string | null
          owner_city: string | null
          owner_name: string | null
          owner_state: string | null
          owner_zip: string | null
          parcel_number: string
          percent_change: number | null
          prefix_directional: string | null
          prop_class: string | null
          site_street_name: string | null
          site_street_number: string | null
          site_zip_code: string | null
          tax_status: string | null
          working_appraised_total_2025: number | null
          working_difference: number | null
          working_percent_change: number | null
        }
        Insert: {
          appraised_total_2024?: number | null
          appraised_total_2025?: number | null
          appraiser_id?: number | null
          current_value_difference?: number | null
          data_collection?: string | null
          difference?: number | null
          field_reviewed?: string | null
          fire_time?: string | null
          geometry?: Json | null
          neighborhood?: string | null
          neighborhood_int?: number | null
          occupancy?: string | null
          owner_address1?: string | null
          owner_address2?: string | null
          owner_city?: string | null
          owner_name?: string | null
          owner_state?: string | null
          owner_zip?: string | null
          parcel_number: string
          percent_change?: number | null
          prefix_directional?: string | null
          prop_class?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
          tax_status?: string | null
          working_appraised_total_2025?: number | null
          working_difference?: number | null
          working_percent_change?: number | null
        }
        Update: {
          appraised_total_2024?: number | null
          appraised_total_2025?: number | null
          appraiser_id?: number | null
          current_value_difference?: number | null
          data_collection?: string | null
          difference?: number | null
          field_reviewed?: string | null
          fire_time?: string | null
          geometry?: Json | null
          neighborhood?: string | null
          neighborhood_int?: number | null
          occupancy?: string | null
          owner_address1?: string | null
          owner_address2?: string | null
          owner_city?: string | null
          owner_name?: string | null
          owner_state?: string | null
          owner_zip?: string | null
          parcel_number?: string
          percent_change?: number | null
          prefix_directional?: string | null
          prop_class?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
          tax_status?: string | null
          working_appraised_total_2025?: number | null
          working_difference?: number | null
          working_percent_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_reviews_2025_appraiser_id_fkey"
            columns: ["appraiser_id"]
            isOneToOne: false
            referencedRelation: "appraisers"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_site_addresses: {
        Row: {
          address_id: number
          end_date: string | null
          id: number
          is_primary: boolean | null
          parcel_id: number
          start_date: string
        }
        Insert: {
          address_id: number
          end_date?: string | null
          id?: number
          is_primary?: boolean | null
          parcel_id: number
          start_date: string
        }
        Update: {
          address_id?: number
          end_date?: string | null
          id?: number
          is_primary?: boolean | null
          parcel_id?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcel_site_addresses_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
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
            foreignKeyName: "parcel_tax_rates_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_tax_rates_rate_year_id_fkey"
            columns: ["rate_year_id"]
            isOneToOne: false
            referencedRelation: "tax_rate_years"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_value_appeal: {
        Row: {
          appeal_number: string | null
          decision_date: string | null
          final_value: number | null
          id: number
          notes: string | null
        }
        Insert: {
          appeal_number?: string | null
          decision_date?: string | null
          final_value?: number | null
          id: number
          notes?: string | null
        }
        Update: {
          appeal_number?: string | null
          decision_date?: string | null
          final_value?: number | null
          id?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_value_appeal_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "parcel_values"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_value_cost: {
        Row: {
          building_value: number | null
          depreciation_amount: number | null
          id: number
          land_value: number | null
          total_value: number | null
        }
        Insert: {
          building_value?: number | null
          depreciation_amount?: number | null
          id: number
          land_value?: number | null
          total_value?: number | null
        }
        Update: {
          building_value?: number | null
          depreciation_amount?: number | null
          id?: number
          land_value?: number | null
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_value_cost_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "parcel_values"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_value_model: {
        Row: {
          id: number
          model_id: number
          predicted_value: number
          prediction_date: string | null
        }
        Insert: {
          id: number
          model_id: number
          predicted_value: number
          prediction_date?: string | null
        }
        Update: {
          id?: number
          model_id?: number
          predicted_value?: number
          prediction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_value_model_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "parcel_values"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_value_sales: {
        Row: {
          adjusted_average_price: number | null
          adjustments: string | null
          comparable_sales_count: number | null
          id: number
          total_value: number | null
        }
        Insert: {
          adjusted_average_price?: number | null
          adjustments?: string | null
          comparable_sales_count?: number | null
          id: number
          total_value?: number | null
        }
        Update: {
          adjusted_average_price?: number | null
          adjustments?: string | null
          comparable_sales_count?: number | null
          id?: number
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_value_sales_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "parcel_values"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_values: {
        Row: {
          created_at: string | null
          id: number
          parcel_id: number
          value_type: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          parcel_id: number
          value_type: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: number
          parcel_id?: number
          value_type?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_values_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_year: {
        Row: {
          agr_bldg: number | null
          agr_bldg_assess: number | null
          agr_land: number | null
          agr_land_assess: number | null
          agr_new_const: number | null
          agr_new_const_assess: number | null
          appraised_total: number | null
          appraiser_id: number | null
          area: number | null
          assessed_total: number | null
          com_bldg: number | null
          com_bldg_assess: number | null
          com_land: number | null
          com_land_assess: number | null
          com_new_const: number | null
          com_new_const_assess: number | null
          dist_city: string | null
          dist_college: string | null
          dist_school: string | null
          dist_tif: string | null
          land_use: string | null
          neighborhood: string | null
          occupancy: string | null
          owner_address_1: string | null
          owner_address_2: string | null
          owner_city: string | null
          owner_name: string | null
          owner_state: string | null
          owner_zip: string | null
          parcel_number: string
          prefix_directional: string | null
          prop_class: string | null
          report_timestamp: string | null
          res_acres: number | null
          res_bldg: number | null
          res_bldg_assess: number | null
          res_land: number | null
          res_land_assess: number | null
          res_new_const: number | null
          res_new_const_assess: number | null
          section: string | null
          site_street_name: string | null
          site_street_number: string | null
          site_zip_code: string | null
          tax_status: string | null
          taxcode: string | null
          use_code: string | null
          working_improve_value: number | null
          working_land_value: number | null
          working_total_value: number | null
          year: number
        }
        Insert: {
          agr_bldg?: number | null
          agr_bldg_assess?: number | null
          agr_land?: number | null
          agr_land_assess?: number | null
          agr_new_const?: number | null
          agr_new_const_assess?: number | null
          appraised_total?: number | null
          appraiser_id?: number | null
          area?: number | null
          assessed_total?: number | null
          com_bldg?: number | null
          com_bldg_assess?: number | null
          com_land?: number | null
          com_land_assess?: number | null
          com_new_const?: number | null
          com_new_const_assess?: number | null
          dist_city?: string | null
          dist_college?: string | null
          dist_school?: string | null
          dist_tif?: string | null
          land_use?: string | null
          neighborhood?: string | null
          occupancy?: string | null
          owner_address_1?: string | null
          owner_address_2?: string | null
          owner_city?: string | null
          owner_name?: string | null
          owner_state?: string | null
          owner_zip?: string | null
          parcel_number: string
          prefix_directional?: string | null
          prop_class?: string | null
          report_timestamp?: string | null
          res_acres?: number | null
          res_bldg?: number | null
          res_bldg_assess?: number | null
          res_land?: number | null
          res_land_assess?: number | null
          res_new_const?: number | null
          res_new_const_assess?: number | null
          section?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
          tax_status?: string | null
          taxcode?: string | null
          use_code?: string | null
          working_improve_value?: number | null
          working_land_value?: number | null
          working_total_value?: number | null
          year: number
        }
        Update: {
          agr_bldg?: number | null
          agr_bldg_assess?: number | null
          agr_land?: number | null
          agr_land_assess?: number | null
          agr_new_const?: number | null
          agr_new_const_assess?: number | null
          appraised_total?: number | null
          appraiser_id?: number | null
          area?: number | null
          assessed_total?: number | null
          com_bldg?: number | null
          com_bldg_assess?: number | null
          com_land?: number | null
          com_land_assess?: number | null
          com_new_const?: number | null
          com_new_const_assess?: number | null
          dist_city?: string | null
          dist_college?: string | null
          dist_school?: string | null
          dist_tif?: string | null
          land_use?: string | null
          neighborhood?: string | null
          occupancy?: string | null
          owner_address_1?: string | null
          owner_address_2?: string | null
          owner_city?: string | null
          owner_name?: string | null
          owner_state?: string | null
          owner_zip?: string | null
          parcel_number?: string
          prefix_directional?: string | null
          prop_class?: string | null
          report_timestamp?: string | null
          res_acres?: number | null
          res_bldg?: number | null
          res_bldg_assess?: number | null
          res_land?: number | null
          res_land_assess?: number | null
          res_new_const?: number | null
          res_new_const_assess?: number | null
          section?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
          tax_status?: string | null
          taxcode?: string | null
          use_code?: string | null
          working_improve_value?: number | null
          working_land_value?: number | null
          working_total_value?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcel_year_appraiser_id_fkey"
            columns: ["appraiser_id"]
            isOneToOne: false
            referencedRelation: "appraisers"
            referencedColumns: ["id"]
          },
        ]
      }
      parcels: {
        Row: {
          created_at: string | null
          id: number
          parcel_number: string
          retired_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          parcel_number: string
          retired_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          parcel_number?: string
          retired_at?: string | null
        }
        Relationships: []
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
      prcl: {
        Row: {
          abatementendyear: number | null
          abatementstartyear: number | null
          abatementtype: string | null
          apragrimprove: number | null
          apragrland: number | null
          aprcomimprove: number | null
          aprcomland: number | null
          aprexemptimprove: number | null
          aprexemptland: number | null
          aprland: number | null
          aprresimprove: number | null
          aprresland: number | null
          asdagrimprove: number | null
          asdagrland: number | null
          asdcomimprove: number | null
          asdcomland: number | null
          asdresimprove: number | null
          asdresland: number | null
          asdtotal: number | null
          asmtappealnum: number | null
          asmtappealtype: string | null
          asmtappealyear: number | null
          asrclasscode: number | null
          asrlanduse1: string | null
          asrnbrhd: number | null
          asrparcelid: number
          cdalanduse1: string | null
          condominium: boolean | null
          highaddrnum: number | null
          isabatedproperty: boolean | null
          landarea: number | null
          lowaddrnum: number | null
          nbrhd: number | null
          nbrofapts: number | null
          nbrofbldgscom: number | null
          nbrofbldgsres: number | null
          nbrofunits: number | null
          ownername: string | null
          precinct20: number | null
          propertyclasscode: number | null
          redevphase: string | null
          redevphase2: string | null
          redevyearend: number | null
          redevyearend2: number | null
          specbusdist: string | null
          stname: string | null
          stpredir: string | null
          sttype: string | null
          tifdist: string | null
          vacantlot: boolean | null
          ward20: number | null
          zip: string | null
          zoning: string | null
        }
        Insert: {
          abatementendyear?: number | null
          abatementstartyear?: number | null
          abatementtype?: string | null
          apragrimprove?: number | null
          apragrland?: number | null
          aprcomimprove?: number | null
          aprcomland?: number | null
          aprexemptimprove?: number | null
          aprexemptland?: number | null
          aprland?: number | null
          aprresimprove?: number | null
          aprresland?: number | null
          asdagrimprove?: number | null
          asdagrland?: number | null
          asdcomimprove?: number | null
          asdcomland?: number | null
          asdresimprove?: number | null
          asdresland?: number | null
          asdtotal?: number | null
          asmtappealnum?: number | null
          asmtappealtype?: string | null
          asmtappealyear?: number | null
          asrclasscode?: number | null
          asrlanduse1?: string | null
          asrnbrhd?: number | null
          asrparcelid: number
          cdalanduse1?: string | null
          condominium?: boolean | null
          highaddrnum?: number | null
          isabatedproperty?: boolean | null
          landarea?: number | null
          lowaddrnum?: number | null
          nbrhd?: number | null
          nbrofapts?: number | null
          nbrofbldgscom?: number | null
          nbrofbldgsres?: number | null
          nbrofunits?: number | null
          ownername?: string | null
          precinct20?: number | null
          propertyclasscode?: number | null
          redevphase?: string | null
          redevphase2?: string | null
          redevyearend?: number | null
          redevyearend2?: number | null
          specbusdist?: string | null
          stname?: string | null
          stpredir?: string | null
          sttype?: string | null
          tifdist?: string | null
          vacantlot?: boolean | null
          ward20?: number | null
          zip?: string | null
          zoning?: string | null
        }
        Update: {
          abatementendyear?: number | null
          abatementstartyear?: number | null
          abatementtype?: string | null
          apragrimprove?: number | null
          apragrland?: number | null
          aprcomimprove?: number | null
          aprcomland?: number | null
          aprexemptimprove?: number | null
          aprexemptland?: number | null
          aprland?: number | null
          aprresimprove?: number | null
          aprresland?: number | null
          asdagrimprove?: number | null
          asdagrland?: number | null
          asdcomimprove?: number | null
          asdcomland?: number | null
          asdresimprove?: number | null
          asdresland?: number | null
          asdtotal?: number | null
          asmtappealnum?: number | null
          asmtappealtype?: string | null
          asmtappealyear?: number | null
          asrclasscode?: number | null
          asrlanduse1?: string | null
          asrnbrhd?: number | null
          asrparcelid?: number
          cdalanduse1?: string | null
          condominium?: boolean | null
          highaddrnum?: number | null
          isabatedproperty?: boolean | null
          landarea?: number | null
          lowaddrnum?: number | null
          nbrhd?: number | null
          nbrofapts?: number | null
          nbrofbldgscom?: number | null
          nbrofbldgsres?: number | null
          nbrofunits?: number | null
          ownername?: string | null
          precinct20?: number | null
          propertyclasscode?: number | null
          redevphase?: string | null
          redevphase2?: string | null
          redevyearend?: number | null
          redevyearend2?: number | null
          specbusdist?: string | null
          stname?: string | null
          stpredir?: string | null
          sttype?: string | null
          tifdist?: string | null
          vacantlot?: boolean | null
          ward20?: number | null
          zip?: string | null
          zoning?: string | null
        }
        Relationships: []
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
      res_structures: {
        Row: {
          actual_value: number | null
          additions: number | null
          adjustments: number | null
          base_fctr_ttl: number | null
          base_value: number | null
          cdu_adjustment_cndtn: string | null
          condition: string | null
          eff_year_build: number | null
          grade_fctr_qlty: string | null
          id: number
          land_value: number | null
          multiplier_fctr: number | null
          multiplier_value: number | null
          neighborhood_code: string | null
          oby_rcn_value: number | null
          oby_rcnld_value: number | null
          occupancy: number | null
          override_value: number | null
          parcel_number: string | null
          property_group: number | null
          prorated_value: number | null
          quality: string | null
          report_date: string | null
          struct_rcn_value: number | null
          struct_rcnld_value: number | null
          structure_name: string | null
          year: number | null
          year_built: number | null
        }
        Insert: {
          actual_value?: number | null
          additions?: number | null
          adjustments?: number | null
          base_fctr_ttl?: number | null
          base_value?: number | null
          cdu_adjustment_cndtn?: string | null
          condition?: string | null
          eff_year_build?: number | null
          grade_fctr_qlty?: string | null
          id?: number
          land_value?: number | null
          multiplier_fctr?: number | null
          multiplier_value?: number | null
          neighborhood_code?: string | null
          oby_rcn_value?: number | null
          oby_rcnld_value?: number | null
          occupancy?: number | null
          override_value?: number | null
          parcel_number?: string | null
          property_group?: number | null
          prorated_value?: number | null
          quality?: string | null
          report_date?: string | null
          struct_rcn_value?: number | null
          struct_rcnld_value?: number | null
          structure_name?: string | null
          year?: number | null
          year_built?: number | null
        }
        Update: {
          actual_value?: number | null
          additions?: number | null
          adjustments?: number | null
          base_fctr_ttl?: number | null
          base_value?: number | null
          cdu_adjustment_cndtn?: string | null
          condition?: string | null
          eff_year_build?: number | null
          grade_fctr_qlty?: string | null
          id?: number
          land_value?: number | null
          multiplier_fctr?: number | null
          multiplier_value?: number | null
          neighborhood_code?: string | null
          oby_rcn_value?: number | null
          oby_rcnld_value?: number | null
          occupancy?: number | null
          override_value?: number | null
          parcel_number?: string | null
          property_group?: number | null
          prorated_value?: number | null
          quality?: string | null
          report_date?: string | null
          struct_rcn_value?: number | null
          struct_rcnld_value?: number | null
          structure_name?: string | null
          year?: number | null
          year_built?: number | null
        }
        Relationships: []
      }
      sales_master: {
        Row: {
          date_of_sale: string | null
          document_number: number
          field_review_date: string | null
          id: number
          net_selling_price: number | null
          report_timestamp: string | null
          sale_type: string | null
          sale_year: number | null
        }
        Insert: {
          date_of_sale?: string | null
          document_number: number
          field_review_date?: string | null
          id?: number
          net_selling_price?: number | null
          report_timestamp?: string | null
          sale_type?: string | null
          sale_year?: number | null
        }
        Update: {
          date_of_sale?: string | null
          document_number?: number
          field_review_date?: string | null
          id?: number
          net_selling_price?: number | null
          report_timestamp?: string | null
          sale_type?: string | null
          sale_year?: number | null
        }
        Relationships: []
      }
      sched_appeals: {
        Row: {
          appeal_number: string
          appellant_name: string | null
          created_at: string | null
          id: number
          parcel_id: number
          status: string | null
        }
        Insert: {
          appeal_number: string
          appellant_name?: string | null
          created_at?: string | null
          id?: number
          parcel_id: number
          status?: string | null
        }
        Update: {
          appeal_number?: string
          appellant_name?: string | null
          created_at?: string | null
          id?: number
          parcel_id?: number
          status?: string | null
        }
        Relationships: []
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
            foreignKeyName: "sched_scheduled_hearings_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: true
            referencedRelation: "sched_appeals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sched_scheduled_hearings_hearing_slot_id_fkey"
            columns: ["hearing_slot_id"]
            isOneToOne: false
            referencedRelation: "sched_hearing_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      search_table: {
        Row: {
          owner_address2: string | null
          owner_city: string | null
          owner_name: string | null
          owner_state: string | null
          owner_zip: string | null
          parcel_number: string
          search: string | null
          site_street_name: string | null
          site_street_number: string | null
          site_zip_code: string | null
        }
        Insert: {
          owner_address2?: string | null
          owner_city?: string | null
          owner_name?: string | null
          owner_state?: string | null
          owner_zip?: string | null
          parcel_number: string
          search?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
        }
        Update: {
          owner_address2?: string | null
          owner_city?: string | null
          owner_name?: string | null
          owner_state?: string | null
          owner_zip?: string | null
          parcel_number?: string
          search?: string | null
          site_street_name?: string | null
          site_street_number?: string | null
          site_zip_code?: string | null
        }
        Relationships: []
      }
      search_table_2: {
        Row: {
          created_at: string | null
          fts: unknown | null
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
          fts?: unknown | null
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
          fts?: unknown | null
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
        Relationships: [
          {
            foreignKeyName: "senior_tax_credits_parcel_number_fkey"
            columns: ["parcel_number"]
            isOneToOne: true
            referencedRelation: "parcel_reviews_2025"
            referencedColumns: ["parcel_number"]
          },
        ]
      }
      site_address_master: {
        Row: {
          fts: unknown | null
          house_number: string | null
          id: string
          street_name: string | null
          street_suffix: string | null
          zip_code: string | null
        }
        Insert: {
          fts?: unknown | null
          house_number?: string | null
          id: string
          street_name?: string | null
          street_suffix?: string | null
          zip_code?: string | null
        }
        Update: {
          fts?: unknown | null
          house_number?: string | null
          id?: string
          street_name?: string | null
          street_suffix?: string | null
          zip_code?: string | null
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
      tax_rate_years: {
        Row: {
          cap: number | null
          created_at: string | null
          id: number
          rate: number
          rate_id: number
          rate_type: string
          tax_year: number
        }
        Insert: {
          cap?: number | null
          created_at?: string | null
          id?: number
          rate: number
          rate_id: number
          rate_type: string
          tax_year: number
        }
        Update: {
          cap?: number | null
          created_at?: string | null
          id?: number
          rate?: number
          rate_id?: number
          rate_type?: string
          tax_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_rate_years_rate_id_fkey"
            columns: ["rate_id"]
            isOneToOne: false
            referencedRelation: "tax_rates"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rates: {
        Row: {
          code: string
          description: string | null
          id: number
        }
        Insert: {
          code: string
          description?: string | null
          id?: number
        }
        Update: {
          code?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      test_comparables: {
        Row: {
          address: string | null
          adjusted_sale_price: number | null
          cdu: string | null
          cdu_adjustment: number | null
          cost_group: string | null
          cost_group_adjustment: number | null
          date_of_sale: string | null
          garage_area: number | null
          garage_area_adjustment: number | null
          gla: number | null
          gla_adjustment: number | null
          gower_dist: number | null
          grade: string | null
          land_use: string | null
          land_use_adjustment: number | null
          lat: number | null
          lon: number | null
          miles_distance: number | null
          neighborhood: number | null
          neighborhood_group: string | null
          neighborhood_group_adjustment: number | null
          net_selling_price: number | null
          parcel_id: number | null
          sale_id: number | null
          story: number | null
          story_adjustment: number | null
          subject_address: string | null
          subject_appraised_total: number | null
          subject_cdu: string | null
          subject_cost_group: string | null
          subject_garage_area: number | null
          subject_gla: number | null
          subject_land_use: string | null
          subject_lat: number | null
          subject_lon: number | null
          subject_neighborhood_group: string | null
          subject_parcel: number | null
          subject_story: number | null
          subject_year_built: number | null
          year_built: number | null
          year_built_adjustment: number | null
        }
        Insert: {
          address?: string | null
          adjusted_sale_price?: number | null
          cdu?: string | null
          cdu_adjustment?: number | null
          cost_group?: string | null
          cost_group_adjustment?: number | null
          date_of_sale?: string | null
          garage_area?: number | null
          garage_area_adjustment?: number | null
          gla?: number | null
          gla_adjustment?: number | null
          gower_dist?: number | null
          grade?: string | null
          land_use?: string | null
          land_use_adjustment?: number | null
          lat?: number | null
          lon?: number | null
          miles_distance?: number | null
          neighborhood?: number | null
          neighborhood_group?: string | null
          neighborhood_group_adjustment?: number | null
          net_selling_price?: number | null
          parcel_id?: number | null
          sale_id?: number | null
          story?: number | null
          story_adjustment?: number | null
          subject_address?: string | null
          subject_appraised_total?: number | null
          subject_cdu?: string | null
          subject_cost_group?: string | null
          subject_garage_area?: number | null
          subject_gla?: number | null
          subject_land_use?: string | null
          subject_lat?: number | null
          subject_lon?: number | null
          subject_neighborhood_group?: string | null
          subject_parcel?: number | null
          subject_story?: number | null
          subject_year_built?: number | null
          year_built?: number | null
          year_built_adjustment?: number | null
        }
        Update: {
          address?: string | null
          adjusted_sale_price?: number | null
          cdu?: string | null
          cdu_adjustment?: number | null
          cost_group?: string | null
          cost_group_adjustment?: number | null
          date_of_sale?: string | null
          garage_area?: number | null
          garage_area_adjustment?: number | null
          gla?: number | null
          gla_adjustment?: number | null
          gower_dist?: number | null
          grade?: string | null
          land_use?: string | null
          land_use_adjustment?: number | null
          lat?: number | null
          lon?: number | null
          miles_distance?: number | null
          neighborhood?: number | null
          neighborhood_group?: string | null
          neighborhood_group_adjustment?: number | null
          net_selling_price?: number | null
          parcel_id?: number | null
          sale_id?: number | null
          story?: number | null
          story_adjustment?: number | null
          subject_address?: string | null
          subject_appraised_total?: number | null
          subject_cdu?: string | null
          subject_cost_group?: string | null
          subject_garage_area?: number | null
          subject_gla?: number | null
          subject_land_use?: string | null
          subject_lat?: number | null
          subject_lon?: number | null
          subject_neighborhood_group?: string | null
          subject_parcel?: number | null
          subject_story?: number | null
          subject_year_built?: number | null
          year_built?: number | null
          year_built_adjustment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_comparables_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_comparables_subject_parcel_fkey"
            columns: ["subject_parcel"]
            isOneToOne: false
            referencedRelation: "test_parcels"
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
          fts_address_line1: unknown | null
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
          fts_address_line1?: unknown | null
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
          fts_address_line1?: unknown | null
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
          {
            foreignKeyName: "test_parcel_join_parent_parcel_fkey"
            columns: ["parent_parcel"]
            isOneToOne: false
            referencedRelation: "parcels"
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
          finished_area: number | null
          floor_number: number | null
          id: number
          structure_id: number
          type: string
          unfinished_area: number | null
        }
        Insert: {
          finished_area?: number | null
          floor_number?: number | null
          id?: number
          structure_id: number
          type: string
          unfinished_area?: number | null
        }
        Update: {
          finished_area?: number | null
          floor_number?: number | null
          id?: number
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
      field_reviews_with_current_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_status: string | null
          due_date: string | null
          id: number | null
          parcel_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_status?: never
          due_date?: string | null
          id?: number | null
          parcel_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_status?: never
          due_date?: string | null
          id?: number | null
          parcel_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "field_reviews_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "test_parcels"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Functions: {
      comp_sales_linreg_madlib: {
        Args: { p_parcel_id: number; p_top_k?: number; p_years?: number }
        Returns: {
          coefficient: number
          feature_name: string
          num_rows: number
          predicted_price: number
          r2: number
        }[]
      }
      compare_appraised_total: {
        Args: { p_end_year: number; p_start_year: number }
        Returns: {
          appraiser_id: number
          difference: number
          end_total: number
          land_use: string
          neighborhood: string
          neighborhood_int: number
          occupancy: string
          parcel_number: string
          pct_change: number
          prefix_directional: string
          prop_class: string
          site_street_name: string
          site_street_number: string
          site_zip_code: string
          start_total: number
          tax_status: string
        }[]
      }
      compare_parcel_to_comp_sale: {
        Args: {
          p_comp_sale_id: number
          p_subject_parcel_id: number
          p_valid_only?: boolean
        }
        Returns: {
          comp_block: number
          comp_ext: number
          comp_land_use: string
          comp_lot: string
          comp_parcel_id: number
          comp_sale_date: string
          comp_sale_id: number
          comp_sale_price: number
          comp_sale_type: string
          diff_avg_condition: number
          diff_avg_year_built: number
          diff_structure_count: number
          diff_total_finished_area: number
          diff_total_unfinished_area: number
          distance_miles: number
          same_land_use: boolean
          subject_block: number
          subject_ext: number
          subject_land_use: string
          subject_lot: string
          subject_parcel_id: number
        }[]
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
      create_field_review: {
        Args: {
          p_due_date: string
          p_initial_note: string
          p_initial_status: string
          p_parcel_id: number
          p_type: string
        }
        Returns: {
          note_id: number
          review_created_at: string
          review_id: number
          status_id: number
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
      delete_parcel_image: {
        Args: { p_image_url: string }
        Returns: undefined
      }
      delete_parcel_images: {
        Args: { p_image_urls: string[] }
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
      find_comps_gower_with_garages_test_2: {
        Args: {
          p_k?: number
          p_living_area_band?: number
          p_max_distance_miles?: number
          p_max_living_area?: number
          p_min_living_area?: number
          p_parcel_id: number
          p_require_same_land_use?: boolean
          p_weights?: Json
          p_years?: number
        }
        Returns: {
          buildings_per_material: Json
          comp_block: number
          comp_city: string
          comp_condition_at_sale: string
          comp_distance_miles: number
          comp_district: string
          comp_ext: number
          comp_house_number: string
          comp_lat: number
          comp_lon: number
          comp_lot: string
          comp_material: string
          comp_parcel_id: number
          comp_postcode: string
          comp_state: string
          comp_street: string
          gower_distance: number
          sale_date: string
          sale_id: number
          sale_price: number
          total_finished_area: number
          total_unfinished_area: number
        }[]
      }
      find_comps_multi_parcel: {
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
          distance_miles: number
          district: string
          gower_distance: number
          land_use: string
          lat: number
          lon: number
          parcel_ids: number[]
          price_per_sqft: number
          sale_date: string
          sale_price: number
          sale_type: string
          structure_count: number
          subject_features: Json
          subject_parcel_id: number
          total_finished_area: number
          total_unfinished_area: number
        }[]
      }
      find_model_outliers_v1: {
        Args: {
          p_include_no_comps?: boolean
          p_k?: number
          p_limit?: number
          p_living_area_band?: number
          p_max_distance_miles?: number
          p_max_living_area?: number
          p_min_living_area?: number
          p_only_outliers?: boolean
          p_parcel_ids?: number[]
          p_run_id?: number
          p_weights?: Json
          p_years?: number
        }
        Returns: {
          comp_max_price: number
          comp_min_price: number
          comp_n: number
          comps_json: Json
          is_outlier: boolean
          parcel_id: number
          y_pred: number
        }[]
      }
      find_parcel_features: {
        Args: { p_as_of_date?: string }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          district: string
          ext: number
          house_number: string
          land_use: string
          lat: number
          lon: number
          lot: string
          parcel_id: number
          postcode: string
          street: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
        }[]
      }
      find_sold_parcel_features: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          block: number
          district: string
          ext: number
          house_number: string
          land_use: string
          lat: number
          lon: number
          lot: string
          parcel_id: number
          postcode: string
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          street: string
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
        }[]
      }
      get_asdtotal_statistics: {
        Args:
          | {
              p_abatementendyear?: number
              p_abatementstartyear?: number
              p_abatementtype?: string
              p_asrclasscode?: number
              p_asrlanduse1?: string
              p_asrnbrhd?: number
              p_isabatedproperty?: boolean
              p_nbrhd?: number
              p_specbusdist?: string
              p_tifdist?: string
              p_zip?: string
              p_zoning?: string
            }
          | { p_zip?: string }
        Returns: {
          avg_asdtotal: number
          count_asdtotal: number
          max_asdtotal: number
          median_asdtotal: number
          total_asdtotal: number
        }[]
      }
      get_distinct_values: {
        Args: { p_column_name: string; p_table_name: string }
        Returns: {
          distinct_value: string
        }[]
      }
      get_filtered_stats: {
        Args: { p_filters: Json }
        Returns: {
          avg_asdtotal: number
          count_asdtotal: number
          max_asdtotal: number
          median_asdtotal: number
          total_asdtotal: number
        }[]
      }
      get_fire_appraisal_comparison: {
        Args: Record<PropertyKey, never>
        Returns: {
          appraiser_id: number
          difference: number
          end_total: number
          fire_parcel_number: string
          land_use: string
          neighborhood: string
          neighborhood_int: number
          occupancy: string
          p_parcel_number: string
          pct_change: number
          prefix_directional: string
          prop_class: string
          site_street_name: string
          site_street_number: string
          site_zip_code: string
          start_total: number
          tax_status: string
        }[]
      }
      get_parcel_feature_inputs_raw: {
        Args: {
          p_as_of_date?: string
          p_land_uses?: number[]
          p_neighborhoods?: number[]
        }
        Returns: {
          block: number
          district: string
          ext: number
          house_number: string
          land_use: string
          lat: number
          lon: number
          lot: string
          neighborhoods: Json
          parcel_id: number
          postcode: string
          street: string
          structures: Json
          value_row: Json
        }[]
      }
      get_parcel_features_as_of: {
        Args: { p_as_of?: string }
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
          category: string
          city: string
          condition_at_sale: string
          crawl_finished_total: number
          crawl_unfinished_total: number
          detached_garage_area: number
          district: string
          ext: number
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
          type: string
          year_built: number
        }[]
      }
      get_parcel_features_latest: {
        Args: Record<PropertyKey, never>
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
          carport_area: number
          city: string
          condition_at_sale: string
          crawl_finished_total: number
          crawl_unfinished_total: number
          detached_garage_area: number
          district: string
          ext: number
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
          parcel_id: number
          postcode: string
          rooms: number
          sale_date: string
          sale_id: number
          sale_is_valid: boolean
          sale_price: number
          sale_type: string
          state: string
          street: string
          year_built: number
        }[]
      }
      get_parcel_value_features_asof: {
        Args: {
          p_as_of_date?: string
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
          street: string
          structure_count: number
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
      get_ratio_medians: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_group_by?: string[]
          p_include_raw?: boolean
          p_land_uses?: string[]
          p_start_date?: string
          p_trim_factor?: number
        }
        Returns: {
          avg_ratio: number
          group_key: string
          max_ratio: number
          median_ratio: number
          min_ratio: number
          n: number
          raw_data: Json
        }[]
      }
      get_ratios: {
        Args: { p_as_of_date: string; p_end_date: string; p_start_date: string }
        Returns: {
          current_value: number
          date_of_assessment: string
          district: string
          land_use_asof: string
          land_use_sale: string
          parcel_id: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          value_row_id: number
          value_year: number
        }[]
      }
      get_sale_features_all: {
        Args: Record<PropertyKey, never>
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
          carport_area: number
          city: string
          condition_at_sale: string
          crawl_finished_total: number
          crawl_unfinished_total: number
          detached_garage_area: number
          district: string
          ext: number
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
          parcel_id: number
          postcode: string
          rooms: number
          sale_date: string
          sale_id: number
          sale_is_valid: boolean
          sale_price: number
          sale_type: string
          state: string
          street: string
          year_built: number
        }[]
      }
      get_sales: {
        Args: {
          condition_values?: string[]
          neighborhood_values?: string[]
          occupancy_values?: string[]
          override_year?: number
          quality_values?: string[]
          relative_year_offset?: number
          structure_name_values?: string[]
        }
        Returns: {
          appraised_sum: number
          date_of_sale: string
          document_number: number
          net_selling_price: number
          parcel_count: number
          parcels: Json
          sale_type: string
          structure_count: number
        }[]
      }
      get_sales_by_occupancy: {
        Args: {
          neighborhood_values?: string[]
          occupancy_values?: string[]
          override_year?: number
          relative_year_offset?: number
          sale_parcel_type?: string
        }
        Returns: {
          date_of_sale: string
          net_selling_price: number
          parcels: Json
          sale_document_number: number
          sale_year: number
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
      get_sold_parcel_ratios_features: {
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
      get_sold_parcel_ratios_features_multi: {
        Args: {
          p_as_of_date?: string
          p_end_date?: string
          p_land_uses?: string[]
          p_start_date?: string
          p_valid_only?: boolean
        }
        Returns: {
          avg_condition: number
          avg_year_built: number
          current_value: number
          date_of_assessment: string
          is_valid: boolean
          land_area_total: number
          land_to_building_area_ratio: number
          parcel_count: number
          parcels: Json
          price_per_sqft_building_total: number
          price_per_sqft_finished: number
          ratio: number
          sale_date: string
          sale_id: number
          sale_price: number
          sale_type: string
          single_parcel_id: number
          structure_count: number
          total_finished_area: number
          total_unfinished_area: number
          value_row_id: number
          value_year: number
        }[]
      }
      get_subject_features_for_parcels: {
        Args: { p_parcel_ids: number[] }
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
          carport_area: number
          city: string
          condition: string
          crawl_finished_total: number
          crawl_unfinished_total: number
          detached_garage_area: number
          district: string
          floor_finished_total: number
          floor_unfinished_total: number
          full_bathrooms: number
          half_bathrooms: number
          house_number: string
          land_use: string
          lat: number
          lon: number
          material: string
          parcel_id: number
          postcode: string
          rooms: number
          state: string
          street: string
          subject_living_area: number
          year_built: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      insert_parcel_image: {
        Args: { p_image_url: string; p_parcel_id: number }
        Returns: number
      }
      load_parcel_site_addresses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      load_site_addresses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_parcel_database: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      score_sales_with_model: {
        Args:
          | { p_limit?: number; p_parcel_ids?: number[]; p_run_id?: number }
          | { p_limit?: number; p_run_id?: number }
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
          carport_area: number
          city: string
          condition_at_sale: string
          crawl_finished_total: number
          crawl_unfinished_total: number
          detached_garage_area: number
          district: string
          ext: number
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
          parcel_id: number
          postcode: string
          rooms: number
          sale_date: string
          sale_id: number
          sale_is_valid: boolean
          sale_price: number
          sale_type: string
          state: string
          street: string
          y_pred: number
          year_built: number
        }[]
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
          fts: unknown | null
          house_number: string | null
          id: number
          name: string | null
          parcel_number: string | null
          retired_at: string | null
          street_name: string | null
          street_suffix: string | null
          zip_code: string | null
        }[]
      }
      search_current_parcels: {
        Args: { search_text: string }
        Returns: {
          owner_address2: string | null
          owner_city: string | null
          owner_name: string | null
          owner_state: string | null
          owner_zip: string | null
          parcel_number: string
          search: string | null
          site_street_name: string | null
          site_street_number: string | null
          site_zip_code: string | null
        }[]
      }
      search_geocoded_addresses_prefix: {
        Args: { p_prefix: string }
        Returns: {
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
          fts_address_line1: unknown | null
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
        }[]
      }
      search_parcels: {
        Args: { active?: boolean; prefix: string }
        Returns: {
          addresses: Json[]
          appraised_total: number
          appraiser: string
          appraiser_email: string
          appraiser_phone: string
          land_use: string
          names: string[]
          neighborhood: string
          parcel: string
          prop_class: string
          retired: string
        }[]
      }
      search_site_address_master: {
        Args: { prefix: string }
        Returns: {
          fts: unknown | null
          house_number: string | null
          id: string
          street_name: string | null
          street_suffix: string | null
          zip_code: string | null
        }[]
      }
      search_site_address_test: {
        Args: { prefix: string; year_input: number }
        Returns: {
          fts: unknown | null
          house_number: string | null
          id: string
          street_name: string | null
          street_suffix: string | null
          zip_code: string | null
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
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
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
      train_sale_price_linear: {
        Args: { in_features: string[]; in_where_clause?: string }
        Returns: {
          coefficient: number
          n: number
          r2: number
          term: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
