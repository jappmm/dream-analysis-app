// Dentro de tu función handleSubmit en Login.js, modifica esta parte:

try {
  // Usamos directamente la API de Supabase para el inicio de sesión
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  toast({
    title: 'Inicio de sesión exitoso',
    description: '¡Bienvenido de nuevo!',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
  
  // Redirigir explícitamente a la página de registro de sueños
  // Asegúrate de que esta ruta sea correcta según tu aplicación
  navigate('/dream-journal');
  
} catch (error) {
  console.error('Error en inicio de sesión:', error);
  
  // Resto del código de manejo de errores...
}