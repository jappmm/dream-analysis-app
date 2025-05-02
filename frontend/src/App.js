import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import AppRouter from './router';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { DreamProvider } from './contexts/DreamContext';
import { supabase } from './services/supabaseClient'; // Importar el cliente de Supabase

const App = () => {
  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Sesión actual:', data.session);
    };

    checkSession();
  }, []);

  return (
    <DreamProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Box flex="1" as="main">
          <AppRouter />
        </Box>
        <Footer />
      </Box>
    </DreamProvider>
  );
};

export default App;