import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) throw signInError;
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de nuevo.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    }
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

            <FormControl id="password" isRequired isInvalid={error !== ''}>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>

            <Button
              colorScheme="brand"
              type="submit"
              width="full"
              mt={4}
              isLoading={loading}
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