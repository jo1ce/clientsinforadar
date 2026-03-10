import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/** 服务端只读客户端（RLS 下 anon 仅 SELECT）。写操作请用 createAdminClient。 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
