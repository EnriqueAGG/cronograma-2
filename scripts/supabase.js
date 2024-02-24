
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const URL = 'https://woqirxbuiybdqwcmdzai.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcWlyeGJ1aXliZHF3Y21kemFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1NjczMTEsImV4cCI6MjAyNDE0MzMxMX0.8zFVA4LFfJMYcp1XZxxF--4EEeLzs_8cXQVWWN8QM4k'
export const supabase = createClient(URL, ANON_KEY)



