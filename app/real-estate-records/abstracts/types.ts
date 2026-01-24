export type DeedAbstractFormData = {
  date_filed: string | null;
  date_of_deed: string | null;
  daily_number: number | null;
  type_of_conveyance: string | null;
  grantor_name: string | null;
  grantor_address: string | null;
  grantee_name: string | null;
  grantee_address: string | null;
  consideration_amount: number | null;
  stamps: string | null;
  city_block: string | null;
  legal_description: string | null;
  title_company: string | null;
  is_transfer: boolean;
};

export type DeedAbstract = {
  id: number;
  date_filed: string | null;
  date_of_deed: string | null;
  daily_number: number | null;
  type_of_conveyance: string | null;
  grantor_name: string | null;
  grantor_address: string | null;
  grantee_name: string | null;
  grantee_address: string | null;
  consideration_amount: number | null;
  stamps: string | null;
  city_block: string | null;
  legal_description: string | null;
  title_company: string | null;
  is_transfer: boolean;
  created_at: string;
  created_by_employee_user_id: string;
  published_at: string | null;
};

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// Conveyance type options
export const CONVEYANCE_TYPES = [
  "Warranty Deed",
  "Quitclaim Deed",
  "Special Warranty Deed",
  "Deed of Trust",
  "Grant Deed",
  "Bargain and Sale Deed",
  "Gift Deed",
  "Transfer on Death Deed",
  "Other",
] as const;
