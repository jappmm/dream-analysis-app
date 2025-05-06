import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { supabase } from '../services/supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  // Extraer el hash de la URL cuando el componente se monta
  useEffect(() => {
    const hashFragment = window.location.hash;
    if (hashFragment) {
      setHash(hashFragment);
    } else {
      setError('No se encontró un token de restablecimiento válido en la URL.');
    }
  }, []);

  const validatePasswords = () => {
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Actualizar la contraseña del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido actualizada exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirigir al inicio de sesión después de unos segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setError(error.message || 'Ocurrió un error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Restablecer contraseña
          </Heading>
          <Text color="gray.600">
            Introduce tu nueva contraseña para restablecer tu cuenta
          </Text>
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="password" isRequired>
              <FormLabel>Nueva contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduce tu nueva contraseña"
              />
            </FormControl>

            <FormControl id="confirmPassword" isRequired isInvalid={error.includes('coinciden')}>
              <FormLabel>Confirmar contraseña</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
              />
              {error.includes('coinciden') && (
                <FormErrorMessage>{error}</FormErrorMessage>
              )}
            </FormControl>

            <Button
              colorScheme="brand"
              type="submit"
              width="full"
              mt={4}
              isLoading={loading}
            >
              Restablecer contraseña
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <Link href="/login" color="brand.500">
            Volver a inicio de sesión
          </Link>
        </Box>
      </VStack>
    </Container>
  );
};

export default ResetPassword;