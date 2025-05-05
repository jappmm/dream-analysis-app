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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setError('');
    
    try {
      const { error: signUpError } = await signUp(email, password);
      
      if (signUpError) throw signUpError;
      
      toast({
        title: 'Cuenta creada',
        description: 'Se ha enviado un correo de confirmación a tu dirección de email.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Error al crear la cuenta');
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Registrarse
          </Heading>
          <Text color="gray.600">
            Crea una cuenta para comenzar a analizar tus sueños
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

            <FormControl id="confirmPassword" isRequired isInvalid={error !== ''}>
              <FormLabel>Confirmar contraseña</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
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
              Registrarse
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <Text>
            ¿Ya tienes cuenta?{' '}
            <Link as={RouterLink} to="/login" color="brand.500">
              Inicia sesión
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

export default Register;