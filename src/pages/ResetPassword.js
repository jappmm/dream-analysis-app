// src/pages/ResetPassword.js
import React, { useState } from 'react';
import {
  Box, Button, Container, FormControl, FormLabel, Input,
  Stack, Heading, Text, useColorModeValue, FormErrorMessage, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (newPassword !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setFormError(error.message);
      } else {
        setSuccessMessage('Contraseña actualizada exitosamente.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setFormError('Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Stack spacing={8}>
        <Stack textAlign="center">
          <Heading>Restablece tu contraseña</Heading>
          <Text color={textColor}>
            Introduce una nueva contraseña segura.
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
                <FormLabel>Nueva contraseña</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormControl>

              <FormControl isInvalid={!!formError}>
                <FormLabel>Confirmar nueva contraseña</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Guardando"
              >
                Actualizar Contraseña
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default ResetPassword;
