import { createClient } from '@supabase/supabase-js';

// Obtén las variables de entorno para Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);