import React from 'react';
import { Box, Flex, Heading, Button, HStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useDreams } from '../../contexts/DreamContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useDreams();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <Box 
      as="header" 
      position="fixed" 
      top={0} 
      width="full" 
      zIndex={10}
      bg="blue.700" 
      color="white" 
      boxShadow="md"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        <Heading as={RouterLink} to="/" size="lg" fontWeight="bold" cursor="pointer">
          Dream Analyzer
        </Heading>

        {user ? (
          // Menú para usuarios autenticados
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/"
              colorScheme="blue"
              variant={isActive('/') ? "solid" : "ghost"}
            >
              Mis Sueños
            </Button>
            
            <Button
              as={RouterLink}
              to="/register-dream"
              colorScheme="blue"
              variant={isActive('/register-dream') ? "solid" : "ghost"}
            >
              Registrar Sueño
            </Button>
            
            <Button
              as={RouterLink}
              to="/history"
              colorScheme="blue"
              variant={isActive('/history') ? "solid" : "ghost"}
            >
              Historial
            </Button>
            
            <Menu>
              <MenuButton as={Button} colorScheme="blue" variant="ghost">
                Mi Cuenta
              </MenuButton>
              <MenuList color="black">
                <MenuItem as={RouterLink} to="/profile">Perfil</MenuItem>
                <MenuItem as={RouterLink} to="/settings">Configuración</MenuItem>
                <MenuItem onClick={handleSignOut}>Cerrar Sesión</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        ) : (
          // Menú para usuarios no autenticados
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="blue"
              variant={isActive('/login') ? "solid" : "ghost"}
            >
              Iniciar Sesión
            </Button>
            
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="blue"
              variant={isActive('/register') ? "solid" : "ghost"}
            >
              Registrarse
            </Button>
            
            <Button
              as={RouterLink}
              to="/about"
              colorScheme="blue"
              variant={isActive('/about') ? "solid" : "ghost"}
            >
              Acerca De
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Header;