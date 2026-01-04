"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error: string; success: string };

export async function addCondition(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const structure_id = Number(formData.get("structure_id"));
    const condition = String(formData.get("condition"));
    const effective_date = String(formData.get("effective_date"));
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();
    const { error } = await supabase.from("test_conditions").insert({
      structure_id,
      condition,
      effective_date,
    });
    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return { success: "Condition added", error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to add condition" };
  }
}

export async function updateCondition(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = Number(formData.get("id"));
    const condition = String(formData.get("condition"));
    const effective_date = String(formData.get("effective_date"));
    const revalidate_path = formData.get("revalidate_path") as string | null;

    const supabase = await createClient();

    const { error } = await supabase
      .from("test_conditions")
      .update({ condition, effective_date })
      .eq("id", id);
    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return { success: "Condition updated", error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to update condition" };
  }
}

export async function deleteConditions(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const ids_json = String(formData.get("ids_json") || "[]");
    const ids = JSON.parse(ids_json) as number[];
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!ids.length) throw new Error("No rows selected");

    const supabase = await createClient();
    const { error } = await supabase
      .from("test_conditions")
      .delete()
      .in("id", ids);
    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return { success: `Deleted ${ids.length} condition(s)`, error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to delete" };
  }
}

export async function bulkUpdateConditions(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const mode = String(formData.get("mode")); // "condition" | "effective_date"
    const ids = JSON.parse(
      String(formData.get("ids_json") || "[]")
    ) as number[];
    const revalidate_path = formData.get("revalidate_path") as string | null;

    if (!ids.length) throw new Error("No rows selected");

    const patch: Record<string, any> = {};
    if (mode === "condition")
      patch.condition = String(formData.get("condition"));
    if (mode === "effective_date")
      patch.effective_date = String(formData.get("effective_date"));

    if (!Object.keys(patch).length) throw new Error("Nothing to update");

    const supabase = await createClient();
    const { error } = await supabase
      .from("test_conditions")
      .update(patch)
      .in("id", ids);
    if (error) throw error;

    if (revalidate_path) rp(revalidate_path);
    return { success: `Updated ${ids.length} condition(s)`, error: "" };
  } catch (e: any) {
    return { success: "", error: e.message || "Failed to bulk update" };
  }
}
