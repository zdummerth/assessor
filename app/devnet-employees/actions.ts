"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type DevnetEmployees = Database["public"]["Tables"]["devnet_employees"]["Row"];
type DevnetEmployeesInsert = Database["public"]["Tables"]["devnet_employees"]["Insert"];
type DevnetEmployeesUpdate = Database["public"]["Tables"]["devnet_employees"]["Update"];


export async function createDevnetEmployees(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: DevnetEmployeesInsert = {
      can_approve: formData.get("can_approve") === "true" || formData.get("can_approve") === "on",
      email: (formData.get("email") as string) || undefined,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      role: (formData.get("role") as string) || undefined,
      specialties: formData.get("specialties") ? (formData.get("specialties") as string).split(",").map(s => s.trim()) : [],
      status: formData.get("status") as string,
      user_id: (formData.get("user_id") as string) || undefined,
    };

    const { error } = await supabase
      .from("devnet_employees")
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

export async function updateDevnetEmployees(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: DevnetEmployeesUpdate = {
      can_approve: formData.get("can_approve") === "true" || formData.get("can_approve") === "on",
      email: (formData.get("email") as string) || undefined,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      role: (formData.get("role") as string) || undefined,
      specialties: formData.get("specialties") ? (formData.get("specialties") as string).split(",").map(s => s.trim()) : [],
      status: formData.get("status") as string,
      user_id: (formData.get("user_id") as string) || undefined,
    };

    const { error } = await supabase
      .from("devnet_employees")
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

export async function deleteDevnetEmployees(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("devnet_employees")
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

export async function getDevnetEmployeesById(
  id: number
): Promise<DevnetEmployees | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("devnet_employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as DevnetEmployees;
  } catch (err) {
    return null;
  }
}
