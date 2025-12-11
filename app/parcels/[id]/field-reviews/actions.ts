// app/test/field-reviews/actions.ts
"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

type ActionState = { error: string; success: string };

// Example ActionState type
// type ActionState = { error: string; success: string };

export async function createFieldReviewsBulk(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 1. Parcel IDs (multiple)
    const parcelIdsRaw = formData.getAll("parcel_ids");
    const parcelIds = parcelIdsRaw
      .map((v) =>
        typeof v === "string"
          ? Number(v)
          : Number((v as any)?.toString?.() ?? NaN)
      )
      .filter((n) => Number.isFinite(n));

    // 2. Other shared fields
    const typeRaw = formData.get("type");
    const dueDateRaw = formData.get("due_date");
    const initialStatusRaw = formData.get("initial_status");
    const initialNoteRaw = formData.get("initial_note");
    const revalidate_path = (formData.get("revalidate_path") as string) || null;

    const type_id = typeRaw ? Number(typeRaw) : NaN;
    const due_date =
      typeof dueDateRaw === "string" && dueDateRaw.trim() !== ""
        ? dueDateRaw
        : null;
    const initial_status_id =
      typeof initialStatusRaw === "string" && initialStatusRaw.trim() !== ""
        ? Number(initialStatusRaw)
        : null;
    const note =
      typeof initialNoteRaw === "string" && initialNoteRaw.trim() !== ""
        ? initialNoteRaw.trim()
        : null;

    // 3. Validation
    if (parcelIds.length === 0) {
      return { error: "Missing parcel_ids", success: "" };
    }
    if (!Number.isFinite(type_id)) {
      return { error: "Missing or invalid type", success: "" };
    }
    if (!initial_status_id && !note) {
      return {
        error: "Provide an initial status or note",
        success: "",
      };
    }

    console.log("Creating bulk field reviews:", {
      parcelIds,
      type_id,
      due_date,
      initial_status_id,
      note,
    });

    const supabase = await createClient();

    //@ts-expect-error need to generate
    const { error } = await supabase.rpc("create_field_reviews_bulk", {
      p_parcel_ids: parcelIds, // bigint[]
      p_type_id: type_id, // bigint
      p_due_date: due_date, // date (or null)
      p_initial_status_id: initial_status_id, // bigint (or null)
      p_note: note, // text (or null)
    });

    if (error) {
      return {
        error: error.message || "Failed to create field reviews",
        success: "",
      };
    }

    if (revalidate_path) {
      rp(revalidate_path);
    }

    return { error: "", success: "Field reviews created" };
  } catch (e: any) {
    return { error: e?.message || "Unexpected error", success: "" };
  }
}

export async function createFieldReviewWithInitial(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parcel_id = Number(formData.get("parcel_id"));
    const due_date = String(formData.get("due_date") || "");
    const type_id = Number(formData.get("type") || ""); // ← NEW
    const initial_status = String(formData.get("initial_status") || "");
    const initial_note = String(formData.get("initial_note") || "");
    const revalidate_path = (formData.get("revalidate_path") as string) || null;

    if (!parcel_id) return { error: "Missing parcel_id", success: "" };
    if (!type_id) return { error: "Missing type", success: "" };
    if (!initial_status && !initial_note)
      return { error: "Provide an initial status or note", success: "" };

    console.log("Creating field review:", {
      parcel_id,
      due_date,
      type_id,
      initial_status,
      initial_note,
    });

    const supabase = await createClient();

    const { error } = await supabase.rpc("create_field_review", {
      p_parcel_id: parcel_id,
      p_due_date: due_date,
      p_type_id: type_id,
      p_initial_status: initial_status,
      p_initial_note: initial_note,
    });

    if (error) {
      return {
        error: error.message || "Failed to create field review",
        success: "",
      };
    }

    if (revalidate_path) rp(revalidate_path);
    return { error: "", success: "Field review created" };
  } catch (e: any) {
    return { error: e?.message || "Unexpected error", success: "" };
  }
}

/** NOTES */
export async function addReviewNote(_prev: ActionState, formData: FormData) {
  try {
    const review_id = Number(formData.get("review_id"));
    const note = String(formData.get("note") || "");
    const revalidate_path = (formData.get("revalidate_path") as string) || null;
    if (!review_id || !note) throw new Error("Missing review_id or note");

    const supabase = await createClient();
    const { error } = await supabase
      .from("field_review_notes")
      .insert({ review_id, note });
    if (error) throw error;
    if (revalidate_path) rp(revalidate_path);
    return { error: "", success: "Note added" };
  } catch (e: any) {
    return { error: e.message || "Failed to add note", success: "" };
  }
}

export async function updateReviewNote(_prev: ActionState, formData: FormData) {
  try {
    const id = Number(formData.get("id"));
    const note = String(formData.get("note") || "");
    const revalidate_path = (formData.get("revalidate_path") as string) || null;
    if (!id || !note) throw new Error("Missing id or note");

    const supabase = await createClient();
    const { error } = await supabase
      .from("field_review_notes")
      .update({ note })
      .eq("id", id);
    if (error) throw error;
    if (revalidate_path) rp(revalidate_path);
    return { error: "", success: "Note updated" };
  } catch (e: any) {
    return { error: e.message || "Failed to update note", success: "" };
  }
}

export async function deleteReviewNotes(
  _prev: ActionState,
  formData: FormData
) {
  try {
    const ids = JSON.parse(
      String(formData.get("ids_json") || "[]")
    ) as number[];
    const revalidate_path = (formData.get("revalidate_path") as string) || null;
    if (!ids.length) throw new Error("No rows selected");

    const supabase = await createClient();
    const { error } = await supabase
      .from("field_review_notes")
      .delete()
      .in("id", ids);
    if (error) throw error;
    if (revalidate_path) rp(revalidate_path);
    return { error: "", success: `Deleted ${ids.length} note(s)` };
  } catch (e: any) {
    return { error: e.message || "Failed to delete notes", success: "" };
  }
}

/** STATUSES */
export async function addReviewStatus(_prev: ActionState, formData: FormData) {
  try {
    const review_id = Number(formData.get("review_id"));
    const status_id = Number(formData.get("status_id") || "");
    const revalidate_path = (formData.get("revalidate_path") as string) || null;
    if (!review_id || !status_id)
      throw new Error("Missing review_id or status");

    const supabase = await createClient();
    const { error } = await supabase
      .from("field_review_status_history")
      .insert({ review_id, status_id });

    if (error) throw error;
    if (revalidate_path) rp(revalidate_path);
    return { error: "", success: "Status added" };
  } catch (e: any) {
    return { error: e.message || "Failed to add status", success: "" };
  }
}

export async function deleteReviewStatuses(
  _prev: ActionState,
  formData: FormData
) {
  try {
    const ids = JSON.parse(
      String(formData.get("ids_json") || "[]")
    ) as number[];
    const revalidate_path = (formData.get("revalidate_path") as string) || null;
    if (!ids.length) throw new Error("No rows selected");

    const supabase = await createClient();
    const { error } = await supabase
      .from("field_review_statuses")
      .delete()
      .in("id", ids);
    if (error) throw error;
    if (revalidate_path) rp(revalidate_path);
    return { error: "", success: `Deleted ${ids.length} status(es)` };
  } catch (e: any) {
    return { error: e.message || "Failed to delete statuses", success: "" };
  }
}

export const uploadReviewImages = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const files = formData.getAll("files") as File[];
    const captions = formData.getAll("captions").map(String);
    const widths = formData.getAll("widths").map((v) => Number(v));
    const heights = formData.getAll("heights").map((v) => Number(v));
    const reviewIdStr = formData.get("review_id")?.toString();
    const revalidate_path = (formData.get("revalidate_path") as string) || null;

    if (!reviewIdStr) return { error: "Missing review_id", success: "" };
    const review_id = Number(reviewIdStr);
    if (!Number.isFinite(review_id) || review_id <= 0)
      return { error: "Invalid review_id", success: "" };

    if (!files.length)
      return { error: "Select at least one image", success: "" };
    if (widths.length !== files.length || heights.length !== files.length)
      return {
        error: "Dimension arrays must match number of files",
        success: "",
      };

    // Basic dimension validation
    for (let i = 0; i < files.length; i++) {
      if (
        !Number.isFinite(widths[i]) ||
        !Number.isFinite(heights[i]) ||
        widths[i] <= 0 ||
        heights[i] <= 0
      ) {
        return { error: `Invalid dimensions for file #${i + 1}`, success: "" };
      }
    }

    const supabase = await createClient();
    const bucket = "parcel-images";

    let count = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type || !file.type.startsWith("image/")) {
        return { error: `File "${file.name}" is not an image`, success: "" };
      }

      const ext =
        (file.name.includes(".") ? file.name.split(".").pop() : "") ||
        file.type.split("/")[1] ||
        "bin";
      const key = `reviews/${review_id}/${randomUUID()}.${ext}`;

      // Upload to Storage
      const buf = Buffer.from(await file.arrayBuffer());
      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(key, buf, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "application/octet-stream",
        });
      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

      // Create file + image rows via RPC
      const { error: rpcErr } = await supabase
        // @ts-ignore loose typing for rpc
        .rpc("create_file_and_field_review_image", {
          p_bucket_name: bucket,
          p_path: key,
          p_size_bytes: file.size,
          p_mime_type: file.type || "application/octet-stream",
          p_original_name: file.name,
          p_extension: ext,
          p_review_id: review_id,
          p_caption: captions[i] ?? null,
          p_width: widths[i],
          p_height: heights[i],
          p_sort_order: i,
        });

      if (rpcErr) {
        // best-effort storage cleanup
        await supabase.storage
          .from(bucket)
          .remove([key])
          .catch(() => {});
        throw new Error(`DB insert failed: ${rpcErr.message}`);
      }

      count++;
    }

    if (revalidate_path) rp(revalidate_path);
    return {
      error: "",
      success: `${count} image${count === 1 ? "" : "s"} uploaded`,
    };
  } catch (e: any) {
    return { error: e?.message || "Upload failed", success: "" };
  }
};

function parseIds(formData: FormData): number[] {
  const out = new Set<number>();

  // Preferred: JSON array
  const idsJson = formData.get("ids_json")?.toString();
  if (idsJson) {
    try {
      const arr = JSON.parse(idsJson);
      if (Array.isArray(arr)) {
        for (const v of arr) {
          const n = Number(v);
          if (Number.isFinite(n) && n > 0) out.add(n);
        }
      }
    } catch {
      /* ignore parse error; fall back to other inputs */
    }
  }

  // image_ids[]=1&image_ids[]=2
  const multi = formData.getAll("image_ids");
  for (const v of multi) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) out.add(n);
  }

  // single image_id
  const single = formData.get("image_id");
  if (single) {
    const n = Number(single);
    if (Number.isFinite(n) && n > 0) out.add(n);
  }

  //@ts-expect-error ts
  return [...out];
}

export const deleteReviewImagesAndStorage = async (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const supabase = await createClient();
    const imageIds = parseIds(formData);
    const revalidate_path = (formData.get("revalidate_path") as string) || null;

    if (imageIds.length === 0) {
      return { error: "No image ids provided", success: "" };
    }

    // Call the new DB function that deletes images + files and returns bucket/path
    const { data: rpcData, error: rpcErr } = await supabase.rpc(
      "delete_field_review_images_and_files",
      { p_image_ids: imageIds }
    );

    if (rpcErr) {
      // your plpgsql uses DETAIL for remaining refs; include it if present
      const msg = (rpcErr as any).details
        ? `${rpcErr.message} — ${(rpcErr as any).details}`
        : rpcErr.message;
      return { error: `Delete failed: ${msg}`, success: "" };
    }

    const rows = rpcData ?? [];
    let deletedImageCount = 0;
    const deletedFileIds = new Set<number>();
    const bucketToPaths = new Map<string, string[]>();
    for (const row of rows) {
      if (row.deleted_image_id) deletedImageCount++;
      if (row.deleted_file_id && row.bucket_name && row.path) {
        deletedFileIds.add(row.deleted_file_id);
        const arr = bucketToPaths.get(row.bucket_name) ?? [];
        arr.push(row.path);
        bucketToPaths.set(row.bucket_name, arr);
      }
    }

    // Remove storage objects for files actually deleted by the DB
    let storageDeleted = 0;
    let storageTried = 0;
    //@ts-expect-error ts
    for (const [bucket, paths] of bucketToPaths) {
      if (!paths.length) continue;
      storageTried += paths.length;
      const { error: rmErr } = await supabase.storage
        .from(bucket)
        .remove(paths);
      if (!rmErr) {
        storageDeleted += paths.length;
      } else {
        console.error("storage.remove error:", rmErr.message, {
          bucket,
          paths,
        });
      }
    }

    if (revalidate_path) rp(revalidate_path);

    const fileCount = deletedFileIds.size;

    return {
      error: "",
      success:
        `Deleted ${deletedImageCount} image${deletedImageCount === 1 ? "" : "s"}, ` +
        `${fileCount} file record${fileCount === 1 ? "" : "s"}` +
        (storageTried
          ? `, removed ${storageDeleted}/${storageTried} storage object${storageTried === 1 ? "" : "s"}`
          : ""),
    };
  } catch (e: any) {
    return { error: e?.message || "Delete failed", success: "" };
  }
};
