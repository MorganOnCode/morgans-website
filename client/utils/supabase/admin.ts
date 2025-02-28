import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/types";

// OLD CODE overwritten by new code below: 
// if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
//   throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
// }
// if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
//   throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
// }

// export function createAdminClient() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// new code:
// Check for environment variables but don't throw errors
// This allows the build to complete even if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createAdminClient() {
  // If environment variables are missing, return null
  // The calling code should handle this case
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("Missing Supabase URL or service role key - returning null client");
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
