"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type DevnetReviewStatuses =
  Database["public"]["Tables"]["devnet_review_statuses"]["Row"];
type DevnetReviewStatusesInsert =
  Database["public"]["Tables"]["devnet_review_statuses"]["Insert"];
type DevnetReviewStatusesUpdate =
  Database["public"]["Tables"]["devnet_review_statuses"]["Update"];

export async function createDevnetReviewStatuses(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();

    const data: DevnetReviewStatusesInsert = {
      description: (formData.get("description") as string) || undefined,
      is_terminal:
        formData.get("is_terminal") === "true" ||
        formData.get("is_terminal") === "on",
      name: formData.get("name") as string,
      needs_approval:
        formData.get("needs_approval") === "true" ||
        formData.get("needs_approval") === "on",
      preferred_role: (formData.get("preferred_role") as string) || undefined,
      required_specialties: formData.get("required_specialties")
        ? (formData.get("required_specialties") as string)
            .split(",")
            .map((s) => s.trim())
        : [],
      requires_assignment:
        formData.get("requires_assignment") === "true" ||
        formData.get("requires_assignment") === "on",

      review_kind: formData.get("review_kind") as
        | "sale_review"
        | "permit_review"
        | "appeal_review"
        | "custom_review",
      slug: formData.get("slug") as string,
      sort_order: Number(formData.get("sort_order")),
    };

    const { error } = await supabase
      .from("devnet_review_statuses")
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

export async function updateDevnetReviewStatuses(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();

    const data: DevnetReviewStatusesUpdate = {
      description: (formData.get("description") as string) || undefined,
      is_terminal:
        formData.get("is_terminal") === "true" ||
        formData.get("is_terminal") === "on",
      name: formData.get("name") as string,
      needs_approval:
        formData.get("needs_approval") === "true" ||
        formData.get("needs_approval") === "on",
      preferred_role: (formData.get("preferred_role") as string) || undefined,
      required_specialties: formData.get("required_specialties")
        ? (formData.get("required_specialties") as string)
            .split(",")
            .map((s) => s.trim())
        : [],
      requires_assignment:
        formData.get("requires_assignment") === "true" ||
        formData.get("requires_assignment") === "on",
      review_kind: formData.get("review_kind") as
        | "sale_review"
        | "permit_review"
        | "appeal_review"
        | "custom_review",
      slug: formData.get("slug") as string,
      sort_order: Number(formData.get("sort_order")),
    };

    const { error } = await supabase
      .from("devnet_review_statuses")
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

export async function deleteDevnetReviewStatuses(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("devnet_review_statuses")
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

export async function getDevnetReviewStatusesById(
  id: number
): Promise<DevnetReviewStatuses | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("devnet_review_statuses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as DevnetReviewStatuses;
  } catch (err) {
    return null;
  }
}
