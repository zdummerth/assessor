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

export const create = async () => {
  const supabase = await createClient();
  const { error, data } = await supabase.from("invoices").insert({}).select();

  if (error) {
    console.error(error);
    return "Error creating invoice";
  }

  revalidatePath("/invoices");
  return redirect("/invoices/" + data[0].id);
};

export const createLineItem = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const idInt = parseInt(id);
  const supabase = await createClient();
  const { error } = await supabase.from("invoice_line_item").insert({
    invoice_id: idInt,
  });

  if (error) {
    return { error, message: "error occcured", success: false };
  }

  revalidatePath("/invoices");
  return {
    success: true,
    message: "Invoice updated successfully",
    error: null,
  };
};

export const update = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const customer_name = formData.get("customer_name") as string;
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({
      customer_name,
    })
    .eq("id", id);

  if (error) {
    return { error, message: "error occcured", success: false };
  }

  revalidatePath("/invoices");
  return {
    success: true,
    message: "Invoice updated successfully",
    error: null,
  };
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
    return { error, message: "error occcured", success: false };
  }

  revalidatePath("/invoices");
  return {
    success: true,
    message: "Invoice updated successfully",
    error: null,
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

export const testAction = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  console.log("name", name);
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  return {
    success: true,
    message: "Invoice updated successfully",
    error: null,
  };
};
