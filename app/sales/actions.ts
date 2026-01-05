"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type Sales = Database["public"]["Tables"]["sales"]["Row"];
type SalesInsert = Database["public"]["Tables"]["sales"]["Insert"];
type SalesUpdate = Database["public"]["Tables"]["sales"]["Update"];


export async function createSales(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: SalesInsert = {
      created_by: formData.get("created_by") as string,
    };

    const { error } = await supabase
      .from("sales")
      .insert(data);

    if (error) {
      return { error: error.message, success: "" };
    }

    const revalidatePath = formData.get("revalidate_path") as string;
    if (revalidatePath) rp(revalidatePath);

    return { error: "", success: "Created successfully" };
  } catch (err: any) {
    return { error: err.message || "Failed to create record", success: "" };
  }
}

export async function updateSales(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: SalesUpdate = {
      created_by: formData.get("created_by") as string,
    };

    const { error } = await supabase
      .from("sales")
      .update(data)
      .eq("id", id);

    if (error) {
      return { error: error.message, success: "" };
    }

    const revalidatePath = formData.get("revalidate_path") as string;
    if (revalidatePath) rp(revalidatePath);

    return { error: "", success: "Updated successfully" };
  } catch (err: any) {
    return { error: err.message || "Failed to update record", success: "" };
  }
}

export async function deleteSales(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message, success: "" };
    }

    return { error: "", success: "Deleted successfully" };
  } catch (err: any) {
    return { error: err.message || "Failed to delete record", success: "" };
  }
}

export async function getSalesById(
  id: number
): Promise<Sales | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as Sales;
  } catch (err) {
    return null;
  }
}
