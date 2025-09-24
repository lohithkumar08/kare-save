import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zywujzlocstxcprawkgx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3VqemxvY3N0eGNwcmF3a2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTU5ODEsImV4cCI6MjA3NDI3MTk4MX0.L6rlwB6FDOalpDJ07MHbbjTrVhHEgJgI-wdKCpdXm6M";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
