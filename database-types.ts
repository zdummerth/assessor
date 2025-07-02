export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
      appeal_attachments: {
        Row: {
          appeal_id: number;
          attachment_id: number;
          id: number;
        };
        Insert: {
          appeal_id: number;
          attachment_id: number;
          id?: number;
        };
        Update: {
          appeal_id?: number;
          attachment_id?: number;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "appeal_attachments_appeal_id_fkey";
            columns: ["appeal_id"];
            isOneToOne: false;
            referencedRelation: "parcel_value_appeal";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appeal_attachments_attachment_id_fkey";
            columns: ["attachment_id"];
            isOneToOne: false;
            referencedRelation: "attachments";
            referencedColumns: ["id"];
          },
        ];
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
            foreignKeyName: "parcel_review_appeals_parcel_number_year_fkey";
            columns: ["parcel_number", "year"];
            isOneToOne: false;
            referencedRelation: "parcel_year";
            referencedColumns: ["parcel_number", "year"];
          },
        ];
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
          email: string | null;
          id: number;
          name: string | null;
          phone: string | null;
          supervisor: string | null;
        };
        Insert: {
          email?: string | null;
          id: number;
          name?: string | null;
          phone?: string | null;
          supervisor?: string | null;
        };
        Update: {
          email?: string | null;
          id?: number;
          name?: string | null;
          phone?: string | null;
          supervisor?: string | null;
        };
        Relationships: [];
      };
      attachments: {
        Row: {
          description: string | null;
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          file_url: string;
          id: number;
          uploaded_at: string | null;
          uploaded_by: number | null;
        };
        Insert: {
          description?: string | null;
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          file_url: string;
          id?: number;
          uploaded_at?: string | null;
          uploaded_by?: number | null;
        };
        Update: {
          description?: string | null;
          file_name?: string;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string;
          id?: number;
          uploaded_at?: string | null;
          uploaded_by?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
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
      building_section_conditions: {
        Row: {
          building_section_parcel_id: number;
          condition: number;
          created_at: string | null;
          effective_date: string;
          id: number;
          notes: string | null;
        };
        Insert: {
          building_section_parcel_id: number;
          condition: number;
          created_at?: string | null;
          effective_date: string;
          id?: number;
          notes?: string | null;
        };
        Update: {
          building_section_parcel_id?: number;
          condition?: number;
          created_at?: string | null;
          effective_date?: string;
          id?: number;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "building_section_conditions_building_section_parcel_id_fkey";
            columns: ["building_section_parcel_id"];
            isOneToOne: false;
            referencedRelation: "building_sections";
            referencedColumns: ["parcel_id"];
          },
        ];
      };
      building_sections: {
        Row: {
          building_id: number;
          floor: number | null;
          gla: number | null;
          parcel_id: number;
          total_area: number | null;
          unit_number: string | null;
        };
        Insert: {
          building_id: number;
          floor?: number | null;
          gla?: number | null;
          parcel_id: number;
          total_area?: number | null;
          unit_number?: string | null;
        };
        Update: {
          building_id?: number;
          floor?: number | null;
          gla?: number | null;
          parcel_id?: number;
          total_area?: number | null;
          unit_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "building_sections_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "building_sections_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: true;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      building_site_addresses: {
        Row: {
          address_id: number;
          building_id: number;
          end_date: string | null;
          id: number;
          is_primary: boolean | null;
          start_date: string;
        };
        Insert: {
          address_id: number;
          building_id: number;
          end_date?: string | null;
          id?: number;
          is_primary?: boolean | null;
          start_date: string;
        };
        Update: {
          address_id?: number;
          building_id?: number;
          end_date?: string | null;
          id?: number;
          is_primary?: boolean | null;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "building_site_addresses_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
        ];
      };
      buildings: {
        Row: {
          condition: string | null;
          created_at: string | null;
          id: number;
          name: string | null;
          total_area: number | null;
          year_built: number | null;
        };
        Insert: {
          condition?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          total_area?: number | null;
          year_built?: number | null;
        };
        Update: {
          condition?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          total_area?: number | null;
          year_built?: number | null;
        };
        Relationships: [];
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
      comparables: {
        Row: {
          address: string | null;
          condition: string | null;
          construction_type: string | null;
          date_of_sale: string | null;
          gla: number | null;
          gower_dist: number | null;
          id: number;
          lat: number | null;
          lon: number | null;
          neighborhood: string | null;
          net_selling_price: number | null;
          parcel_number: string | null;
          subject_parcel: string | null;
          touched: number | null;
        };
        Insert: {
          address?: string | null;
          condition?: string | null;
          construction_type?: string | null;
          date_of_sale?: string | null;
          gla?: number | null;
          gower_dist?: number | null;
          id?: number;
          lat?: number | null;
          lon?: number | null;
          neighborhood?: string | null;
          net_selling_price?: number | null;
          parcel_number?: string | null;
          subject_parcel?: string | null;
          touched?: number | null;
        };
        Update: {
          address?: string | null;
          condition?: string | null;
          construction_type?: string | null;
          date_of_sale?: string | null;
          gla?: number | null;
          gower_dist?: number | null;
          id?: number;
          lat?: number | null;
          lon?: number | null;
          neighborhood?: string | null;
          net_selling_price?: number | null;
          parcel_number?: string | null;
          subject_parcel?: string | null;
          touched?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "comparables_subject_parcel_fkey";
            columns: ["subject_parcel"];
            isOneToOne: false;
            referencedRelation: "parcel_master";
            referencedColumns: ["parcel_number"];
          },
        ];
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
      employees: {
        Row: {
          active: boolean | null;
          email: string | null;
          id: number;
          name: string;
          role: string | null;
        };
        Insert: {
          active?: boolean | null;
          email?: string | null;
          id?: number;
          name: string;
          role?: string | null;
        };
        Update: {
          active?: boolean | null;
          email?: string | null;
          id?: number;
          name?: string;
          role?: string | null;
        };
        Relationships: [];
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
      invoice_line_item: {
        Row: {
          amount: number | null;
          description: string | null;
          id: number;
          invoice_id: number;
          qty: number | null;
          unit: string | null;
        };
        Insert: {
          amount?: number | null;
          description?: string | null;
          id?: number;
          invoice_id: number;
          qty?: number | null;
          unit?: string | null;
        };
        Update: {
          amount?: number | null;
          description?: string | null;
          id?: number;
          invoice_id?: number;
          qty?: number | null;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_line_item_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          created_at: string;
          customer_name: string | null;
          id: number;
          paid_at: string | null;
        };
        Insert: {
          created_at?: string;
          customer_name?: string | null;
          id?: number;
          paid_at?: string | null;
        };
        Update: {
          created_at?: string;
          customer_name?: string | null;
          id?: number;
          paid_at?: string | null;
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
      list: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      list_parcel_year: {
        Row: {
          list: number;
          parcel_number: string;
          year: number;
        };
        Insert: {
          list: number;
          parcel_number: string;
          year: number;
        };
        Update: {
          list?: number;
          parcel_number?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "list_parcel_year_list_fkey";
            columns: ["list"];
            isOneToOne: false;
            referencedRelation: "list";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "list_parcel_year_parcel_number_year_fkey";
            columns: ["parcel_number", "year"];
            isOneToOne: false;
            referencedRelation: "parcel_year";
            referencedColumns: ["parcel_number", "year"];
          },
        ];
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
      notice: {
        Row: {
          child_id: number;
          parcel_number: string | null;
          printed_at: string | null;
          type: string | null;
          year: number | null;
        };
        Insert: {
          child_id?: number;
          parcel_number?: string | null;
          printed_at?: string | null;
          type?: string | null;
          year?: number | null;
        };
        Update: {
          child_id?: number;
          parcel_number?: string | null;
          printed_at?: string | null;
          type?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "notice_parcel_number_year_fkey";
            columns: ["parcel_number", "year"];
            isOneToOne: false;
            referencedRelation: "parcel_year";
            referencedColumns: ["parcel_number", "year"];
          },
        ];
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
      owner_parcel_year: {
        Row: {
          name_id: string;
          parcel_number: string;
          year: number;
        };
        Insert: {
          name_id: string;
          parcel_number: string;
          year: number;
        };
        Update: {
          name_id?: string;
          parcel_number?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "owner_parcel_year_name_id_fkey";
            columns: ["name_id"];
            isOneToOne: false;
            referencedRelation: "owner_name";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "owner_parcel_year_parcel_number_year_fkey";
            columns: ["parcel_number", "year"];
            isOneToOne: false;
            referencedRelation: "parcel_year";
            referencedColumns: ["parcel_number", "year"];
          },
        ];
      };
      owners: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: number;
          mailing_address: string | null;
          name: string;
          phone: string | null;
          tax_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: number;
          mailing_address?: string | null;
          name: string;
          phone?: string | null;
          tax_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: number;
          mailing_address?: string | null;
          name?: string;
          phone?: string | null;
          tax_id?: string | null;
        };
        Relationships: [];
      };
      parcel_assignments: {
        Row: {
          assigned_at: string | null;
          employee_id: number;
          id: number;
          notes: string | null;
          parcel_id: number;
          year: number;
        };
        Insert: {
          assigned_at?: string | null;
          employee_id: number;
          id?: number;
          notes?: string | null;
          parcel_id: number;
          year: number;
        };
        Update: {
          assigned_at?: string | null;
          employee_id?: number;
          id?: number;
          notes?: string | null;
          parcel_id?: number;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_assignments_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parcel_assignments_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_attachments: {
        Row: {
          attachment_id: number;
          id: number;
          parcel_id: number;
        };
        Insert: {
          attachment_id: number;
          id?: number;
          parcel_id: number;
        };
        Update: {
          attachment_id?: number;
          id?: number;
          parcel_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_attachments_attachment_id_fkey";
            columns: ["attachment_id"];
            isOneToOne: false;
            referencedRelation: "attachments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parcel_attachments_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_attribute_values: {
        Row: {
          attribute_key: string;
          created_at: string | null;
          effective_date: string;
          end_date: string | null;
          id: number;
          parcel_id: number;
          value: string;
        };
        Insert: {
          attribute_key: string;
          created_at?: string | null;
          effective_date?: string;
          end_date?: string | null;
          id?: number;
          parcel_id: number;
          value: string;
        };
        Update: {
          attribute_key?: string;
          created_at?: string | null;
          effective_date?: string;
          end_date?: string | null;
          id?: number;
          parcel_id?: number;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_attribute_values_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
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
      parcel_new_construction: {
        Row: {
          id: number;
          note: string | null;
          parcel_id: number;
          value: number;
          value_type: string | null;
          year: number;
        };
        Insert: {
          id?: number;
          note?: string | null;
          parcel_id: number;
          value: number;
          value_type?: string | null;
          year: number;
        };
        Update: {
          id?: number;
          note?: string | null;
          parcel_id?: number;
          value?: number;
          value_type?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_new_construction_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_ownerships: {
        Row: {
          created_at: string | null;
          end_date: string | null;
          id: number;
          is_primary: boolean | null;
          owner_id: number;
          ownership_type: string | null;
          parcel_id: number;
          start_date: string;
        };
        Insert: {
          created_at?: string | null;
          end_date?: string | null;
          id?: number;
          is_primary?: boolean | null;
          owner_id: number;
          ownership_type?: string | null;
          parcel_id: number;
          start_date: string;
        };
        Update: {
          created_at?: string | null;
          end_date?: string | null;
          id?: number;
          is_primary?: boolean | null;
          owner_id?: number;
          ownership_type?: string | null;
          parcel_id?: number;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_ownerships_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "owners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parcel_ownerships_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
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
      parcel_site_addresses: {
        Row: {
          address_id: number;
          end_date: string | null;
          id: number;
          is_primary: boolean | null;
          parcel_id: number;
          start_date: string;
        };
        Insert: {
          address_id: number;
          end_date?: string | null;
          id?: number;
          is_primary?: boolean | null;
          parcel_id: number;
          start_date: string;
        };
        Update: {
          address_id?: number;
          end_date?: string | null;
          id?: number;
          is_primary?: boolean | null;
          parcel_id?: number;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_site_addresses_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_tax_rates: {
        Row: {
          id: number;
          parcel_id: number;
          rate_year_id: number;
        };
        Insert: {
          id?: number;
          parcel_id: number;
          rate_year_id: number;
        };
        Update: {
          id?: number;
          parcel_id?: number;
          rate_year_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_tax_rates_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parcel_tax_rates_rate_year_id_fkey";
            columns: ["rate_year_id"];
            isOneToOne: false;
            referencedRelation: "tax_rate_years";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_value_appeal: {
        Row: {
          appeal_number: string | null;
          decision_date: string | null;
          final_value: number | null;
          id: number;
          notes: string | null;
        };
        Insert: {
          appeal_number?: string | null;
          decision_date?: string | null;
          final_value?: number | null;
          id: number;
          notes?: string | null;
        };
        Update: {
          appeal_number?: string | null;
          decision_date?: string | null;
          final_value?: number | null;
          id?: number;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_value_appeal_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "parcel_values";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_value_cost: {
        Row: {
          building_value: number | null;
          depreciation_amount: number | null;
          id: number;
          land_value: number | null;
          total_value: number | null;
        };
        Insert: {
          building_value?: number | null;
          depreciation_amount?: number | null;
          id: number;
          land_value?: number | null;
          total_value?: number | null;
        };
        Update: {
          building_value?: number | null;
          depreciation_amount?: number | null;
          id?: number;
          land_value?: number | null;
          total_value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_value_cost_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "parcel_values";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_value_model: {
        Row: {
          id: number;
          model_id: number;
          predicted_value: number;
          prediction_date: string | null;
        };
        Insert: {
          id: number;
          model_id: number;
          predicted_value: number;
          prediction_date?: string | null;
        };
        Update: {
          id?: number;
          model_id?: number;
          predicted_value?: number;
          prediction_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_value_model_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "parcel_values";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_value_sales: {
        Row: {
          adjusted_average_price: number | null;
          adjustments: string | null;
          comparable_sales_count: number | null;
          id: number;
          total_value: number | null;
        };
        Insert: {
          adjusted_average_price?: number | null;
          adjustments?: string | null;
          comparable_sales_count?: number | null;
          id: number;
          total_value?: number | null;
        };
        Update: {
          adjusted_average_price?: number | null;
          adjustments?: string | null;
          comparable_sales_count?: number | null;
          id?: number;
          total_value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_value_sales_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "parcel_values";
            referencedColumns: ["id"];
          },
        ];
      };
      parcel_values: {
        Row: {
          created_at: string | null;
          id: number;
          parcel_id: number;
          value_type: string;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          parcel_id: number;
          value_type: string;
          year: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          parcel_id?: number;
          value_type?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_values_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
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
          owner_address_1: string | null;
          owner_address_2: string | null;
          owner_city: string | null;
          owner_name: string | null;
          owner_state: string | null;
          owner_zip: string | null;
          parcel_number: string;
          prefix_directional: string | null;
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
          site_street_name: string | null;
          site_street_number: string | null;
          site_zip_code: string | null;
          tax_status: string | null;
          taxcode: string | null;
          use_code: string | null;
          working_improve_value: number | null;
          working_land_value: number | null;
          working_total_value: number | null;
          year: number;
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
          owner_address_1?: string | null;
          owner_address_2?: string | null;
          owner_city?: string | null;
          owner_name?: string | null;
          owner_state?: string | null;
          owner_zip?: string | null;
          parcel_number: string;
          prefix_directional?: string | null;
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
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
          tax_status?: string | null;
          taxcode?: string | null;
          use_code?: string | null;
          working_improve_value?: number | null;
          working_land_value?: number | null;
          working_total_value?: number | null;
          year: number;
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
          owner_address_1?: string | null;
          owner_address_2?: string | null;
          owner_city?: string | null;
          owner_name?: string | null;
          owner_state?: string | null;
          owner_zip?: string | null;
          parcel_number?: string;
          prefix_directional?: string | null;
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
          site_street_name?: string | null;
          site_street_number?: string | null;
          site_zip_code?: string | null;
          tax_status?: string | null;
          taxcode?: string | null;
          use_code?: string | null;
          working_improve_value?: number | null;
          working_land_value?: number | null;
          working_total_value?: number | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parcel_year_appraiser_id_fkey";
            columns: ["appraiser_id"];
            isOneToOne: false;
            referencedRelation: "appraisers";
            referencedColumns: ["id"];
          },
        ];
      };
      parcels: {
        Row: {
          created_at: string | null;
          id: number;
          parcel_number: string;
          retired_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          parcel_number: string;
          retired_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          parcel_number?: string;
          retired_at?: string | null;
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
      sale_building_sections: {
        Row: {
          building_section_parcel_id: number;
          condition_at_sale: number | null;
          created_at: string | null;
          id: number;
          notes: string | null;
          sale_id: number;
        };
        Insert: {
          building_section_parcel_id: number;
          condition_at_sale?: number | null;
          created_at?: string | null;
          id?: number;
          notes?: string | null;
          sale_id: number;
        };
        Update: {
          building_section_parcel_id?: number;
          condition_at_sale?: number | null;
          created_at?: string | null;
          id?: number;
          notes?: string | null;
          sale_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sale_building_sections_building_section_parcel_id_fkey";
            columns: ["building_section_parcel_id"];
            isOneToOne: false;
            referencedRelation: "building_sections";
            referencedColumns: ["parcel_id"];
          },
          {
            foreignKeyName: "sale_building_sections_sale_id_fkey";
            columns: ["sale_id"];
            isOneToOne: false;
            referencedRelation: "sales";
            referencedColumns: ["id"];
          },
        ];
      };
      sales: {
        Row: {
          date_of_sale: string | null;
          document_number: number;
          field_review_date: string | null;
          id: number;
          net_selling_price: number | null;
          report_date: string | null;
          sale_type: string | null;
        };
        Insert: {
          date_of_sale?: string | null;
          document_number: number;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          report_date?: string | null;
          sale_type?: string | null;
        };
        Update: {
          date_of_sale?: string | null;
          document_number?: number;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          report_date?: string | null;
          sale_type?: string | null;
        };
        Relationships: [];
      };
      sales_attachments: {
        Row: {
          attachment_id: number;
          id: number;
          sale_id: number;
        };
        Insert: {
          attachment_id: number;
          id?: number;
          sale_id: number;
        };
        Update: {
          attachment_id?: number;
          id?: number;
          sale_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sales_attachments_attachment_id_fkey";
            columns: ["attachment_id"];
            isOneToOne: false;
            referencedRelation: "attachments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_attachments_sale_id_fkey";
            columns: ["sale_id"];
            isOneToOne: false;
            referencedRelation: "sales";
            referencedColumns: ["id"];
          },
        ];
      };
      sales_master: {
        Row: {
          date_of_sale: string | null;
          document_number: number;
          field_review_date: string | null;
          id: number;
          net_selling_price: number | null;
          report_timestamp: string | null;
          sale_type: string | null;
          sale_year: number | null;
        };
        Insert: {
          date_of_sale?: string | null;
          document_number: number;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          report_timestamp?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
        };
        Update: {
          date_of_sale?: string | null;
          document_number?: number;
          field_review_date?: string | null;
          id?: number;
          net_selling_price?: number | null;
          report_timestamp?: string | null;
          sale_type?: string | null;
          sale_year?: number | null;
        };
        Relationships: [];
      };
      sales_parcel: {
        Row: {
          id: number;
          is_primary: boolean | null;
          parcel_id: number;
          percent_transferred: number | null;
          sale_id: number;
        };
        Insert: {
          id?: number;
          is_primary?: boolean | null;
          parcel_id: number;
          percent_transferred?: number | null;
          sale_id: number;
        };
        Update: {
          id?: number;
          is_primary?: boolean | null;
          parcel_id?: number;
          percent_transferred?: number | null;
          sale_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sales_parcel_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_parcel_sale_id_fkey";
            columns: ["sale_id"];
            isOneToOne: false;
            referencedRelation: "sales";
            referencedColumns: ["id"];
          },
        ];
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
          created_at: string | null;
          fts: unknown | null;
          house_number: string | null;
          id: number;
          name: string | null;
          parcel_number: string | null;
          retired_at: string | null;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        };
        Insert: {
          created_at?: string | null;
          fts?: unknown | null;
          house_number?: string | null;
          id?: number;
          name?: string | null;
          parcel_number?: string | null;
          retired_at?: string | null;
          street_name?: string | null;
          street_suffix?: string | null;
          zip_code?: string | null;
        };
        Update: {
          created_at?: string | null;
          fts?: unknown | null;
          house_number?: string | null;
          id?: number;
          name?: string | null;
          parcel_number?: string | null;
          retired_at?: string | null;
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
          fts: unknown | null;
          house_number: string | null;
          id: string;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        };
        Insert: {
          fts?: unknown | null;
          house_number?: string | null;
          id: string;
          street_name?: string | null;
          street_suffix?: string | null;
          zip_code?: string | null;
        };
        Update: {
          fts?: unknown | null;
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
          fts: unknown | null;
          is_primary: boolean | null;
          location: string | null;
          parcel_number: string;
          year: number;
        };
        Insert: {
          address_id: string;
          fts?: unknown | null;
          is_primary?: boolean | null;
          location?: string | null;
          parcel_number: string;
          year: number;
        };
        Update: {
          address_id?: string;
          fts?: unknown | null;
          is_primary?: boolean | null;
          location?: string | null;
          parcel_number?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "site_address_parcel_year_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "site_address_master";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "site_address_parcel_year_parcel_number_year_fkey";
            columns: ["parcel_number", "year"];
            isOneToOne: false;
            referencedRelation: "parcel_year";
            referencedColumns: ["parcel_number", "year"];
          },
        ];
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
          cdu: string | null;
          cost_group: string | null;
          ea: string | null;
          gla: number | null;
          grade: string | null;
          id: number;
          parcel_number: string | null;
          story: string | null;
          total_area: number | null;
          year: number | null;
          year_built: number | null;
        };
        Insert: {
          cdu?: string | null;
          cost_group?: string | null;
          ea?: string | null;
          gla?: number | null;
          grade?: string | null;
          id?: number;
          parcel_number?: string | null;
          story?: string | null;
          total_area?: number | null;
          year?: number | null;
          year_built?: number | null;
        };
        Update: {
          cdu?: string | null;
          cost_group?: string | null;
          ea?: string | null;
          gla?: number | null;
          grade?: string | null;
          id?: number;
          parcel_number?: string | null;
          story?: string | null;
          total_area?: number | null;
          year?: number | null;
          year_built?: number | null;
        };
        Relationships: [];
      };
      tax_rate_years: {
        Row: {
          cap: number | null;
          created_at: string | null;
          id: number;
          rate: number;
          rate_id: number;
          rate_type: string;
          tax_year: number;
        };
        Insert: {
          cap?: number | null;
          created_at?: string | null;
          id?: number;
          rate: number;
          rate_id: number;
          rate_type: string;
          tax_year: number;
        };
        Update: {
          cap?: number | null;
          created_at?: string | null;
          id?: number;
          rate?: number;
          rate_id?: number;
          rate_type?: string;
          tax_year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "tax_rate_years_rate_id_fkey";
            columns: ["rate_id"];
            isOneToOne: false;
            referencedRelation: "tax_rates";
            referencedColumns: ["id"];
          },
        ];
      };
      tax_rates: {
        Row: {
          code: string;
          description: string | null;
          id: number;
        };
        Insert: {
          code: string;
          description?: string | null;
          id?: number;
        };
        Update: {
          code?: string;
          description?: string | null;
          id?: number;
        };
        Relationships: [];
      };
      test_attribute_values: {
        Row: {
          active: boolean;
          attribute_key: string;
          created_at: string | null;
          description: string | null;
          value: string;
        };
        Insert: {
          active?: boolean;
          attribute_key: string;
          created_at?: string | null;
          description?: string | null;
          value: string;
        };
        Update: {
          active?: boolean;
          attribute_key?: string;
          created_at?: string | null;
          description?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_attribute_values_attribute_key_fkey";
            columns: ["attribute_key"];
            isOneToOne: false;
            referencedRelation: "test_attributes";
            referencedColumns: ["key"];
          },
        ];
      };
      test_attributes: {
        Row: {
          active: boolean;
          created_at: string | null;
          description: string | null;
          key: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string | null;
          description?: string | null;
          key: string;
        };
        Update: {
          active?: boolean;
          created_at?: string | null;
          description?: string | null;
          key?: string;
        };
        Relationships: [];
      };
      test_buildings: {
        Row: {
          adjusted_age: number | null;
          basement_crawl_space: number | null;
          basement_living_area: number | null;
          basement_recreation_room: number | null;
          basement_unfinished_basement: number | null;
          cdu: number | null;
          finished_attic: number | null;
          first_floor_living_area: number | null;
          full_bath: number | null;
          func_depc: number | null;
          half_bath: number | null;
          half_story_living_area: number | null;
          number_of_bedrooms: number | null;
          number_of_rooms: number | null;
          parcel_id: number;
          second_floor_living_area: number | null;
          structure_type: string | null;
          third_floor_living_area: number | null;
          unfinished_attic: number | null;
        };
        Insert: {
          adjusted_age?: number | null;
          basement_crawl_space?: number | null;
          basement_living_area?: number | null;
          basement_recreation_room?: number | null;
          basement_unfinished_basement?: number | null;
          cdu?: number | null;
          finished_attic?: number | null;
          first_floor_living_area?: number | null;
          full_bath?: number | null;
          func_depc?: number | null;
          half_bath?: number | null;
          half_story_living_area?: number | null;
          number_of_bedrooms?: number | null;
          number_of_rooms?: number | null;
          parcel_id: number;
          second_floor_living_area?: number | null;
          structure_type?: string | null;
          third_floor_living_area?: number | null;
          unfinished_attic?: number | null;
        };
        Update: {
          adjusted_age?: number | null;
          basement_crawl_space?: number | null;
          basement_living_area?: number | null;
          basement_recreation_room?: number | null;
          basement_unfinished_basement?: number | null;
          cdu?: number | null;
          finished_attic?: number | null;
          first_floor_living_area?: number | null;
          full_bath?: number | null;
          func_depc?: number | null;
          half_bath?: number | null;
          half_story_living_area?: number | null;
          number_of_bedrooms?: number | null;
          number_of_rooms?: number | null;
          parcel_id?: number;
          second_floor_living_area?: number | null;
          structure_type?: string | null;
          third_floor_living_area?: number | null;
          unfinished_attic?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_buildings_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_comparables: {
        Row: {
          address: string | null;
          adjusted_price: number | null;
          cdu: number | null;
          cdu_coeff: number | null;
          cdu_diff: number | null;
          date_of_sale: string | null;
          gower_dist: number | null;
          land_use: string | null;
          lat: number | null;
          lon: number | null;
          miles_distance: number | null;
          neighborhood_code: number | null;
          neighborhood_group: string | null;
          net_selling_price: number | null;
          parcel_id: number | null;
          sale_id: number | null;
          subject_address: string | null;
          subject_cdu: number | null;
          subject_land_use: string | null;
          subject_lat: number | null;
          subject_lon: number | null;
          subject_neighborhood_code: number | null;
          subject_neighborhood_group: string | null;
          subject_parcel: number | null;
          subject_total_living_area: number | null;
          total_living_area: number | null;
          total_living_area_coeff: number | null;
          total_living_area_diff: number | null;
        };
        Insert: {
          address?: string | null;
          adjusted_price?: number | null;
          cdu?: number | null;
          cdu_coeff?: number | null;
          cdu_diff?: number | null;
          date_of_sale?: string | null;
          gower_dist?: number | null;
          land_use?: string | null;
          lat?: number | null;
          lon?: number | null;
          miles_distance?: number | null;
          neighborhood_code?: number | null;
          neighborhood_group?: string | null;
          net_selling_price?: number | null;
          parcel_id?: number | null;
          sale_id?: number | null;
          subject_address?: string | null;
          subject_cdu?: number | null;
          subject_land_use?: string | null;
          subject_lat?: number | null;
          subject_lon?: number | null;
          subject_neighborhood_code?: number | null;
          subject_neighborhood_group?: string | null;
          subject_parcel?: number | null;
          subject_total_living_area?: number | null;
          total_living_area?: number | null;
          total_living_area_coeff?: number | null;
          total_living_area_diff?: number | null;
        };
        Update: {
          address?: string | null;
          adjusted_price?: number | null;
          cdu?: number | null;
          cdu_coeff?: number | null;
          cdu_diff?: number | null;
          date_of_sale?: string | null;
          gower_dist?: number | null;
          land_use?: string | null;
          lat?: number | null;
          lon?: number | null;
          miles_distance?: number | null;
          neighborhood_code?: number | null;
          neighborhood_group?: string | null;
          net_selling_price?: number | null;
          parcel_id?: number | null;
          sale_id?: number | null;
          subject_address?: string | null;
          subject_cdu?: number | null;
          subject_land_use?: string | null;
          subject_lat?: number | null;
          subject_lon?: number | null;
          subject_neighborhood_code?: number | null;
          subject_neighborhood_group?: string | null;
          subject_parcel?: number | null;
          subject_total_living_area?: number | null;
          total_living_area?: number | null;
          total_living_area_coeff?: number | null;
          total_living_area_diff?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_comparables_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_comparables_subject_parcel_fkey";
            columns: ["subject_parcel"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_images: {
        Row: {
          created_at: string | null;
          id: number;
          image_url: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          image_url: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          image_url?: string;
        };
        Relationships: [];
      };
      test_parcel_attribute_values: {
        Row: {
          attribute_key: string;
          created_at: string | null;
          effective_date: string;
          end_date: string | null;
          id: number;
          parcel_id: number;
          value: string;
        };
        Insert: {
          attribute_key: string;
          created_at?: string | null;
          effective_date?: string;
          end_date?: string | null;
          id?: number;
          parcel_id: number;
          value: string;
        };
        Update: {
          attribute_key?: string;
          created_at?: string | null;
          effective_date?: string;
          end_date?: string | null;
          id?: number;
          parcel_id?: number;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcel_attribute_values_attribute_key_value_fkey";
            columns: ["attribute_key", "value"];
            isOneToOne: false;
            referencedRelation: "test_attribute_values";
            referencedColumns: ["attribute_key", "value"];
          },
          {
            foreignKeyName: "test_parcel_attribute_values_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_parcel_image_primary: {
        Row: {
          created_at: string | null;
          effective_date: string;
          id: number;
          image_id: number;
          parcel_id: number;
        };
        Insert: {
          created_at?: string | null;
          effective_date?: string;
          id?: number;
          image_id: number;
          parcel_id: number;
        };
        Update: {
          created_at?: string | null;
          effective_date?: string;
          id?: number;
          image_id?: number;
          parcel_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcel_image_primary_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "test_images";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_parcel_image_primary_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_parcel_images: {
        Row: {
          created_at: string | null;
          id: number;
          image_id: number;
          parcel_id: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          image_id: number;
          parcel_id: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          image_id?: number;
          parcel_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcel_images_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "test_images";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_parcel_images_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_parcel_join: {
        Row: {
          child_parcel: number | null;
          parent_parcel: number | null;
        };
        Insert: {
          child_parcel?: number | null;
          parent_parcel?: number | null;
        };
        Update: {
          child_parcel?: number | null;
          parent_parcel?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcel_join_child_parcel_fkey";
            columns: ["child_parcel"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_parcel_join_parent_parcel_fkey";
            columns: ["parent_parcel"];
            isOneToOne: false;
            referencedRelation: "parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_parcel_type_values: {
        Row: {
          created_at: string | null;
          effective_date: string;
          id: number;
          parcel_id: number;
          type_key: string;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          effective_date?: string;
          id?: number;
          parcel_id: number;
          type_key: string;
          value: string;
        };
        Update: {
          created_at?: string | null;
          effective_date?: string;
          id?: number;
          parcel_id?: number;
          type_key?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcel_type_values_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_parcel_values: {
        Row: {
          agr_building: number;
          agr_land: number;
          agr_new_construction: number;
          com_building: number;
          com_land: number;
          com_new_construction: number;
          created_at: string | null;
          id: number;
          parcel_id: number;
          res_building: number;
          res_land: number;
          res_new_construction: number;
          tax_year: number;
          value_type: string;
        };
        Insert: {
          agr_building?: number;
          agr_land?: number;
          agr_new_construction?: number;
          com_building?: number;
          com_land?: number;
          com_new_construction?: number;
          created_at?: string | null;
          id?: number;
          parcel_id: number;
          res_building?: number;
          res_land?: number;
          res_new_construction?: number;
          tax_year: number;
          value_type: string;
        };
        Update: {
          agr_building?: number;
          agr_land?: number;
          agr_new_construction?: number;
          com_building?: number;
          com_land?: number;
          com_new_construction?: number;
          created_at?: string | null;
          id?: number;
          parcel_id?: number;
          res_building?: number;
          res_land?: number;
          res_new_construction?: number;
          tax_year?: number;
          value_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcel_values_parcel_id_fkey";
            columns: ["parcel_id"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_parcels: {
        Row: {
          block: number;
          created_at: string | null;
          ext: number;
          id: number;
          lot: number;
          retired_at: string | null;
        };
        Insert: {
          block: number;
          created_at?: string | null;
          ext?: number;
          id: number;
          lot: number;
          retired_at?: string | null;
        };
        Update: {
          block?: number;
          created_at?: string | null;
          ext?: number;
          id?: number;
          lot?: number;
          retired_at?: string | null;
        };
        Relationships: [];
      };
      test_parcels_join: {
        Row: {
          child_parcel: number | null;
          parent_parcel: number | null;
        };
        Insert: {
          child_parcel?: number | null;
          parent_parcel?: number | null;
        };
        Update: {
          child_parcel?: number | null;
          parent_parcel?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_parcels_join_child_parcel_fkey";
            columns: ["child_parcel"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_parcels_join_parent_parcel_fkey";
            columns: ["parent_parcel"];
            isOneToOne: false;
            referencedRelation: "test_parcels";
            referencedColumns: ["id"];
          },
        ];
      };
      test_type_values: {
        Row: {
          active: boolean;
          created_at: string | null;
          description: string | null;
          type_key: string;
          value: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string | null;
          description?: string | null;
          type_key: string;
          value: string;
        };
        Update: {
          active?: boolean;
          created_at?: string | null;
          description?: string | null;
          type_key?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_type_values_type_key_fkey";
            columns: ["type_key"];
            isOneToOne: false;
            referencedRelation: "test_types";
            referencedColumns: ["key"];
          },
        ];
      };
      test_types: {
        Row: {
          active: boolean;
          created_at: string | null;
          description: string | null;
          key: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string | null;
          description?: string | null;
          key: string;
        };
        Update: {
          active?: boolean;
          created_at?: string | null;
          description?: string | null;
          key?: string;
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
      gtrgm_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      load_parcel_site_addresses: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      load_site_addresses: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      reset_parcel_database: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      search_all_parcels: {
        Args: { search_term: string };
        Returns: {
          created_at: string | null;
          fts: unknown | null;
          house_number: string | null;
          id: number;
          name: string | null;
          parcel_number: string | null;
          retired_at: string | null;
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
      search_parcels: {
        Args: { prefix: string; active?: boolean };
        Returns: {
          parcel: string;
          retired: string;
          neighborhood: string;
          land_use: string;
          prop_class: string;
          appraised_total: number;
          appraiser: string;
          appraiser_email: string;
          appraiser_phone: string;
          names: string[];
          addresses: Json[];
        }[];
      };
      search_site_address_master: {
        Args: { prefix: string };
        Returns: {
          fts: unknown | null;
          house_number: string | null;
          id: string;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        }[];
      };
      search_site_address_test: {
        Args: { prefix: string; year_input: number };
        Returns: {
          fts: unknown | null;
          house_number: string | null;
          id: string;
          street_name: string | null;
          street_suffix: string | null;
          zip_code: string | null;
        }[];
      };
      set_limit: {
        Args: { "": number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { "": string };
        Returns: string[];
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
  public: {
    Enums: {},
  },
} as const;
