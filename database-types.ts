// This file is generated in the supabase dashboard
// and needs to be regenerated after any database change

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      abatement_parcel_year: {
        Row: {
          ag_percent_abated: number | null;
          app_ag_base_value: number | null;
          app_com_base_value: number | null;
          app_res_base_value: number | null;
          com_percent_abated: number | null;
          id: number;
          parcel_number: string | null;
          program_id: number;
          res_percent_abated: number | null;
          year: number | null;
        };
        Insert: {
          ag_percent_abated?: number | null;
          app_ag_base_value?: number | null;
          app_com_base_value?: number | null;
          app_res_base_value?: number | null;
          com_percent_abated?: number | null;
          id?: number;
          parcel_number?: string | null;
          program_id: number;
          res_percent_abated?: number | null;
          year?: number | null;
        };
        Update: {
          ag_percent_abated?: number | null;
          app_ag_base_value?: number | null;
          app_com_base_value?: number | null;
          app_res_base_value?: number | null;
          com_percent_abated?: number | null;
          id?: number;
          parcel_number?: string | null;
          program_id?: number;
          res_percent_abated?: number | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "abatement_parcel_year_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "abatement_programs";
            referencedColumns: ["name_id"];
          },
        ];
      };
      abatement_programs: {
        Row: {
          description: string | null;
          name: string | null;
          name_id: number;
          notes: string | null;
          pa_type: string | null;
          scale_type: string | null;
          year_created: number | null;
          year_expires: number | null;
        };
        Insert: {
          description?: string | null;
          name?: string | null;
          name_id: number;
          notes?: string | null;
          pa_type?: string | null;
          scale_type?: string | null;
          year_created?: number | null;
          year_expires?: number | null;
        };
        Update: {
          description?: string | null;
          name?: string | null;
          name_id?: number;
          notes?: string | null;
          pa_type?: string | null;
          scale_type?: string | null;
          year_created?: number | null;
          year_expires?: number | null;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          address: string | null;
          address_line1: string | null;
          address_line2: string | null;
          bbox: string | null;
          category: string | null;
          city: string | null;
          country: string | null;
          distance: number | null;
          district: string | null;
          footway: string | null;
          formatted: string | null;
          hamlet: string | null;
          housenumber: string | null;
          id: number;
          lat: number | null;
          lon: number | null;
          name: string | null;
          old_name: string | null;
          place_id: string | null;
          postcode: string | null;
          result_type: string | null;
          state: string | null;
          state_code: string | null;
          street: string | null;
          suburb: string | null;
          town: string | null;
          village: string | null;
        };
        Insert: {
          address?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          bbox?: string | null;
          category?: string | null;
          city?: string | null;
          country?: string | null;
          distance?: number | null;
          district?: string | null;
          footway?: string | null;
          formatted?: string | null;
          hamlet?: string | null;
          housenumber?: string | null;
          id?: number;
          lat?: number | null;
          lon?: number | null;
          name?: string | null;
          old_name?: string | null;
          place_id?: string | null;
          postcode?: string | null;
          result_type?: string | null;
          state?: string | null;
          state_code?: string | null;
          street?: string | null;
          suburb?: string | null;
          town?: string | null;
          village?: string | null;
        };
        Update: {
          address?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          bbox?: string | null;
          category?: string | null;
          city?: string | null;
          country?: string | null;
          distance?: number | null;
          district?: string | null;
          footway?: string | null;
          formatted?: string | null;
          hamlet?: string | null;
          housenumber?: string | null;
          id?: number;
          lat?: number | null;
          lon?: number | null;
          name?: string | null;
          old_name?: string | null;
          place_id?: string | null;
          postcode?: string | null;
          result_type?: string | null;
          state?: string | null;
          state_code?: string | null;
          street?: string | null;
          suburb?: string | null;
          town?: string | null;
          village?: string | null;
        };
        Relationships: [];
      };
      appeal_complaint_types: {
        Row: {
          complaint_type: string;
        };
        Insert: {
          complaint_type: string;
        };
        Update: {
          complaint_type?: string;
        };
        Relationships: [];
      };
      appeal_re_appraisers: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      appeal_statuses: {
        Row: {
          status: string;
        };
        Insert: {
          status: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      appeal_types: {
        Row: {
          code: number;
          name: string;
        };
        Insert: {
          code?: number;
          name: string;
        };
        Update: {
          code?: number;
          name?: string;
        };
        Relationships: [];
      };
      appeals: {
        Row: {
          after_bldg: number | null;
          after_land: number | null;
          after_total: number | null;
          appeal_number: number | null;
          appraiser: string | null;
          before_bldg: number | null;
          before_land: number | null;
          before_total: number | null;
          bldg_difference: number | null;
          id: number;
          land_difference: number | null;
          parcel_number: string | null;
          report_date: string | null;
          status_code: string | null;
          total_difference: number | null;
          year: number | null;
        };
        Insert: {
          after_bldg?: number | null;
          after_land?: number | null;
          after_total?: number | null;
          appeal_number?: number | null;
          appraiser?: string | null;
          before_bldg?: number | null;
          before_land?: number | null;
          before_total?: number | null;
          bldg_difference?: number | null;
          id?: number;
          land_difference?: number | null;
          parcel_number?: string | null;
          report_date?: string | null;
          status_code?: string | null;
          total_difference?: number | null;
          year?: number | null;
        };
        Update: {
          after_bldg?: number | null;
          after_land?: number | null;
          after_total?: number | null;
          appeal_number?: number | null;
          appraiser?: string | null;
          before_bldg?: number | null;
          before_land?: number | null;
          before_total?: number | null;
          bldg_difference?: number | null;
          id?: number;
          land_difference?: number | null;
          parcel_number?: string | null;
          report_date?: string | null;
          status_code?: string | null;
          total_difference?: number | null;
          year?: number | null;
        };
        Relationships: [];
      };
      appraiser_appeal_stats: {
        Row: {
          appraiser_id: number;
          count: number | null;
          status: string;
        };
        Insert: {
          appraiser_id: number;
          count?: number | null;
          status: string;
        };
        Update: {
          appraiser_id?: number;
          count?: number | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appraiser_appeal_stats_appraiser_id_fkey";
            columns: ["appraiser_id"];
            isOneToOne: false;
            referencedRelation: "appraisers";
            referencedColumns: ["id"];
          },
        ];
      };
      appraisers: {
        Row: {
          id: number;
          name: string | null;
          supervisor: string | null;
        };
        Insert: {
          id: number;
          name?: string | null;
          supervisor?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
          supervisor?: string | null;
        };
        Relationships: [];
      };
      bps: {
        Row: {
          completion_date: string | null;
          cost: number | null;
          id: number;
          issued_date: string | null;
          parcel_number: string | null;
          permit_type: string | null;
          report_date: string | null;
          request: string | null;
          status: string | null;
          year: number | null;
        };
        Insert: {
          completion_date?: string | null;
          cost?: number | null;
          id?: number;
          issued_date?: string | null;
          parcel_number?: string | null;
          permit_type?: string | null;
          report_date?: string | null;
          request?: string | null;
          status?: string | null;
          year?: number | null;
        };
        Update: {
          completion_date?: string | null;
          cost?: number | null;
          id?: number;
          issued_date?: string | null;
          parcel_number?: string | null;
          permit_type?: string | null;
          report_date?: string | null;
          request?: string | null;
          status?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "bps_parcel_number_fkey";
            columns: ["parcel_number"];
            isOneToOne: false;
            referencedRelation: "parcel_reviews_2025";
            referencedColumns: ["parcel_number"];
          },
        ];
      };
      building_component_value_years: {
        Row: {
          agriculture_value: number;
          building_component_year_id: number | null;
          commercial_value: number;
          id: number;
          residential_value: number;
          type: string | null;
        };
        Insert: {
          agriculture_value?: number;
          building_component_year_id?: number | null;
          commercial_value?: number;
          id?: number;
          residential_value?: number;
          type?: string | null;
        };
        Update: {
          agriculture_value?: number;
          building_component_year_id?: number | null;
          commercial_value?: number;
          id?: number;
          residential_value?: number;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "building_component_value_years_building_component_year_id_fkey";
            columns: ["building_component_year_id"];
            isOneToOne: true;
            referencedRelation: "building_component_years";
            referencedColumns: ["id"];
          },
        ];
      };
      building_component_years: {
        Row: {
          building_component_id: number | null;
          component_area_percentage: number;
          condition: string | null;
          id: number;
          notes: string | null;
          parcel_year_id: number | null;
        };
        Insert: {
          building_component_id?: number | null;
          component_area_percentage?: number;
          condition?: string | null;
          id?: number;
          notes?: string | null;
          parcel_year_id?: number | null;
        };
        Update: {
          building_component_id?: number | null;
          component_area_percentage?: number;
          condition?: string | null;
          id?: number;
          notes?: string | null;
          parcel_year_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "building_component_years_building_component_id_fkey";
            columns: ["building_component_id"];
            isOneToOne: false;
            referencedRelation: "building_components";
            referencedColumns: ["id"];
          },
        ];
      };
      building_components: {
        Row: {
          component_type: string;
          construction_complete_date: string | null;
          construction_material: string | null;
          construction_start_date: string | null;
          demolition_date: string | null;
          id: number;
          is_primary: boolean;
          master_building_id: number | null;
          square_feet: number;
        };
        Insert: {
          component_type: string;
          construction_complete_date?: string | null;
          construction_material?: string | null;
          construction_start_date?: string | null;
          demolition_date?: string | null;
          id?: number;
          is_primary?: boolean;
          master_building_id?: number | null;
          square_feet: number;
        };
        Update: {
          component_type?: string;
          construction_complete_date?: string | null;
          construction_material?: string | null;
          construction_start_date?: string | null;
          demolition_date?: string | null;
          id?: number;
          is_primary?: boolean;
          master_building_id?: number | null;
          square_feet?: number;
        };
        Relationships: [
          {
            foreignKeyName: "building_components_master_building_id_fkey";
            columns: ["master_building_id"];
            isOneToOne: false;
            referencedRelation: "master_buildings";
            referencedColumns: ["id"];
          },
        ];
      };
      cda_codes: {
        Row: {
          code: number;
          name: string | null;
        };
        Insert: {
          code: number;
          name?: string | null;
        };
        Update: {
          code?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      cda_detail: {
        Row: {
          avg_appraised_value_2024_commercial: number | null;
          avg_appraised_value_2024_condo: number | null;
          avg_appraised_value_2024_multi_family: number | null;
          avg_appraised_value_2024_other: number | null;
          avg_appraised_value_2024_single_family: number | null;
          avg_appraised_value_2025_commercial: number | null;
          avg_appraised_value_2025_condo: number | null;
          avg_appraised_value_2025_multi_family: number | null;
          avg_appraised_value_2025_other: number | null;
          avg_appraised_value_2025_single_family: number | null;
          cda: string;
          commercial_percent_change: number | null;
          condo_percent_change: number | null;
          count_2024_commercial: number | null;
          count_2024_condo: number | null;
          count_2024_multi_family: number | null;
          count_2024_other: number | null;
          count_2024_single_family: number | null;
          count_2025_commercial: number | null;
          count_2025_condo: number | null;
          count_2025_multi_family: number | null;
          count_2025_other: number | null;
          count_2025_single_family: number | null;
          multi_family_percent_change: number | null;
          other_percent_change: number | null;
          single_family_percent_change: number | null;
          total_appraised_value_2024_commercial: number | null;
          total_appraised_value_2024_condo: number | null;
          total_appraised_value_2024_multi_family: number | null;
          total_appraised_value_2024_other: number | null;
          total_appraised_value_2024_single_family: number | null;
          total_appraised_value_2025_commercial: number | null;
          total_appraised_value_2025_condo: number | null;
          total_appraised_value_2025_multi_family: number | null;
          total_appraised_value_2025_other: number | null;
          total_appraised_value_2025_single_family: number | null;
        };
        Insert: {
          avg_appraised_value_2024_commercial?: number | null;
          avg_appraised_value_2024_condo?: number | null;
          avg_appraised_value_2024_multi_family?: number | null;
          avg_appraised_value_2024_other?: number | null;
          avg_appraised_value_2024_single_family?: number | null;
          avg_appraised_value_2025_commercial?: number | null;
          avg_appraised_value_2025_condo?: number | null;
          avg_appraised_value_2025_multi_family?: number | null;
          avg_appraised_value_2025_other?: number | null;
          avg_appraised_value_2025_single_family?: number | null;
          cda: string;
          commercial_percent_change?: number | null;
          condo_percent_change?: number | null;
          count_2024_commercial?: number | null;
          count_2024_condo?: number | null;
          count_2024_multi_family?: number | null;
          count_2024_other?: number | null;
          count_2024_single_family?: number | null;
          count_2025_commercial?: number | null;
          count_2025_condo?: number | null;
          count_2025_multi_family?: number | null;
          count_2025_other?: number | null;
          count_2025_single_family?: number | null;
          multi_family_percent_change?: number | null;
          other_percent_change?: number | null;
          single_family_percent_change?: number | null;
          total_appraised_value_2024_commercial?: number | null;
          total_appraised_value_2024_condo?: number | null;
          total_appraised_value_2024_multi_family?: number | null;
          total_appraised_value_2024_other?: number | null;
          total_appraised_value_2024_single_family?: number | null;
          total_appraised_value_2025_commercial?: number | null;
          total_appraised_value_2025_condo?: number | null;
          total_appraised_value_2025_multi_family?: number | null;
          total_appraised_value_2025_other?: number | null;
          total_appraised_value_2025_single_family?: number | null;
        };
        Update: {
          avg_appraised_value_2024_commercial?: number | null;
          avg_appraised_value_2024_condo?: number | null;
          avg_appraised_value_2024_multi_family?: number | null;
          avg_appraised_value_2024_other?: number | null;
          avg_appraised_value_2024_single_family?: number | null;
          avg_appraised_value_2025_commercial?: number | null;
          avg_appraised_value_2025_condo?: number | null;
          avg_appraised_value_2025_multi_family?: number | null;
          avg_appraised_value_2025_other?: number | null;
          avg_appraised_value_2025_single_family?: number | null;
          cda?: string;
          commercial_percent_change?: number | null;
          condo_percent_change?: number | null;
          count_2024_commercial?: number | null;
          count_2024_condo?: number | null;
          count_2024_multi_family?: number | null;
          count_2024_other?: number | null;
          count_2024_single_family?: number | null;
          count_2025_commercial?: number | null;
          count_2025_condo?: number | null;
          count_2025_multi_family?: number | null;
          count_2025_other?: number | null;
          count_2025_single_family?: number | null;
          multi_family_percent_change?: number | null;
          other_percent_change?: number | null;
          single_family_percent_change?: number | null;
          total_appraised_value_2024_commercial?: number | null;
          total_appraised_value_2024_condo?: number | null;
          total_appraised_value_2024_multi_family?: number | null;
          total_appraised_value_2024_other?: number | null;
          total_appraised_value_2024_single_family?: number | null;
          total_appraised_value_2025_commercial?: number | null;
          total_appraised_value_2025_condo?: number | null;
          total_appraised_value_2025_multi_family?: number | null;
          total_appraised_value_2025_other?: number | null;
          total_appraised_value_2025_single_family?: number | null;
        };
        Relationships: [];
      };
      cda_summary: {
        Row: {
          cda: string;
          other_2024: number | null;
          other_2025: number | null;
          residential_2024: number | null;
          residential_2025: number | null;
          total_2024: number | null;
          total_2025: number | null;
          total_percent_change: number | null;
        };
        Insert: {
          cda: string;
          other_2024?: number | null;
          other_2025?: number | null;
          residential_2024?: number | null;
          residential_2025?: number | null;
          total_2024?: number | null;
          total_2025?: number | null;
          total_percent_change?: number | null;
        };
        Update: {
          cda?: string;
          other_2024?: number | null;
          other_2025?: number | null;
          residential_2024?: number | null;
          residential_2025?: number | null;
          total_2024?: number | null;
          total_2025?: number | null;
          total_percent_change?: number | null;
        };
        Relationships: [];
      };
      compare_appraised_total_results: {
        Row: {
          appraiser_id: number | null;
          difference: number | null;
          end_total: number | null;
          land_use: string | null;
          neighborhood: string | null;
          neighborhood_int: number | null;
          occupancy: string | null;
          parcel_number: string | null;
          pct_change: number | null;
          prefix_directional: string | null;
          prop_class: string | null;
          site_street_name: string | null;
          site_street_number: string | null;
          site_zip_code: string | null;
          start_total: number | null;
          tax_status: string | null;
        };
        Insert: {
          appraiser_id?: number | null;
          difference?: number | null;
          end_total?: number | null;
          land_use?: string | null;
          neighborhood?: string | null;
          neighborhood_int?: number | null;
          occupancy?: string | null;
          parcel_number?: string | null;
          pct_change?: number | null;
          prefix_directional?: string | null;
          prop_class?: string | null;
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
          start_total?: number | null;
          tax_status?: string | null;
        };
        Update: {
          appraiser_id?: number | null;
          difference?: number | null;
          end_total?: number | null;
          land_use?: string | null;
          neighborhood?: string | null;
          neighborhood_int?: number | null;
          occupancy?: string | null;
          parcel_number?: string | null;
          pct_change?: number | null;
          prefix_directional?: string | null;
          prop_class?: string | null;
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
          start_total?: number | null;
          tax_status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "compare_appraised_total_results_appraiser_id_fkey";
            columns: ["appraiser_id"];
            isOneToOne: false;
            referencedRelation: "appraisers";
            referencedColumns: ["id"];
          },
        ];
      };
      current_structures: {
        Row: {
          cdu: string | null;
          cost_group: number | null;
          ea: number | null;
          gla: number | null;
          grade: string | null;
          id: number;
          parcel_number: string | null;
          story: number | null;
          total_area: number | null;
          year_built: number | null;
        };
        Insert: {
          cdu?: string | null;
          cost_group?: number | null;
          ea?: number | null;
          gla?: number | null;
          grade?: string | null;
          id?: number;
          parcel_number?: string | null;
          story?: number | null;
          total_area?: number | null;
          year_built?: number | null;
        };
        Update: {
          cdu?: string | null;
          cost_group?: number | null;
          ea?: number | null;
          gla?: number | null;
          grade?: string | null;
          id?: number;
          parcel_number?: string | null;
          story?: number | null;
          total_area?: number | null;
          year_built?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "current_structures_parcel_number_fkey";
            columns: ["parcel_number"];
            isOneToOne: false;
            referencedRelation: "parcel_reviews_2025";
            referencedColumns: ["parcel_number"];
          },
        ];
      };
      fires: {
        Row: {
          fd_apartment: string | null;
          fd_distict: string | null;
          fd_incident: string | null;
          fd_station: string | null;
          fd_street_name: string | null;
          fd_street_number: string | null;
          fd_street_prefix: string | null;
          fd_time: string | null;
          fd_zip: string | null;
          id: number;
          parcel_number: string | null;
        };
        Insert: {
          fd_apartment?: string | null;
          fd_distict?: string | null;
          fd_incident?: string | null;
          fd_station?: string | null;
          fd_street_name?: string | null;
          fd_street_number?: string | null;
          fd_street_prefix?: string | null;
          fd_time?: string | null;
          fd_zip?: string | null;
          id?: number;
          parcel_number?: string | null;
        };
        Update: {
          fd_apartment?: string | null;
          fd_distict?: string | null;
          fd_incident?: string | null;
          fd_station?: string | null;
          fd_street_name?: string | null;
          fd_street_number?: string | null;
          fd_street_prefix?: string | null;
          fd_time?: string | null;
          fd_zip?: string | null;
          id?: number;
          parcel_number?: string | null;
        };
        Relationships: [];
      };
      land_use_codes: {
        Row: {
          code: number;
          name: string | null;
        };
        Insert: {
          code: number;
          name?: string | null;
        };
        Update: {
          code?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      master_buildings: {
        Row: {
          construction_complete_date: string | null;
          construction_start_date: string | null;
          demolition_date: string | null;
          id: number;
          name: string;
          year_built: number | null;
        };
        Insert: {
          construction_complete_date?: string | null;
          construction_start_date?: string | null;
          demolition_date?: string | null;
          id?: number;
          name: string;
          year_built?: number | null;
        };
        Update: {
          construction_complete_date?: string | null;
          construction_start_date?: string | null;
          demolition_date?: string | null;
          id?: number;
          name?: string;
          year_built?: number | null;
        };
        Relationships: [];
      };
      neighborhoods: {
        Row: {
          group: number;
          neighborhood: number;
          polygon: Json[] | null;
        };
        Insert: {
          group: number;
          neighborhood?: number;
          polygon?: Json[] | null;
        };
        Update: {
          group?: number;
          neighborhood?: number;
          polygon?: Json[] | null;
        };
        Relationships: [];
      };
      owner_address: {
        Row: {
          address_1: string | null;
          address_2: string | null;
          city: string | null;
          id: string;
          name_id: string;
          state: string | null;
          zip: string | null;
        };
        Insert: {
          address_1?: string | null;
          address_2?: string | null;
          city?: string | null;
          id: string;
          name_id: string;
          state?: string | null;
          zip?: string | null;
        };
        Update: {
          address_1?: string | null;
          address_2?: string | null;
          city?: string | null;
          id?: string;
          name_id?: string;
          state?: string | null;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "owner_address_name_id_fkey";
            columns: ["name_id"];
            isOneToOne: false;
            referencedRelation: "owner_name";
            referencedColumns: ["id"];
          },
        ];
      };
      owner_name: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      parcel_geometries: {
        Row: {
          geometry: Json | null;
          handle: string;
          parcel: string | null;
        };
        Insert: {
          geometry?: Json | null;
          handle: string;
          parcel?: string | null;
        };
        Update: {
          geometry?: Json | null;
          handle?: string;
          parcel?: string | null;
        };
        Relationships: [];
      };
      parcel_master: {
        Row: {
          created_at: string | null;
          parcel_number: string;
          retired_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          parcel_number: string;
          retired_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          parcel_number?: string;
          retired_at?: string | null;
        };
        Relationships: [];
      };
      parcel_review_abatements: {
        Row: {
          abate_description: string | null;
          abate_notes: string | null;
          id: number;
          name: string | null;
          parcel_number: string | null;
          year_created: number | null;
          year_expires: number | null;
        };
        Insert: {
          abate_description?: string | null;
          abate_notes?: string | null;
          id?: number;
          name?: string | null;
          parcel_number?: string | null;
          year_created?: number | null;
          year_expires?: number | null;
        };
        Update: {
          abate_description?: string | null;
          abate_notes?: string | null;
          id?: number;
          name?: string | null;
          parcel_number?: string | null;
          year_created?: number | null;
          year_expires?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_review_abatements_parcel_number_fkey";
            columns: ["parcel_number"];
            isOneToOne: false;
            referencedRelation: "parcel_reviews_2025";
            referencedColumns: ["parcel_number"];
          },
        ];
      };
      parcel_review_appeals: {
        Row: {
          after_bldg: number | null;
          after_land: number | null;
          after_total: number | null;
          appeal_appraiser: string | null;
          appeal_number: number;
          appeal_type: string | null;
          appraiser_id: number | null;
          before_bldg: number | null;
          before_land: number | null;
          before_total: number | null;
          bldg_difference: number | null;
          complaint_type: string | null;
          filed_ts: string | null;
          hearing_ts: string | null;
          land_difference: number | null;
          parcel_number: string;
          report_date_hearing_status: string | null;
          report_date_sequence: string | null;
          status: string | null;
          total_difference: number | null;
          year: number | null;
        };
        Insert: {
          after_bldg?: number | null;
          after_land?: number | null;
          after_total?: number | null;
          appeal_appraiser?: string | null;
          appeal_number: number;
          appeal_type?: string | null;
          appraiser_id?: number | null;
          before_bldg?: number | null;
          before_land?: number | null;
          before_total?: number | null;
          bldg_difference?: number | null;
          complaint_type?: string | null;
          filed_ts?: string | null;
          hearing_ts?: string | null;
          land_difference?: number | null;
          parcel_number: string;
          report_date_hearing_status?: string | null;
          report_date_sequence?: string | null;
          status?: string | null;
          total_difference?: number | null;
          year?: number | null;
        };
        Update: {
          after_bldg?: number | null;
          after_land?: number | null;
          after_total?: number | null;
          appeal_appraiser?: string | null;
          appeal_number?: number;
          appeal_type?: string | null;
          appraiser_id?: number | null;
          before_bldg?: number | null;
          before_land?: number | null;
          before_total?: number | null;
          bldg_difference?: number | null;
          complaint_type?: string | null;
          filed_ts?: string | null;
          hearing_ts?: string | null;
          land_difference?: number | null;
          parcel_number?: string;
          report_date_hearing_status?: string | null;
          report_date_sequence?: string | null;
          status?: string | null;
          total_difference?: number | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_review_appeals_appraiser_id_fkey";
            columns: ["appraiser_id"];
            isOneToOne: false;
            referencedRelation: "appraisers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parcel_review_appeals_parcel_number_fkey";
            columns: ["parcel_number"];
            isOneToOne: false;
            referencedRelation: "parcel_reviews_2025";
            referencedColumns: ["parcel_number"];
          },
        ];
      };
      parcel_review_sales: {
        Row: {
          date_of_sale: string | null;
          document_number: string | null;
          field_review_date: string | null;
          id: number;
          net_selling_price: number | null;
          parcel_number: string | null;
          report_date: string | null;
          sale_type: string | null;
          sale_year: number | null;
          year: number | null;
        };
        Insert: {
          date_of_sale?: string | null;
          document_number?: string | null;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          parcel_number?: string | null;
          report_date?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
          year?: number | null;
        };
        Update: {
          date_of_sale?: string | null;
          document_number?: string | null;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          parcel_number?: string | null;
          report_date?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_review_sales_parcel_number_fkey";
            columns: ["parcel_number"];
            isOneToOne: false;
            referencedRelation: "parcel_reviews_2025";
            referencedColumns: ["parcel_number"];
          },
        ];
      };
      parcel_reviews_2025: {
        Row: {
          appraised_total_2024: number | null;
          appraised_total_2025: number | null;
          appraiser_id: number | null;
          current_value_difference: number | null;
          data_collection: string | null;
          difference: number | null;
          field_reviewed: string | null;
          fire_time: string | null;
          geometry: Json | null;
          neighborhood: string | null;
          neighborhood_int: number | null;
          occupancy: string | null;
          owner_address1: string | null;
          owner_address2: string | null;
          owner_city: string | null;
          owner_name: string | null;
          owner_state: string | null;
          owner_zip: string | null;
          parcel_number: string;
          percent_change: number | null;
          prefix_directional: string | null;
          prop_class: string | null;
          site_street_name: string | null;
          site_street_number: string | null;
          site_zip_code: string | null;
          tax_status: string | null;
          working_appraised_total_2025: number | null;
          working_difference: number | null;
          working_percent_change: number | null;
        };
        Insert: {
          appraised_total_2024?: number | null;
          appraised_total_2025?: number | null;
          appraiser_id?: number | null;
          current_value_difference?: number | null;
          data_collection?: string | null;
          difference?: number | null;
          field_reviewed?: string | null;
          fire_time?: string | null;
          geometry?: Json | null;
          neighborhood?: string | null;
          neighborhood_int?: number | null;
          occupancy?: string | null;
          owner_address1?: string | null;
          owner_address2?: string | null;
          owner_city?: string | null;
          owner_name?: string | null;
          owner_state?: string | null;
          owner_zip?: string | null;
          parcel_number: string;
          percent_change?: number | null;
          prefix_directional?: string | null;
          prop_class?: string | null;
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
          tax_status?: string | null;
          working_appraised_total_2025?: number | null;
          working_difference?: number | null;
          working_percent_change?: number | null;
        };
        Update: {
          appraised_total_2024?: number | null;
          appraised_total_2025?: number | null;
          appraiser_id?: number | null;
          current_value_difference?: number | null;
          data_collection?: string | null;
          difference?: number | null;
          field_reviewed?: string | null;
          fire_time?: string | null;
          geometry?: Json | null;
          neighborhood?: string | null;
          neighborhood_int?: number | null;
          occupancy?: string | null;
          owner_address1?: string | null;
          owner_address2?: string | null;
          owner_city?: string | null;
          owner_name?: string | null;
          owner_state?: string | null;
          owner_zip?: string | null;
          parcel_number?: string;
          percent_change?: number | null;
          prefix_directional?: string | null;
          prop_class?: string | null;
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
          tax_status?: string | null;
          working_appraised_total_2025?: number | null;
          working_difference?: number | null;
          working_percent_change?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_reviews_2025_appraiser_id_fkey";
            columns: ["appraiser_id"];
            isOneToOne: false;
            referencedRelation: "appraisers";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_sales: {
        Row: {
          parcel_number: string;
          sales_master_id: number;
        };
        Insert: {
          parcel_number: string;
          sales_master_id: number;
        };
        Update: {
          parcel_number?: string;
          sales_master_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_sales_sales_master_id_fkey";
            columns: ["sales_master_id"];
            isOneToOne: false;
            referencedRelation: "sales_master";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_year: {
        Row: {
          agr_bldg: number | null;
          agr_bldg_assess: number | null;
          agr_land: number | null;
          agr_land_assess: number | null;
          agr_new_const: number | null;
          agr_new_const_assess: number | null;
          appraised_total: number | null;
          appraiser_id: number | null;
          area: number | null;
          assessed_total: number | null;
          com_bldg: number | null;
          com_bldg_assess: number | null;
          com_land: number | null;
          com_land_assess: number | null;
          com_new_const: number | null;
          com_new_const_assess: number | null;
          dist_city: string | null;
          dist_college: string | null;
          dist_school: string | null;
          dist_tif: string | null;
          land_use: string | null;
          neighborhood: string | null;
          occupancy: string | null;
          parcel_number: string | null;
          prop_class: string | null;
          report_timestamp: string | null;
          res_acres: number | null;
          res_bldg: number | null;
          res_bldg_assess: number | null;
          res_land: number | null;
          res_land_assess: number | null;
          res_new_const: number | null;
          res_new_const_assess: number | null;
          section: string | null;
          tax_status: string | null;
          taxcode: string | null;
          use_code: string | null;
          working_improve_value: number | null;
          working_land_value: number | null;
          working_total_value: number | null;
          year: number | null;
        };
        Insert: {
          agr_bldg?: number | null;
          agr_bldg_assess?: number | null;
          agr_land?: number | null;
          agr_land_assess?: number | null;
          agr_new_const?: number | null;
          agr_new_const_assess?: number | null;
          appraised_total?: number | null;
          appraiser_id?: number | null;
          area?: number | null;
          assessed_total?: number | null;
          com_bldg?: number | null;
          com_bldg_assess?: number | null;
          com_land?: number | null;
          com_land_assess?: number | null;
          com_new_const?: number | null;
          com_new_const_assess?: number | null;
          dist_city?: string | null;
          dist_college?: string | null;
          dist_school?: string | null;
          dist_tif?: string | null;
          land_use?: string | null;
          neighborhood?: string | null;
          occupancy?: string | null;
          parcel_number?: string | null;
          prop_class?: string | null;
          report_timestamp?: string | null;
          res_acres?: number | null;
          res_bldg?: number | null;
          res_bldg_assess?: number | null;
          res_land?: number | null;
          res_land_assess?: number | null;
          res_new_const?: number | null;
          res_new_const_assess?: number | null;
          section?: string | null;
          tax_status?: string | null;
          taxcode?: string | null;
          use_code?: string | null;
          working_improve_value?: number | null;
          working_land_value?: number | null;
          working_total_value?: number | null;
          year?: number | null;
        };
        Update: {
          agr_bldg?: number | null;
          agr_bldg_assess?: number | null;
          agr_land?: number | null;
          agr_land_assess?: number | null;
          agr_new_const?: number | null;
          agr_new_const_assess?: number | null;
          appraised_total?: number | null;
          appraiser_id?: number | null;
          area?: number | null;
          assessed_total?: number | null;
          com_bldg?: number | null;
          com_bldg_assess?: number | null;
          com_land?: number | null;
          com_land_assess?: number | null;
          com_new_const?: number | null;
          com_new_const_assess?: number | null;
          dist_city?: string | null;
          dist_college?: string | null;
          dist_school?: string | null;
          dist_tif?: string | null;
          land_use?: string | null;
          neighborhood?: string | null;
          occupancy?: string | null;
          parcel_number?: string | null;
          prop_class?: string | null;
          report_timestamp?: string | null;
          res_acres?: number | null;
          res_bldg?: number | null;
          res_bldg_assess?: number | null;
          res_land?: number | null;
          res_land_assess?: number | null;
          res_new_const?: number | null;
          res_new_const_assess?: number | null;
          section?: string | null;
          tax_status?: string | null;
          taxcode?: string | null;
          use_code?: string | null;
          working_improve_value?: number | null;
          working_land_value?: number | null;
          working_total_value?: number | null;
          year?: number | null;
        };
        Relationships: [];
      };
      prcl: {
        Row: {
          abatementendyear: number | null;
          abatementstartyear: number | null;
          abatementtype: string | null;
          apragrimprove: number | null;
          apragrland: number | null;
          aprcomimprove: number | null;
          aprcomland: number | null;
          aprexemptimprove: number | null;
          aprexemptland: number | null;
          aprland: number | null;
          aprresimprove: number | null;
          aprresland: number | null;
          asdagrimprove: number | null;
          asdagrland: number | null;
          asdcomimprove: number | null;
          asdcomland: number | null;
          asdresimprove: number | null;
          asdresland: number | null;
          asdtotal: number | null;
          asmtappealnum: number | null;
          asmtappealtype: string | null;
          asmtappealyear: number | null;
          asrclasscode: number | null;
          asrlanduse1: string | null;
          asrnbrhd: number | null;
          asrparcelid: number;
          cdalanduse1: string | null;
          condominium: boolean | null;
          highaddrnum: number | null;
          isabatedproperty: boolean | null;
          landarea: number | null;
          lowaddrnum: number | null;
          nbrhd: number | null;
          nbrofapts: number | null;
          nbrofbldgscom: number | null;
          nbrofbldgsres: number | null;
          nbrofunits: number | null;
          ownername: string | null;
          precinct20: number | null;
          propertyclasscode: number | null;
          redevphase: string | null;
          redevphase2: string | null;
          redevyearend: number | null;
          redevyearend2: number | null;
          specbusdist: string | null;
          stname: string | null;
          stpredir: string | null;
          sttype: string | null;
          tifdist: string | null;
          vacantlot: boolean | null;
          ward20: number | null;
          zip: string | null;
          zoning: string | null;
        };
        Insert: {
          abatementendyear?: number | null;
          abatementstartyear?: number | null;
          abatementtype?: string | null;
          apragrimprove?: number | null;
          apragrland?: number | null;
          aprcomimprove?: number | null;
          aprcomland?: number | null;
          aprexemptimprove?: number | null;
          aprexemptland?: number | null;
          aprland?: number | null;
          aprresimprove?: number | null;
          aprresland?: number | null;
          asdagrimprove?: number | null;
          asdagrland?: number | null;
          asdcomimprove?: number | null;
          asdcomland?: number | null;
          asdresimprove?: number | null;
          asdresland?: number | null;
          asdtotal?: number | null;
          asmtappealnum?: number | null;
          asmtappealtype?: string | null;
          asmtappealyear?: number | null;
          asrclasscode?: number | null;
          asrlanduse1?: string | null;
          asrnbrhd?: number | null;
          asrparcelid: number;
          cdalanduse1?: string | null;
          condominium?: boolean | null;
          highaddrnum?: number | null;
          isabatedproperty?: boolean | null;
          landarea?: number | null;
          lowaddrnum?: number | null;
          nbrhd?: number | null;
          nbrofapts?: number | null;
          nbrofbldgscom?: number | null;
          nbrofbldgsres?: number | null;
          nbrofunits?: number | null;
          ownername?: string | null;
          precinct20?: number | null;
          propertyclasscode?: number | null;
          redevphase?: string | null;
          redevphase2?: string | null;
          redevyearend?: number | null;
          redevyearend2?: number | null;
          specbusdist?: string | null;
          stname?: string | null;
          stpredir?: string | null;
          sttype?: string | null;
          tifdist?: string | null;
          vacantlot?: boolean | null;
          ward20?: number | null;
          zip?: string | null;
          zoning?: string | null;
        };
        Update: {
          abatementendyear?: number | null;
          abatementstartyear?: number | null;
          abatementtype?: string | null;
          apragrimprove?: number | null;
          apragrland?: number | null;
          aprcomimprove?: number | null;
          aprcomland?: number | null;
          aprexemptimprove?: number | null;
          aprexemptland?: number | null;
          aprland?: number | null;
          aprresimprove?: number | null;
          aprresland?: number | null;
          asdagrimprove?: number | null;
          asdagrland?: number | null;
          asdcomimprove?: number | null;
          asdcomland?: number | null;
          asdresimprove?: number | null;
          asdresland?: number | null;
          asdtotal?: number | null;
          asmtappealnum?: number | null;
          asmtappealtype?: string | null;
          asmtappealyear?: number | null;
          asrclasscode?: number | null;
          asrlanduse1?: string | null;
          asrnbrhd?: number | null;
          asrparcelid?: number;
          cdalanduse1?: string | null;
          condominium?: boolean | null;
          highaddrnum?: number | null;
          isabatedproperty?: boolean | null;
          landarea?: number | null;
          lowaddrnum?: number | null;
          nbrhd?: number | null;
          nbrofapts?: number | null;
          nbrofbldgscom?: number | null;
          nbrofbldgsres?: number | null;
          nbrofunits?: number | null;
          ownername?: string | null;
          precinct20?: number | null;
          propertyclasscode?: number | null;
          redevphase?: string | null;
          redevphase2?: string | null;
          redevyearend?: number | null;
          redevyearend2?: number | null;
          specbusdist?: string | null;
          stname?: string | null;
          stpredir?: string | null;
          sttype?: string | null;
          tifdist?: string | null;
          vacantlot?: boolean | null;
          ward20?: number | null;
          zip?: string | null;
          zoning?: string | null;
        };
        Relationships: [];
      };
      report_dates: {
        Row: {
          id: number;
          report_date: string | null;
          source: string | null;
          year: number | null;
        };
        Insert: {
          id?: number;
          report_date?: string | null;
          source?: string | null;
          year?: number | null;
        };
        Update: {
          id?: number;
          report_date?: string | null;
          source?: string | null;
          year?: number | null;
        };
        Relationships: [];
      };
      report_info: {
        Row: {
          column_name: string | null;
          id: number;
          table_name: string | null;
        };
        Insert: {
          column_name?: string | null;
          id?: number;
          table_name?: string | null;
        };
        Update: {
          column_name?: string | null;
          id?: number;
          table_name?: string | null;
        };
        Relationships: [];
      };
      res_structures: {
        Row: {
          actual_value: number | null;
          additions: number | null;
          adjustments: number | null;
          base_fctr_ttl: number | null;
          base_value: number | null;
          cdu_adjustment_cndtn: string | null;
          condition: string | null;
          eff_year_build: number | null;
          grade_fctr_qlty: string | null;
          id: number;
          land_value: number | null;
          multiplier_fctr: number | null;
          multiplier_value: number | null;
          neighborhood_code: string | null;
          oby_rcn_value: number | null;
          oby_rcnld_value: number | null;
          occupancy: number | null;
          override_value: number | null;
          parcel_number: string | null;
          property_group: number | null;
          prorated_value: number | null;
          quality: string | null;
          report_date: string | null;
          struct_rcn_value: number | null;
          struct_rcnld_value: number | null;
          structure_name: string | null;
          year: number | null;
          year_built: number | null;
        };
        Insert: {
          actual_value?: number | null;
          additions?: number | null;
          adjustments?: number | null;
          base_fctr_ttl?: number | null;
          base_value?: number | null;
          cdu_adjustment_cndtn?: string | null;
          condition?: string | null;
          eff_year_build?: number | null;
          grade_fctr_qlty?: string | null;
          id?: number;
          land_value?: number | null;
          multiplier_fctr?: number | null;
          multiplier_value?: number | null;
          neighborhood_code?: string | null;
          oby_rcn_value?: number | null;
          oby_rcnld_value?: number | null;
          occupancy?: number | null;
          override_value?: number | null;
          parcel_number?: string | null;
          property_group?: number | null;
          prorated_value?: number | null;
          quality?: string | null;
          report_date?: string | null;
          struct_rcn_value?: number | null;
          struct_rcnld_value?: number | null;
          structure_name?: string | null;
          year?: number | null;
          year_built?: number | null;
        };
        Update: {
          actual_value?: number | null;
          additions?: number | null;
          adjustments?: number | null;
          base_fctr_ttl?: number | null;
          base_value?: number | null;
          cdu_adjustment_cndtn?: string | null;
          condition?: string | null;
          eff_year_build?: number | null;
          grade_fctr_qlty?: string | null;
          id?: number;
          land_value?: number | null;
          multiplier_fctr?: number | null;
          multiplier_value?: number | null;
          neighborhood_code?: string | null;
          oby_rcn_value?: number | null;
          oby_rcnld_value?: number | null;
          occupancy?: number | null;
          override_value?: number | null;
          parcel_number?: string | null;
          property_group?: number | null;
          prorated_value?: number | null;
          quality?: string | null;
          report_date?: string | null;
          struct_rcn_value?: number | null;
          struct_rcnld_value?: number | null;
          structure_name?: string | null;
          year?: number | null;
          year_built?: number | null;
        };
        Relationships: [];
      };
      sales: {
        Row: {
          date_of_sale: string | null;
          document_number: number | null;
          field_review_date: string | null;
          id: number;
          net_selling_price: number | null;
          parcel_number: string | null;
          report_date: string | null;
          sale_type: string | null;
          sale_year: number | null;
          year: number | null;
        };
        Insert: {
          date_of_sale?: string | null;
          document_number?: number | null;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          parcel_number?: string | null;
          report_date?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
          year?: number | null;
        };
        Update: {
          date_of_sale?: string | null;
          document_number?: number | null;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          parcel_number?: string | null;
          report_date?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
          year?: number | null;
        };
        Relationships: [];
      };
      sales_master: {
        Row: {
          date_of_sale: string | null;
          document_number: number;
          field_review_date: string | null;
          id: number;
          net_selling_price: number | null;
          report_date: string | null;
          sale_type: string | null;
          sale_year: number | null;
        };
        Insert: {
          date_of_sale?: string | null;
          document_number: number;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          report_date?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
        };
        Update: {
          date_of_sale?: string | null;
          document_number?: number;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          report_date?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
        };
        Relationships: [];
      };
      search_table: {
        Row: {
          owner_address2: string | null;
          owner_city: string | null;
          owner_name: string | null;
          owner_state: string | null;
          owner_zip: string | null;
          parcel_number: string;
          search: string | null;
          site_street_name: string | null;
          site_street_number: string | null;
          site_zip_code: string | null;
        };
        Insert: {
          owner_address2?: string | null;
          owner_city?: string | null;
          owner_name?: string | null;
          owner_state?: string | null;
          owner_zip?: string | null;
          parcel_number: string;
          search?: string | null;
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
        };
        Update: {
          owner_address2?: string | null;
          owner_city?: string | null;
          owner_name?: string | null;
          owner_state?: string | null;
          owner_zip?: string | null;
          parcel_number?: string;
          search?: string | null;
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
        };
        Relationships: [];
      };
      search_table_2: {
        Row: {
          address_id: string | null;
          house_number: string | null;
          id: number;
          name: string | null;
          parcel_number: string | null;
          search_text: string | null;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        };
        Insert: {
          address_id?: string | null;
          house_number?: string | null;
          id?: number;
          name?: string | null;
          parcel_number?: string | null;
          search_text?: string | null;
          street_name?: string | null;
          street_suffix?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address_id?: string | null;
          house_number?: string | null;
          id?: number;
          name?: string | null;
          parcel_number?: string | null;
          search_text?: string | null;
          street_name?: string | null;
          street_suffix?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      senior_tax_credits: {
        Row: {
          approval_letter_printed_timestamp: string | null;
          parcel_number: string;
          status: string;
          submission_type: string | null;
          year: number | null;
        };
        Insert: {
          approval_letter_printed_timestamp?: string | null;
          parcel_number: string;
          status: string;
          submission_type?: string | null;
          year?: number | null;
        };
        Update: {
          approval_letter_printed_timestamp?: string | null;
          parcel_number?: string;
          status?: string;
          submission_type?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "senior_tax_credits_parcel_number_fkey";
            columns: ["parcel_number"];
            isOneToOne: true;
            referencedRelation: "parcel_reviews_2025";
            referencedColumns: ["parcel_number"];
          },
        ];
      };
      site_address_master: {
        Row: {
          house_number: string | null;
          id: string;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        };
        Insert: {
          house_number?: string | null;
          id: string;
          street_name?: string | null;
          street_suffix?: string | null;
          zip_code?: string | null;
        };
        Update: {
          house_number?: string | null;
          id?: string;
          street_name?: string | null;
          street_suffix?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      site_address_parcel_year: {
        Row: {
          address_id: string;
          is_primary: boolean | null;
          location: string | null;
          parcel_number: string;
          year: number;
        };
        Insert: {
          address_id: string;
          is_primary?: boolean | null;
          location?: string | null;
          parcel_number: string;
          year: number;
        };
        Update: {
          address_id?: string;
          is_primary?: boolean | null;
          location?: string | null;
          parcel_number?: string;
          year?: number;
        };
        Relationships: [];
      };
      site_addresses: {
        Row: {
          parcel_number: string | null;
          site_address_1: string | null;
        };
        Insert: {
          parcel_number?: string | null;
          site_address_1?: string | null;
        };
        Update: {
          parcel_number?: string | null;
          site_address_1?: string | null;
        };
        Relationships: [];
      };
      spec_bus_dist_codes: {
        Row: {
          code: number;
          name: string;
        };
        Insert: {
          code?: number;
          name: string;
        };
        Update: {
          code?: number;
          name?: string;
        };
        Relationships: [];
      };
      structures: {
        Row: {
          id: number;
          parcel_number: string | null;
          square_feet: number | null;
          structure_name: string | null;
          year_built: number | null;
        };
        Insert: {
          id?: number;
          parcel_number?: string | null;
          square_feet?: number | null;
          structure_name?: string | null;
          year_built?: number | null;
        };
        Update: {
          id?: number;
          parcel_number?: string | null;
          square_feet?: number | null;
          structure_name?: string | null;
          year_built?: number | null;
        };
        Relationships: [];
      };
      tif_district_codes: {
        Row: {
          code: number;
          devnet_code: number | null;
          end_year: number | null;
          name: string | null;
          start_year: number | null;
        };
        Insert: {
          code: number;
          devnet_code?: number | null;
          end_year?: number | null;
          name?: string | null;
          start_year?: number | null;
        };
        Update: {
          code?: number;
          devnet_code?: number | null;
          end_year?: number | null;
          name?: string | null;
          start_year?: number | null;
        };
        Relationships: [];
      };
      wards_detail: {
        Row: {
          avg_appraised_value_2024_commercial: number | null;
          avg_appraised_value_2024_condo: number | null;
          avg_appraised_value_2024_multi_family: number | null;
          avg_appraised_value_2024_other: number | null;
          avg_appraised_value_2024_single_family: number | null;
          avg_appraised_value_2025_commercial: number | null;
          avg_appraised_value_2025_condo: number | null;
          avg_appraised_value_2025_multi_family: number | null;
          avg_appraised_value_2025_other: number | null;
          avg_appraised_value_2025_single_family: number | null;
          commercial_percent_change: number | null;
          condo_percent_change: number | null;
          count_2024_commercial: number | null;
          count_2024_condo: number | null;
          count_2024_multi_family: number | null;
          count_2024_other: number | null;
          count_2024_single_family: number | null;
          count_2025_commercial: number | null;
          count_2025_condo: number | null;
          count_2025_multi_family: number | null;
          count_2025_other: number | null;
          count_2025_single_family: number | null;
          multi_family_percent_change: number | null;
          other_percent_change: number | null;
          single_family_percent_change: number | null;
          total_appraised_value_2024_commercial: number | null;
          total_appraised_value_2024_condo: number | null;
          total_appraised_value_2024_multi_family: number | null;
          total_appraised_value_2024_other: number | null;
          total_appraised_value_2024_single_family: number | null;
          total_appraised_value_2025_commercial: number | null;
          total_appraised_value_2025_condo: number | null;
          total_appraised_value_2025_multi_family: number | null;
          total_appraised_value_2025_other: number | null;
          total_appraised_value_2025_single_family: number | null;
          ward: number;
        };
        Insert: {
          avg_appraised_value_2024_commercial?: number | null;
          avg_appraised_value_2024_condo?: number | null;
          avg_appraised_value_2024_multi_family?: number | null;
          avg_appraised_value_2024_other?: number | null;
          avg_appraised_value_2024_single_family?: number | null;
          avg_appraised_value_2025_commercial?: number | null;
          avg_appraised_value_2025_condo?: number | null;
          avg_appraised_value_2025_multi_family?: number | null;
          avg_appraised_value_2025_other?: number | null;
          avg_appraised_value_2025_single_family?: number | null;
          commercial_percent_change?: number | null;
          condo_percent_change?: number | null;
          count_2024_commercial?: number | null;
          count_2024_condo?: number | null;
          count_2024_multi_family?: number | null;
          count_2024_other?: number | null;
          count_2024_single_family?: number | null;
          count_2025_commercial?: number | null;
          count_2025_condo?: number | null;
          count_2025_multi_family?: number | null;
          count_2025_other?: number | null;
          count_2025_single_family?: number | null;
          multi_family_percent_change?: number | null;
          other_percent_change?: number | null;
          single_family_percent_change?: number | null;
          total_appraised_value_2024_commercial?: number | null;
          total_appraised_value_2024_condo?: number | null;
          total_appraised_value_2024_multi_family?: number | null;
          total_appraised_value_2024_other?: number | null;
          total_appraised_value_2024_single_family?: number | null;
          total_appraised_value_2025_commercial?: number | null;
          total_appraised_value_2025_condo?: number | null;
          total_appraised_value_2025_multi_family?: number | null;
          total_appraised_value_2025_other?: number | null;
          total_appraised_value_2025_single_family?: number | null;
          ward: number;
        };
        Update: {
          avg_appraised_value_2024_commercial?: number | null;
          avg_appraised_value_2024_condo?: number | null;
          avg_appraised_value_2024_multi_family?: number | null;
          avg_appraised_value_2024_other?: number | null;
          avg_appraised_value_2024_single_family?: number | null;
          avg_appraised_value_2025_commercial?: number | null;
          avg_appraised_value_2025_condo?: number | null;
          avg_appraised_value_2025_multi_family?: number | null;
          avg_appraised_value_2025_other?: number | null;
          avg_appraised_value_2025_single_family?: number | null;
          commercial_percent_change?: number | null;
          condo_percent_change?: number | null;
          count_2024_commercial?: number | null;
          count_2024_condo?: number | null;
          count_2024_multi_family?: number | null;
          count_2024_other?: number | null;
          count_2024_single_family?: number | null;
          count_2025_commercial?: number | null;
          count_2025_condo?: number | null;
          count_2025_multi_family?: number | null;
          count_2025_other?: number | null;
          count_2025_single_family?: number | null;
          multi_family_percent_change?: number | null;
          other_percent_change?: number | null;
          single_family_percent_change?: number | null;
          total_appraised_value_2024_commercial?: number | null;
          total_appraised_value_2024_condo?: number | null;
          total_appraised_value_2024_multi_family?: number | null;
          total_appraised_value_2024_other?: number | null;
          total_appraised_value_2024_single_family?: number | null;
          total_appraised_value_2025_commercial?: number | null;
          total_appraised_value_2025_condo?: number | null;
          total_appraised_value_2025_multi_family?: number | null;
          total_appraised_value_2025_other?: number | null;
          total_appraised_value_2025_single_family?: number | null;
          ward?: number;
        };
        Relationships: [];
      };
      wards_summary: {
        Row: {
          other_2024: number | null;
          other_2025: number | null;
          residential_2024: number | null;
          residential_2025: number | null;
          total_2024: number | null;
          total_2025: number | null;
          total_percent_change: number | null;
          ward: number;
        };
        Insert: {
          other_2024?: number | null;
          other_2025?: number | null;
          residential_2024?: number | null;
          residential_2025?: number | null;
          total_2024?: number | null;
          total_2025?: number | null;
          total_percent_change?: number | null;
          ward: number;
        };
        Update: {
          other_2024?: number | null;
          other_2025?: number | null;
          residential_2024?: number | null;
          residential_2025?: number | null;
          total_2024?: number | null;
          total_2025?: number | null;
          total_percent_change?: number | null;
          ward?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      compare_appraised_total: {
        Args: { p_start_year: number; p_end_year: number };
        Returns: {
          parcel_number: string;
          start_total: number;
          end_total: number;
          appraiser_id: number;
          neighborhood: string;
          neighborhood_int: number;
          difference: number;
          pct_change: number;
          site_street_number: string;
          site_street_name: string;
          prefix_directional: string;
          site_zip_code: string;
          land_use: string;
          prop_class: string;
          tax_status: string;
          occupancy: string;
        }[];
      };
      get_asdtotal_statistics: {
        Args:
          | { p_zip?: string }
          | {
              p_zip?: string;
              p_asrclasscode?: number;
              p_asrlanduse1?: string;
              p_isabatedproperty?: boolean;
              p_abatementtype?: string;
              p_abatementstartyear?: number;
              p_abatementendyear?: number;
              p_specbusdist?: string;
              p_tifdist?: string;
              p_zoning?: string;
              p_nbrhd?: number;
              p_asrnbrhd?: number;
            };
        Returns: {
          total_asdtotal: number;
          avg_asdtotal: number;
          median_asdtotal: number;
          count_asdtotal: number;
          max_asdtotal: number;
        }[];
      };
      get_distinct_values: {
        Args: { p_table_name: string; p_column_name: string };
        Returns: {
          distinct_value: string;
        }[];
      };
      get_filtered_stats: {
        Args: { p_filters: Json };
        Returns: {
          total_asdtotal: number;
          avg_asdtotal: number;
          median_asdtotal: number;
          count_asdtotal: number;
          max_asdtotal: number;
        }[];
      };
      get_fire_appraisal_comparison: {
        Args: Record<PropertyKey, never>;
        Returns: {
          fire_parcel_number: string;
          p_parcel_number: string;
          start_total: number;
          end_total: number;
          appraiser_id: number;
          neighborhood: string;
          neighborhood_int: number;
          difference: number;
          pct_change: number;
          site_street_number: string;
          site_street_name: string;
          prefix_directional: string;
          site_zip_code: string;
          land_use: string;
          prop_class: string;
          tax_status: string;
          occupancy: string;
        }[];
      };
      get_sales: {
        Args: {
          occupancy_values?: string[];
          neighborhood_values?: string[];
          relative_year_offset?: number;
          override_year?: number;
          structure_name_values?: string[];
          condition_values?: string[];
          quality_values?: string[];
        };
        Returns: {
          date_of_sale: string;
          net_selling_price: number;
          sale_type: string;
          document_number: number;
          appraised_sum: number;
          parcels: Json;
          structure_count: number;
          parcel_count: number;
        }[];
      };
      get_sales_by_occupancy: {
        Args: {
          occupancy_values?: string[];
          neighborhood_values?: string[];
          relative_year_offset?: number;
          override_year?: number;
          sale_parcel_type?: string;
        };
        Returns: {
          sale_document_number: number;
          date_of_sale: string;
          net_selling_price: number;
          sale_year: number;
          parcels: Json;
        }[];
      };
      search_all_parcels: {
        Args: { search_term: string };
        Returns: {
          address_id: string | null;
          house_number: string | null;
          id: number;
          name: string | null;
          parcel_number: string | null;
          search_text: string | null;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        }[];
      };
      search_current_parcels: {
        Args: { search_text: string };
        Returns: {
          owner_address2: string | null;
          owner_city: string | null;
          owner_name: string | null;
          owner_state: string | null;
          owner_zip: string | null;
          parcel_number: string;
          search: string | null;
          site_street_name: string | null;
          site_street_number: string | null;
          site_zip_code: string | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      sales_parcel_data: {
        parcel_number: string | null;
        date_of_sale: string | null;
        net_selling_price: number | null;
        parcel_year: number | null;
        occupancy: string | null;
        appraised_total: number | null;
      };
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
