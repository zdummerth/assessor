"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/");
};

export const create = async (formData: FormData) => {
  const supabase = await createClient();
  const { error, data } = await supabase.from("invoices").insert({}).select();

  if (error) {
    console.error(error);
    return { error };
  }

  console.log("Created invoice", data);
  revalidatePath("/invoices");
  return redirect("/invoices/" + data[0].id);
};

export const togglePaid = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const paid = (formData.get("paid") as string) === "true";
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({
      paid_at: paid ? null : new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error };
  }
  revalidatePath("/invoices");
  return {
    success: true,
    message: "Invoice updated successfully",
  };
};

export const deleteInvoice = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    return { error };
  }
  revalidatePath("/invoices");
  return {
    success: true,
    message: "Invoice deleted successfully",
  };
};
