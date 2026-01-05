// Type exports from database-types.ts
import type { Database } from "@/database-types";

export type Sales = Database["public"]["Tables"]["sales"]["Row"];
export type SalesInsert = Database["public"]["Tables"]["sales"]["Insert"];
export type SalesUpdate = Database["public"]["Tables"]["sales"]["Update"];
