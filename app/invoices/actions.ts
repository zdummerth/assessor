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
    console.error(error);
    return "Error creating line item";
  }

  revalidatePath("/invoices");
  return "";
  // return redirect("/invoices/" + idInt);
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
    return { error: "Error Updating", success: "" };
  }

  revalidatePath("/invoices");
  return {
    success: "Invoice updated successfully",
    error: "",
  };
};

export const updateLineItem = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const lineItemId = formData.get("line_item_id") as string;
  const description = formData.get("description") as string;
  const qty = formData.get("qty") as string;
  const unit = formData.get("unit") as string;
  const amount = formData.get("amount") as string;
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoice_line_item")
    .update({
      description,
      qty: parseFloat(qty),
      unit,
      amount: parseFloat(amount),
    })
    .eq("id", lineItemId);

  if (error) {
    return { error: "Error Updating", success: "" };
  }

  revalidatePath("/invoices" + "/" + id);
  return {
    success: "Invoice updated successfully",
    error: "",
  };
};

export const deleteLineItem = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const lineItemId = formData.get("line_item_id") as string;
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoice_line_item")
    .delete()
    .eq("id", id);

  if (error) {
    return "Error deleting line item";
  }

  revalidatePath("/invoices");
  return "";
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

export const deleteInvoice = async (prevState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    return "Error deleting invoice";
  }

  if (error) return "Error deleting invoice";
  revalidatePath("/invoices");
  return "";
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
