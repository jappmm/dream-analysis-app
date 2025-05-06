import React, { useState, useEffect } from 'react';
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
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading, user, authError } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Efecto para redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      return;
    }
    
    try {
      console.log('Attempting login with:', email);
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error('Login component error:', signInError);
        throw signInError;
      }
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Redirigiendo al dashboard...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Esperar un momento antes de redirigir para permitir que se actualice el estado
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      console.error('Login submission error:', errorMessage);
      setError(errorMessage);
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

        {authError && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

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