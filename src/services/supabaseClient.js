// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Usamos variables de entorno
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Creamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para enviar email de recuperación de contraseña
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`, // 👈 Muy importante
  });

  if (error) throw error;
};
