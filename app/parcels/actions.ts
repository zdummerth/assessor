"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type Parcels = Database["public"]["Tables"]["parcels"]["Row"];
type ParcelsInsert = Database["public"]["Tables"]["parcels"]["Insert"];
type ParcelsUpdate = Database["public"]["Tables"]["parcels"]["Update"];


export async function createParcels(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: ParcelsInsert = {
      block: formData.get("block") ? Number(formData.get("block")) : undefined,
      ext: formData.get("ext") ? Number(formData.get("ext")) : undefined,
      lot: formData.get("lot") ? Number(formData.get("lot")) : undefined,
      retired_at: (formData.get("retired_at") as string) || undefined,
    };

    const { error } = await supabase
      .from("parcels")
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

export async function updateParcels(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: ParcelsUpdate = {
      block: formData.get("block") ? Number(formData.get("block")) : undefined,
      ext: formData.get("ext") ? Number(formData.get("ext")) : undefined,
      lot: formData.get("lot") ? Number(formData.get("lot")) : undefined,
      retired_at: (formData.get("retired_at") as string) || undefined,
    };

    const { error } = await supabase
      .from("parcels")
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

export async function deleteParcels(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("parcels")
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

export async function getParcelsById(
  id: number
): Promise<Parcels | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as Parcels;
  } catch (err) {
    return null;
  }
}
