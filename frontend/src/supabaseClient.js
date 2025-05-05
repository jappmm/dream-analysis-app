import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqcjprngnslazjynhrod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2pwcm5nbnNsYXpqeW5ocm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDI0MTAsImV4cCI6MjA2MTc3ODQxMH0.wn-WbbvTAZaeuxXepBHyS8E4gsDbh_54BJcrgkO15XE';

// Crear el cliente de Supabase con opciones básicas
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Función para resetear contraseña con URL absoluta de redirección
export const resetPassword = (email) => {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://onyra.netlify.app/reset-password'
  });
};

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return data.user;
};