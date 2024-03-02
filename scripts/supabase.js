
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const URL = import.meta.env.VITE_URL;
const ANON_KEY = import.meta.env.VITE_ANON_KEY;

export const supabase = createClient(URL, ANON_KEY)

