import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulación de registro exitoso
      console.log("Registrando usuario:", formData);
      
      // Pausa simulada
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular inicio de sesión automático después del registro
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: 'Registro exitoso',
          description: '¡Tu cuenta ha sido creada correctamente!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirigir al inicio
        navigate('/');
      }
    } catch (error) {
      console.error("Error en registro:", error);
      
      toast({
        title: 'Error al registrarse',
        description: 'Ha ocurrido un problema al crear tu cuenta. Intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="lg" borderRadius="lg">
      <Heading mb={4}>Crear cuenta</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Tu nombre completo"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Correo electrónico</FormLabel>
            <Input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange}
              placeholder="********"
            />
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="teal" 
            isLoading={isSubmitting} 
            width="full"
          >
            Registrarse
          </Button>
        </VStack>
      </form>
      
      <Text mt={4} textAlign="center">
        ¿Ya tienes cuenta? <Link to="/login" style={{color: "#3182ce"}}>Inicia sesión</Link>
      </Text>
    </Box>
  );
};

export default Register;