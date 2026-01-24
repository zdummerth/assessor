"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DeedAbstractFormData, DeedAbstract, ActionState } from "./types";

export async function getDeedAbstracts({
  limit = 20,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<DeedAbstract[]> {
  const rangeStart = (page - 1) * limit;
  const rangeEnd = rangeStart + limit - 1;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("deed_abstracts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeEnd);

  if (error) {
    console.error("Error fetching deed abstracts:", error);
    return [];
  }

  return data || [];
}

export async function getDeedAbstract(
  id: number,
): Promise<DeedAbstract | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("deed_abstracts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching deed abstract:", error);
    return null;
  }

  return data;
}

export async function createDeedAbstract(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to create a deed abstract",
    };
  }

  // Extract and validate form data
  const data: DeedAbstractFormData = {
    date_filed: formData.get("date_filed") as string | null,
    date_of_deed: formData.get("date_of_deed") as string | null,
    daily_number: formData.get("daily_number")
      ? parseInt(formData.get("daily_number") as string)
      : null,
    type_of_conveyance: formData.get("type_of_conveyance") as string | null,
    grantor_name: formData.get("grantor_name") as string | null,
    grantor_address: formData.get("grantor_address") as string | null,
    grantee_name: formData.get("grantee_name") as string | null,
    grantee_address: formData.get("grantee_address") as string | null,
    consideration_amount: formData.get("consideration_amount")
      ? Math.round(
          parseFloat(formData.get("consideration_amount") as string) * 100,
        )
      : null,
    stamps: formData.get("stamps") as string | null,
    city_block: formData.get("city_block") as string | null,
    legal_description: formData.get("legal_description") as string | null,
    title_company: formData.get("title_company") as string | null,
    is_transfer: formData.get("is_transfer") === "on",
  };

  // Insert into database
  const { error } = await supabase.from("deed_abstracts").insert({
    ...data,
    created_by_employee_user_id: user.id,
  });

  if (error) {
    console.error("Error creating deed abstract:", error);
    return {
      success: false,
      message: "Failed to create deed abstract",
    };
  }

  revalidatePath("/real-estate-records/abstracts");

  return {
    success: true,
    message: "Deed abstract created successfully",
  };
}

export async function updateDeedAbstract(
  id: number,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to update a deed abstract",
    };
  }

  // Extract and validate form data
  const data: DeedAbstractFormData = {
    date_filed: formData.get("date_filed") as string | null,
    date_of_deed: formData.get("date_of_deed") as string | null,
    daily_number: formData.get("daily_number")
      ? parseInt(formData.get("daily_number") as string)
      : null,
    type_of_conveyance: formData.get("type_of_conveyance") as string | null,
    grantor_name: formData.get("grantor_name") as string | null,
    grantor_address: formData.get("grantor_address") as string | null,
    grantee_name: formData.get("grantee_name") as string | null,
    grantee_address: formData.get("grantee_address") as string | null,
    consideration_amount: formData.get("consideration_amount")
      ? Math.round(
          parseFloat(formData.get("consideration_amount") as string) * 100,
        )
      : null,
    stamps: formData.get("stamps") as string | null,
    city_block: formData.get("city_block") as string | null,
    legal_description: formData.get("legal_description") as string | null,
    title_company: formData.get("title_company") as string | null,
    is_transfer: formData.get("is_transfer") === "on",
  };

  // Update database
  const { error } = await supabase
    .from("deed_abstracts")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating deed abstract:", error);
    return {
      success: false,
      message: "Failed to update deed abstract",
    };
  }

  revalidatePath("/real-estate-records/abstracts");

  return {
    success: true,
    message: "Deed abstract updated successfully",
  };
}

export async function deleteDeedAbstract(id: number): Promise<ActionState> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to delete a deed abstract",
    };
  }

  // Delete from database (trigger will prevent if published)
  const { error } = await supabase.from("deed_abstracts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting deed abstract:", error);
    return {
      success: false,
      message: error.message.includes("published")
        ? "Cannot delete published deed abstract. Unpublish first."
        : "Failed to delete deed abstract",
    };
  }

  revalidatePath("/real-estate-records/abstracts");

  return {
    success: true,
    message: "Deed abstract deleted successfully",
  };
}

export async function publishDeedAbstract(id: number): Promise<ActionState> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to publish a deed abstract",
    };
  }

  // Update published_at
  const { error } = await supabase
    .from("deed_abstracts")
    .update({ published_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error publishing deed abstract:", error);
    return {
      success: false,
      message: "Failed to publish deed abstract",
    };
  }

  revalidatePath("/real-estate-records/abstracts");

  return {
    success: true,
    message: "Deed abstract published successfully",
  };
}

export async function unpublishDeedAbstract(id: number): Promise<ActionState> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to unpublish a deed abstract",
    };
  }

  // Update published_at to null
  const { error } = await supabase
    .from("deed_abstracts")
    .update({ published_at: null })
    .eq("id", id);

  if (error) {
    console.error("Error unpublishing deed abstract:", error);
    return {
      success: false,
      message: "Failed to unpublish deed abstract",
    };
  }

  revalidatePath("/real-estate-records/abstracts");

  return {
    success: true,
    message: "Deed abstract unpublished successfully",
  };
}
