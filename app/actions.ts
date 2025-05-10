"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const fileUploadAction = async (_prevState: any, formData: FormData) => {
  const files = formData.getAll("files") as File[];
  const bucket = formData.get("bucket")?.toString() || null;
  const path = formData.get("path")?.toString() || null;

  if (files.length === 0) {
    return { error: "At least one file is required", success: "" };
  }
  if (!bucket) {
    return { error: "Bucket is required", success: "" };
  }
  if (!path) {
    return { error: "Path is required", success: "" };
  }

  const supabase = await createClient();

  // kick off all uploads in parallel
  const uploadPromises = files.map((file) => {
    const filePath = `${path}/${file.name}`;
    return supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
  });

  // wait for every upload to finish
  const results = await Promise.all(uploadPromises);

  // if any upload errored out, bail
  const firstError = results.find((r) => r.error);
  if (firstError?.error) {
    console.error("Upload error:", firstError.error);
    return {
      error: `Error uploading ${firstError.error?.message}`,
      success: "",
    };
  }

  // all good — revalidate and return success
  revalidatePath("/appeals");
  return {
    success: `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully`,
    error: "",
  };
};

export const deleteFileAction = async (prevState: any, formData: FormData) => {
  const fileName = formData.get("fileName")?.toString() || null;
  const bucket = formData.get("bucket")?.toString() || null;
  const path = formData.get("path")?.toString() || null;

  if (!fileName) {
    return { error: "File name is required", success: "" };
  }
  if (!bucket) {
    return { error: "Bucket is required", success: "" };
  }
  if (!path) {
    return { error: "Path is required", success: "" };
  }

  const filePath = `${path}/${fileName}`;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error(error.message);
    return { error: "Error Deleting File", success: "" };
  }

  revalidatePath("/appeals");
  return {
    success: "File deleted successfully",
    error: "",
  };
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/login", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

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

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

export const updateDataCollectionNoteAction = async (
  prevState: any,
  formData: FormData
) => {
  const note = formData.get("note")?.toString() || null;
  const parcelNumber = formData.get("parcel_number")?.toString() || null;

  console.log("prevState in action", prevState);
  console.log("note in action", note);
  console.log("parcelNumber in action", parcelNumber);

  if (!parcelNumber) {
    return { error: "Parcel number is required" };
  }
  // get current timestamp
  const currentTimestamp = new Date().toISOString();
  const supabase = await createClient();
  const { error } = await supabase.from("parcel_reviews_2025").upsert({
    data_collection: note,
    field_reviewed: currentTimestamp,
    parcel_number: parcelNumber,
  });

  if (error) {
    return { error };
  }
  revalidatePath("/appraisers");
  return {
    success: true,
    message: "Note updated successfully",
  };
};
