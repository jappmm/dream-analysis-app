// En tu archivo DreamContext.js, modifica la parte relacionada con el usuario:

// Al inicio del DreamProvider:
useEffect(() => {
  // Establecer el estado inicial del usuario
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    
    if (!error && data.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };
  
  fetchUser();
  
  // Configurar un listener para cambios en la autenticación
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log(`Auth event: ${event}`);
      setUser(session?.user || null);
    }
  );
  
  // Limpieza al desmontar el componente
  return () => {
    if (authListener && authListener.subscription) {
      authListener.subscription.unsubscribe();
    }
  };
}, []);