
import React from 'react';
import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Box as="header" bg="blue.500" color="white" p={4}>
      <Flex align="center" maxW="container.xl" mx="auto">
        <Heading size="md" as={Link} to="/">
          Dream Analyzer
        </Heading>
        <Spacer />
        <Flex gap={4}>
          {user ? (
            <>
              <Button as={Link} to="/profile" variant="ghost" colorScheme="whiteAlpha">
                Perfil
              </Button>
              <Button onClick={logout} variant="outline" colorScheme="whiteAlpha">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" colorScheme="whiteAlpha">
                Iniciar Sesión
              </Button>
              <Button as={Link} to="/register" variant="outline" colorScheme="whiteAlpha">
                Registrarse
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;