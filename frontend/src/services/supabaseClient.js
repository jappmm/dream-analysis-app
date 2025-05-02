import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqcjprngslazjynhrod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2pwcm5nbnNsYXpqeW5ocm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDI0MTAsImV4cCI6MjA2MTc3ODQxMH0.wn-WbbvTAZaeuxXepBHyS8E4gsDbh_54BJcrgkO15XE'; // REEMPLAZA ESTO con tu clave anónima real

export const supabase = createClient(supabaseUrl, supabaseAnonKey);