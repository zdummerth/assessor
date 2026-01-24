"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import type {
  DeedAbstractFormData,
  DeedAbstract,
  DeedAbstractsResult,
  ActionState,
} from "./types";

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Extract and validate deed abstract data from FormData
 */
function extractDeedAbstractFormData(formData: FormData): DeedAbstractFormData {
  return {
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
}

/**
 * Get authenticated user or return error state
 */
async function getAuthenticatedUser(): Promise<
  { user: { id: string } } | ActionState
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to perform this action",
    };
  }

  return { user };
}

// ============================================================
// READ OPERATIONS (with React.cache for deduplication)
// ============================================================

const getDeedAbstractsCached = cache(
  async ({
    limit = 20,
    page = 1,
  }: {
    limit?: number;
    page?: number;
  }): Promise<DeedAbstractsResult> => {
    const rangeStart = (page - 1) * limit;
    const rangeEnd = rangeStart + limit - 1;
    const supabase = await createClient();

    const { data, error, count } = await supabase
      .from("deed_abstracts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error("Error fetching deed abstracts:", error);
      return { data: [], totalCount: 0, error: error.message };
    }

    return {
      data: data || [],
      totalCount: count || 0,
    };
  },
);

export async function getDeedAbstracts({
  limit = 20,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<DeedAbstractsResult> {
  return getDeedAbstractsCached({ limit, page });
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
  const authResult = await getAuthenticatedUser();
  if ("success" in authResult) return authResult;

  const supabase = await createClient();
  const data = extractDeedAbstractFormData(formData);

  // Insert into database
  const { error } = await supabase.from("deed_abstracts").insert({
    ...data,
    created_by_employee_user_id: authResult.user.id,
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
  const authResult = await getAuthenticatedUser();
  if ("success" in authResult) return authResult;

  const supabase = await createClient();
  const data = extractDeedAbstractFormData(formData);

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
  const authResult = await getAuthenticatedUser();
  if ("success" in authResult) return authResult;

  const supabase = await createClient();

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
  const authResult = await getAuthenticatedUser();
  if ("success" in authResult) return authResult;

  const supabase = await createClient();

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
  const authResult = await getAuthenticatedUser();
  if ("success" in authResult) return authResult;

  const supabase = await createClient();

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

// ============================================================
// BOOK ACTIONS
// ============================================================

const getBooksCached = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_books_with_stats");

  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }

  return data || [];
});

export async function getBooks() {
  return getBooksCached();
}

export async function getBook(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("deed_abstract_books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book:", error);
    return null;
  }

  return data;
}

export async function getBookAbstracts(
  bookId: number,
  options?: { limit?: number; page?: number },
) {
  const supabase = await createClient();

  let query = supabase
    .from("deed_abstracts")
    .select("*", { count: "exact" })
    .eq("book_id", bookId)
    .order("date_filed", { ascending: true });

  // Apply pagination if options provided
  if (options?.limit && options?.page) {
    const rangeStart = (options.page - 1) * options.limit;
    const rangeEnd = rangeStart + options.limit - 1;
    query = query.range(rangeStart, rangeEnd);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching book abstracts:", error);
    return { abstracts: [], count: 0 };
  }

  return { abstracts: data || [], count: count || 0 };
}

export async function createBook(
  abstractIds: number[],
  bookData: { book_title: string; saved_location?: string; notes?: string },
): Promise<ActionState & { bookId?: number }> {
  const authResult = await getAuthenticatedUser();
  if ("success" in authResult) return authResult;

  const supabase = await createClient();

  // Create the book
  const { data: book, error: bookError } = await supabase
    .from("deed_abstract_books")
    .insert({
      book_title: bookData.book_title,
      printed_by_employee_user_id: authResult.user.id,
      saved_location: bookData.saved_location || null,
      notes: bookData.notes || null,
    })
    .select()
    .single();

  if (bookError || !book) {
    console.error("Error creating book:", bookError);
    return {
      success: false,
      message: "Failed to create book",
    };
  }

  // Assign abstracts to the book
  const { data: assignResult, error: assignError } = await supabase.rpc(
    "assign_abstracts_to_book",
    {
      p_abstract_ids: abstractIds,
      p_book_id: book.id,
    },
  );

  if (assignError) {
    console.error("Error assigning abstracts to book:", assignError);
    // Rollback: delete the book
    await supabase.from("deed_abstract_books").delete().eq("id", book.id);
    return {
      success: false,
      message: "Failed to assign abstracts to book",
    };
  }

  revalidatePath("/real-estate-records/abstracts", "page");
  revalidatePath("/real-estate-records/abstracts/books", "page");

  return {
    success: true,
    message: `Book created successfully with ${assignResult} abstracts`,
    bookId: book.id,
  };
}

export async function updateBook(
  bookId: number,
  updateData: { book_title?: string; saved_location?: string; notes?: string },
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("deed_abstract_books")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookId);

  if (error) {
    console.error("Error updating book:", error);
    return {
      success: false,
      message: "Failed to update book",
    };
  }

  revalidatePath("/real-estate-records/abstracts/books", "layout");

  return {
    success: true,
    message: "Book updated successfully",
  };
}

export async function deleteBook(bookId: number): Promise<ActionState> {
  const supabase = await createClient();

  // Check if book has abstracts
  const { count, error: countError } = await supabase
    .from("deed_abstracts")
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId);

  if (countError) {
    console.error("Error checking book abstracts:", countError);
    return {
      success: false,
      message: "Failed to check book abstracts",
    };
  }

  if (count && count > 0) {
    return {
      success: false,
      message: `Cannot delete book with ${count} assigned abstracts. Remove abstracts first.`,
    };
  }

  const { error } = await supabase
    .from("deed_abstract_books")
    .delete()
    .eq("id", bookId);

  if (error) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      message: "Failed to delete book",
    };
  }

  revalidatePath("/real-estate-records/abstracts/books");

  return {
    success: true,
    message: "Book deleted successfully",
  };
}

export async function assignAbstractsToBook(
  abstractIds: number[],
  bookId: number,
): Promise<ActionState> {
  const supabase = await createClient();

  const { data: count, error } = await supabase.rpc(
    "assign_abstracts_to_book",
    {
      p_abstract_ids: abstractIds,
      p_book_id: bookId,
    },
  );

  if (error) {
    console.error("Error assigning abstracts to book:", error);
    return {
      success: false,
      message: "Failed to assign abstracts to book",
    };
  }

  revalidatePath("/real-estate-records/abstracts", "page");
  revalidatePath("/real-estate-records/abstracts/books", "layout");

  return {
    success: true,
    message: `${count} abstracts assigned to book successfully`,
  };
}

export async function removeAbstractsFromBook(
  abstractIds: number[],
): Promise<ActionState> {
  const supabase = await createClient();

  const { data: count, error } = await supabase.rpc(
    "remove_abstracts_from_book",
    {
      p_abstract_ids: abstractIds,
    },
  );

  if (error) {
    console.error("Error removing abstracts from book:", error);
    return {
      success: false,
      message: "Failed to remove abstracts from book",
    };
  }

  revalidatePath("/real-estate-records/abstracts", "page");
  revalidatePath("/real-estate-records/abstracts/books", "page");

  return {
    success: true,
    message: `${count} abstracts removed from book successfully`,
  };
}

export async function getPrintableAbstracts(params?: {
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
}) {
  const supabase = await createClient();
  const limit = params?.limit || 1000;
  const page = params?.page || 1;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = rangeStart + limit - 1;

  const { data, error, count } = await supabase.rpc(
    "get_printable_abstracts",
    {
      p_limit: limit,
      p_start_date: params?.startDate || undefined,
      p_end_date: params?.endDate || undefined,
    },
    { count: "exact" },
  );

  if (error) {
    console.error("Error fetching printable abstracts:", error);
    return { data: [], count: 0 };
  }

  // Apply client-side pagination to the fetched data
  const paginatedData = (data || []).slice(rangeStart, rangeEnd + 1);

  return { data: paginatedData, count: count || 0 };
}

export async function getAllPrintableAbstracts(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<number[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_printable_abstracts", {
    p_limit: 100000,
    p_start_date: params?.startDate || undefined,
    p_end_date: params?.endDate || undefined,
  });

  if (error) {
    console.error("Error fetching all printable abstracts:", error);
    return [];
  }

  return (data || []).map((item: any) => item.id);
}

export async function getNextBookNumber(): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("deed_abstract_books")
    .select("book_title")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return "1";
  }

  // Try to parse as number and increment
  const currentNumber = parseInt(data.book_title);
  if (!isNaN(currentNumber)) {
    return (currentNumber + 1).toString();
  }

  // If not a number, return empty for user to fill in
  return "";
}
