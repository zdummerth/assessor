"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type DevnetReviews = Database["public"]["Tables"]["devnet_reviews"]["Row"];
type DevnetReviewsInsert = Database["public"]["Tables"]["devnet_reviews"]["Insert"];
type DevnetReviewsUpdate = Database["public"]["Tables"]["devnet_reviews"]["Update"];
type DevnetDataStatus = Database["public"]["Enums"]["devnet_data_status"];
type DevnetReviewKind = Database["public"]["Enums"]["devnet_review_kind"];


export async function createDevnetReviews(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: DevnetReviewsInsert = {
      assigned_to_id: formData.get("assigned_to_id") ? Number(formData.get("assigned_to_id")) : undefined,
      completed_at: (formData.get("completed_at") as string) || undefined,
      completion_criteria: formData.get("completion_criteria") ? JSON.parse(formData.get("completion_criteria") as string) : undefined,
      copied_to_devnet_at: (formData.get("copied_to_devnet_at") as string) || undefined,
      copied_to_devnet_by_id: formData.get("copied_to_devnet_by_id") ? Number(formData.get("copied_to_devnet_by_id")) : undefined,
      current_status_id: Number(formData.get("current_status_id")),
      data: formData.get("data") ? JSON.parse(formData.get("data") as string) : {},
      data_collected_at: (formData.get("data_collected_at") as string) || undefined,
      data_collected_by_id: formData.get("data_collected_by_id") ? Number(formData.get("data_collected_by_id")) : undefined,
      data_status: (formData.get("data_status") as DevnetDataStatus) || undefined,
      data_validation_rules: formData.get("data_validation_rules") ? JSON.parse(formData.get("data_validation_rules") as string) : undefined,
      description: (formData.get("description") as string) || undefined,
      devnet_copy_confirmed: formData.get("devnet_copy_confirmed") === "true" || formData.get("devnet_copy_confirmed") === "on",
      due_date: (formData.get("due_date") as string) || undefined,
      entity_id: formData.get("entity_id") ? Number(formData.get("entity_id")) : undefined,
      entity_type: (formData.get("entity_type") as string) || undefined,
      field_data: formData.get("field_data") ? JSON.parse(formData.get("field_data") as string) : undefined,
      field_notes: (formData.get("field_notes") as string) || undefined,
      kind: (formData.get("kind") as DevnetReviewKind),
      priority: (formData.get("priority") as string) || undefined,
      required_data_fields: formData.get("required_data_fields") ? JSON.parse(formData.get("required_data_fields") as string) : undefined,
      requires_field_review: formData.get("requires_field_review") === "true" || formData.get("requires_field_review") === "on",
      title: (formData.get("title") as string) || undefined,
    };

    const { error } = await supabase
      .from("devnet_reviews")
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

export async function updateDevnetReviews(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: DevnetReviewsUpdate = {
      assigned_to_id: formData.get("assigned_to_id") ? Number(formData.get("assigned_to_id")) : undefined,
      completed_at: (formData.get("completed_at") as string) || undefined,
      completion_criteria: formData.get("completion_criteria") ? JSON.parse(formData.get("completion_criteria") as string) : undefined,
      copied_to_devnet_at: (formData.get("copied_to_devnet_at") as string) || undefined,
      copied_to_devnet_by_id: formData.get("copied_to_devnet_by_id") ? Number(formData.get("copied_to_devnet_by_id")) : undefined,
      current_status_id: Number(formData.get("current_status_id")),
      data: formData.get("data") ? JSON.parse(formData.get("data") as string) : {},
      data_collected_at: (formData.get("data_collected_at") as string) || undefined,
      data_collected_by_id: formData.get("data_collected_by_id") ? Number(formData.get("data_collected_by_id")) : undefined,
      data_status: (formData.get("data_status") as DevnetDataStatus) || undefined,
      data_validation_rules: formData.get("data_validation_rules") ? JSON.parse(formData.get("data_validation_rules") as string) : undefined,
      description: (formData.get("description") as string) || undefined,
      devnet_copy_confirmed: formData.get("devnet_copy_confirmed") === "true" || formData.get("devnet_copy_confirmed") === "on",
      due_date: (formData.get("due_date") as string) || undefined,
      entity_id: formData.get("entity_id") ? Number(formData.get("entity_id")) : undefined,
      entity_type: (formData.get("entity_type") as string) || undefined,
      field_data: formData.get("field_data") ? JSON.parse(formData.get("field_data") as string) : undefined,
      field_notes: (formData.get("field_notes") as string) || undefined,
      kind: (formData.get("kind") as DevnetReviewKind),
      priority: (formData.get("priority") as string) || undefined,
      required_data_fields: formData.get("required_data_fields") ? JSON.parse(formData.get("required_data_fields") as string) : undefined,
      requires_field_review: formData.get("requires_field_review") === "true" || formData.get("requires_field_review") === "on",
      title: (formData.get("title") as string) || undefined,
    };

    const { error } = await supabase
      .from("devnet_reviews")
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

export async function deleteDevnetReviews(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("devnet_reviews")
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

export async function getDevnetReviewsById(
  id: number
): Promise<DevnetReviews | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("devnet_reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as DevnetReviews;
  } catch (err) {
    return null;
  }
}
