"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type ActionState = { error: string; success: string };

export async function addCondition(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const structureId = Number(formData.get("structure_id"));
  const condition = (formData.get("condition") as string)?.trim();
  const effectiveDate = (formData.get("effective_date") as string) || "";
  const revalidate = (formData.get("revalidate_path") as string) || "";

  if (!structureId) return { error: "Missing structure id.", success: "" };
  if (!condition) return { error: "Condition is required.", success: "" };
  if (!effectiveDate)
    return { error: "Effective date is required.", success: "" };

  //@ts-expect-error - need to generate types from Supabase
  const { error } = await supabase.from("test_conditions").insert({
    structure_id: structureId,
    condition,
    effective_date: effectiveDate,
    created_at: new Date().toISOString(),
  });

  if (error) return { error: error.message, success: "" };

  if (revalidate) revalidatePath(revalidate);
  return { error: "", success: "Condition saved." };
}
