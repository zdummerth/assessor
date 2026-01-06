// Type exports from database-types.ts
import type { Database } from "@/database-types";

export type Neighborhoods = Database["public"]["Tables"]["neighborhoods"]["Row"];
export type NeighborhoodsInsert = Database["public"]["Tables"]["neighborhoods"]["Insert"];
export type NeighborhoodsUpdate = Database["public"]["Tables"]["neighborhoods"]["Update"];
