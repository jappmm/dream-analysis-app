import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulamos un proceso de inicio de sesión
    setTimeout(() => {
      setIsLoading(false);
      alert('Funcionalidad de inicio de sesión aún no implementada');
    }, 1000);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Iniciar sesión
          </Heading>
          <Text color="gray.600">
            Ingresa tus credenciales para acceder a tu cuenta
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
              />
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              colorScheme="brand"
              type="submit"
              width="full"
              mt={4}
              isLoading={isLoading}
            >
              Iniciar sesión
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <Link as={RouterLink} to="/forgot-password" color="brand.500">
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>

        <Box textAlign="center">
          <Text>
            ¿No tienes cuenta?{' '}
            <Link as={RouterLink} to="/register" color="brand.500">
              Regístrate
            </Link>
          </Text>
        </Box>

        <Box textAlign="center">
          <Link as={RouterLink} to="/" color="brand.500">
            Volver a inicio
          </Link>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login;