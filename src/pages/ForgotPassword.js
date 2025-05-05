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
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { resetPassword, loading } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) throw resetError;
      
      toast({
        title: 'Correo enviado',
        description: 'Se ha enviado un enlace para restablecer tu contraseña.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setError(error.message || 'Error al enviar el correo de recuperación');
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Recuperar contraseña
          </Heading>
          <Text color="gray.600">
            Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired isInvalid={error !== ''}>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
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
              Enviar enlace de recuperación
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <Link as={RouterLink} to="/login" color="brand.500">
            Volver a iniciar sesión
          </Link>
        </Box>
      </VStack>
    </Container>
  );
};

export default ForgotPassword;