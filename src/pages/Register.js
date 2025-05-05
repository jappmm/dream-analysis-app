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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    
    // Simulamos un proceso de registro
    setTimeout(() => {
      setIsLoading(false);
      alert('Funcionalidad de registro aún no implementada');
    }, 1000);
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
              isLoading={isLoading}
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