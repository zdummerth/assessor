// Type exports from database-types.ts
import type { Database } from "@/database-types";

export type DevnetEmployees = Database["public"]["Tables"]["devnet_employees"]["Row"];
export type DevnetEmployeesInsert = Database["public"]["Tables"]["devnet_employees"]["Insert"];
export type DevnetEmployeesUpdate = Database["public"]["Tables"]["devnet_employees"]["Update"];
