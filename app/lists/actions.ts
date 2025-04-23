"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const create = async () => {
  const supabase = await createClient();
  //@ts-ignore
  const { error, data } = await supabase.from("list").insert({}).select();

  if (error) {
    console.log(error);
    return { error: "Error Updating", success: "" };
  }

  revalidatePath("/lists");
  //@ts-ignore
  return redirect("/lists/" + data[0].id);
};

export const createListItem = async (prevState: any, formData: FormData) => {
  const parcel_number = formData.get("parcel_number") as string;
  const year = formData.get("year") as string;
  const list_id = formData.get("list_id") as string;
  const supabase = await createClient();
  //@ts-ignore
  const { error } = await supabase.from("list_parcel_year").insert({
    parcel_number,
    year: parseInt(year),
    list: parseInt(list_id),
  });

  if (error) {
    console.log(error);
    return { error: "Error Updating", success: "" };
  }

  revalidatePath("/lists");
  return {
    success: "Added to list successfully",
    error: "",
  };
  // return redirect("/invoices/" + idInt);
};

export const update = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const supabase = await createClient();
  const { error } = await supabase
    //@ts-ignore
    .from("lists")
    .update({
      name,
    })
    .eq("id", id);

  if (error) {
    return { error: "Error Updating", success: "" };
  }

  revalidatePath("/lists");
  return {
    success: "List updated successfully",
    error: "",
  };
};

export const deleteListItem = async (prevState: any, formData: FormData) => {
  const list_id = formData.get("list_id") as string;
  const parcel = formData.get("parcel_number") as string;
  const year = formData.get("year") as string;
  console.log({
    list_id,
    year,
    parcel,
  });
  const supabase = await createClient();
  const { error } = await supabase
    //@ts-ignore
    .from("list_parcel_year")
    .delete()
    .eq("list", parseInt(list_id))
    .eq("parcel_number", parcel)
    .eq("year", parseInt(year));

  if (error) {
    console.log(error);
    return "Error deleting list item";
  }

  revalidatePath("/lists");
  return "";
};

export const deleteList = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  //@ts-ignore
  const { error } = await supabase.from("list").delete().eq("id", id);

  if (error) return "Error deleting list";
  revalidatePath("/lists");
  return "";
};
