// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, HStack, Link, Button, useColorModeValue, Spacer } from '@chakra-ui/react';
import { supabase } from '../services/supabase';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={6} py={4} boxShadow="md">
      <Flex align="center">
        <HStack spacing={8}>
          <Link as={RouterLink} to="/" fontWeight="bold" fontSize="xl">
            Dream Analysis
          </Link>
          {user && (
            <Link as={RouterLink} to="/dashboard">
              Dashboard
            </Link>
          )}
        </HStack>

        <Spacer />

        <HStack spacing={4}>
          {!user ? (
            <>
              <Button as={RouterLink} to="/login" variant="outline" colorScheme="blue">
                Iniciar Sesión
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="blue">
                Registrarse
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} colorScheme="red">
              Cerrar Sesión
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
