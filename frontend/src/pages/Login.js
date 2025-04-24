import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa email y contraseña',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Datos fijos para desarrollo
      // En producción aquí se conectaría al backend
      localStorage.setItem('dream_analysis_user', JSON.stringify({
        id: 'user_123',
        name: email.split('@')[0],
        email: email,
        createdAt: new Date().toISOString()
      }));
      localStorage.setItem('dream_analysis_token', 'fake_token_123');
      
      toast({
        title: 'Sesión iniciada',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Simular un pequeño retraso
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast({
        title: 'Error al iniciar sesión',
        description: 'Hubo un problema. Intenta nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">Iniciar Sesión</Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Correo electrónico</FormLabel>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full" 
            mt={4}
            isLoading={isLoading}
          >
            Iniciar sesión
          </Button>
        </VStack>
      </form>
      
      <Text mt={4} textAlign="center">
        ¿No tienes cuenta? {' '}
        <RouterLink to="/register" style={{color: "blue"}}>
          Regístrate
        </RouterLink>
      </Text>
    </Box>
  );
};

export default Login;