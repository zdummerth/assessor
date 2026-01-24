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
  book_id: number | null;
  created_at: string;
  created_by_employee_user_id: string;
  published_at: string | null;
};

export type DeedAbstractsResult = {
  data: DeedAbstract[];
  totalCount: number;
  error?: string;
};

export type DeedAbstractBook = {
  id: number;
  book_title: string;
  printed_at: string;
  printed_by_employee_user_id: string;
  saved_location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BookWithStats = DeedAbstractBook & {
  printed_by_employee_name: string | null;
  abstract_count: number;
  earliest_date_filed: string | null;
  latest_date_filed: string | null;
  total_consideration: number | null;
};

export type BookFormData = {
  book_title: string;
  saved_location?: string;
  notes?: string;
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
