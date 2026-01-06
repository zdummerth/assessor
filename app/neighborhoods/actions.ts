"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type Neighborhoods = Database["public"]["Tables"]["neighborhoods"]["Row"];
type NeighborhoodsInsert = Database["public"]["Tables"]["neighborhoods"]["Insert"];
type NeighborhoodsUpdate = Database["public"]["Tables"]["neighborhoods"]["Update"];


export async function createNeighborhoods(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: NeighborhoodsInsert = {
      group: formData.get("group") ? Number(formData.get("group")) : undefined,
      name: (formData.get("name") as string) || undefined,
      neighborhood: Number(formData.get("neighborhood")),
      polygon: formData.get("polygon") ? (formData.get("polygon") as string).split(",").map(s => s.trim()) : [],
      set_id: formData.get("set_id") ? Number(formData.get("set_id")) : undefined,
    };

    const { error } = await supabase
      .from("neighborhoods")
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

export async function updateNeighborhoods(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: NeighborhoodsUpdate = {
      group: formData.get("group") ? Number(formData.get("group")) : undefined,
      name: (formData.get("name") as string) || undefined,
      neighborhood: Number(formData.get("neighborhood")),
      polygon: formData.get("polygon") ? (formData.get("polygon") as string).split(",").map(s => s.trim()) : [],
      set_id: formData.get("set_id") ? Number(formData.get("set_id")) : undefined,
    };

    const { error } = await supabase
      .from("neighborhoods")
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

export async function deleteNeighborhoods(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("neighborhoods")
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

export async function getNeighborhoodsById(
  id: number
): Promise<Neighborhoods | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("neighborhoods")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as Neighborhoods;
  } catch (err) {
    return null;
  }
}
