import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "@/types/types";

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are not available
// This allows the build to complete but will return empty data
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export async function getArticles(
  limit = 10,
  authorId?: string,
  categoryId?: string
): Promise<
  (Tables<"articles"> & {
    authors: Tables<"authors"> | null;
    categories: Tables<"categories">[] | null;
  })[]
> {
  // Return empty array if supabase client is not initialized
  if (!supabase) return [];
  
  let query = supabase
    .from("articles")
    .select(
      `
      *,
      authors (
        id,
        name
      ),
      categories (
        id,
        name
      )
    `
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  // @ts-expect-error
  return data;
}

export async function getCategories() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
}

export async function getArticlesByCategoryId(categoryId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("category_id", categoryId);

  if (error) throw error;
  return data;
}

export async function getArticleById(id: string | undefined) {
  if (!id) return null;
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      categories (
        id,
        name
      ),
      authors (
        id,
        name,
        bio,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }
  return data;
}

export async function getAuthorById(id: string | undefined) {
  if (!id) return null;
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }
  return data;
}

export async function getCategoryById(id: string | undefined) {
  if (!id) return null;
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }
  return data;
}
