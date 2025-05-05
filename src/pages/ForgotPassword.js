// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import {
  Box, Button, Container, FormControl, FormLabel, Input,
  Stack, Heading, Text, useColorModeValue, FormErrorMessage, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';
import { resetPassword } from '../services/supabaseClient'; // 👈 usamos la función correcta
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setFormError('Por favor, introduce un correo válido.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccessMessage('Te hemos enviado un correo para restablecer tu contraseña.');
    } catch (error) {
      setFormError(error.message || 'Error al solicitar el restablecimiento de contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Stack spacing={8}>
        <Stack textAlign="center">
          <Heading>¿Olvidaste tu contraseña?</Heading>
          <Text color={textColor}>
            Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.
          </Text>
        </Stack>

        {formError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Box p={8} bg={cardBg} rounded="lg" shadow="md">
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!formError}>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                />
                <FormErrorMessage>{formError}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Enviando"
              >
                Enviar enlace
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default ForgotPassword;
