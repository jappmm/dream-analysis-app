import { createClient } from '@supabase/supabase-js';

// Valores directos en lugar de variables de entorno
const supabaseUrl = 'https://lqcjprngnslazjynhrod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2pwcm5nbnNsYXpqeW5ocm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDI0MTAsImV4cCI6MjA2MTc3ODQxMH0.wn-WbbvTAZaeuxXepBHyS8E4gsDbh_54BJcrgkO15XE';

// Opciones adicionales para mejorar la conectividad
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Función para verificar la conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1);
    if (error) {
      console.error('Error conectando con Supabase:', error);
      return false;
    }
    console.log('Conexión a Supabase exitosa');
    return true;
  } catch (err) {
    console.error('Error inesperado conectando a Supabase:', err);
    return false;
  }
};