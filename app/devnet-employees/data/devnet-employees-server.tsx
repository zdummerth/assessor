import { createClient } from "@/lib/supabase/server";
import { DevnetEmployeesPresentation } from "../devnet-employees-presentation";
import { DevnetEmployeesPagination } from "../devnet-employees-pagination";
import type { Database } from "@/database-types";

interface DevnetEmployeesServerProps {
  filters?: {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  user_id?: string;
  };
  currentPage?: number;
  pageSize?: number;
}

export async function DevnetEmployeesServer({
  filters,
  currentPage = 1,
  pageSize = 25,
}: DevnetEmployeesServerProps) {
  const supabase = await createClient();

  // Build query for data
  let dataQuery = supabase.from("devnet_employees").select("*");
  
  // Build query for count
  let countQuery = supabase.from("devnet_employees").select("*", { count: "exact", head: true });

  // Apply filters to data query
  if (filters?.email) {
    dataQuery = dataQuery.eq("email", filters.email);
  }

  if (filters?.first_name) {
    dataQuery = dataQuery.eq("first_name", filters.first_name);
  }

  if (filters?.last_name) {
    dataQuery = dataQuery.eq("last_name", filters.last_name);
  }

  if (filters?.role) {
    dataQuery = dataQuery.eq("role", filters.role);
  }

  if (filters?.status) {
    dataQuery = dataQuery.eq("status", filters.status);
  }

  if (filters?.user_id) {
    dataQuery = dataQuery.eq("user_id", filters.user_id);
  }

  // Apply filters to count query
  if (filters?.email) {
    countQuery = countQuery.eq("email", filters.email);
  }

  if (filters?.first_name) {
    countQuery = countQuery.eq("first_name", filters.first_name);
  }

  if (filters?.last_name) {
    countQuery = countQuery.eq("last_name", filters.last_name);
  }

  if (filters?.role) {
    countQuery = countQuery.eq("role", filters.role);
  }

  if (filters?.status) {
    countQuery = countQuery.eq("status", filters.status);
  }

  if (filters?.user_id) {
    countQuery = countQuery.eq("user_id", filters.user_id);
  }

  // Apply pagination to data query
  const offset = (currentPage - 1) * pageSize;
  dataQuery = dataQuery.range(offset, offset + pageSize - 1);

  const [{ data, error }, { count }] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <>
      <DevnetEmployeesPresentation
        data={data || []}
        error={error?.message}
      />
      <DevnetEmployeesPagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
