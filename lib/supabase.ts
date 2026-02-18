import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Log values to the terminal/console to debug (Remove this later)
console.log("Supabase URL:", supabaseUrl ? "Found ✅" : "Missing ❌");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase credentials not found. Ensure your .env file is in the root folder and you have restarted the server with --clear."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);