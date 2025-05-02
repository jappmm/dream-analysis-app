import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  Link, 
  useToast, 
  Alert, 
  AlertIcon 
} from '@chakra-ui/react';
import { useDreams } from '../contexts/DreamContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Usamos las funciones de autenticación de Supabase a través del contexto
  const { signUp, user } = useDreams();
  const navigate = useNavigate();
  const toast = useToast();

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor, completa todos los campos'
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Validación de seguridad de contraseña
    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 6 caracteres'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Llamamos a la función de registro de Supabase
      const result = await signUp(email, password);
      
      if (result.success) {
        toast({
          title: 'Registro exitoso',
          description: 'Se ha enviado un correo de confirmación a tu dirección de email.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Mostrar mensaje de confirmación
        setMessage({
          type: 'success',
          text: 'Cuenta creada correctamente. Por favor, revisa tu email para confirmar tu cuenta.'
        });
        
        // Redireccionar al login después de un breve retraso
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al crear la cuenta.'
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setMessage({
        type: 'error',
        text: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      maxW="450px"
      mx="auto"
      mt="100px" 
      p={8}
      borderRadius="lg"
      bg="white"
      boxShadow="lg"
    >
      <Heading size="xl" mb={6} textAlign="center">Crear Cuenta</Heading>
      
      {message && (
        <Alert status={message.type} mb={6} borderRadius="md">
          <AlertIcon />
          {message.text}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl isRequired>
            <FormLabel>Correo Electrónico</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              size="lg"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una contraseña"
              size="lg"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Confirmar Contraseña</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              size="lg"
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={isSubmitting}
            loadingText="Registrando"
            mt={4}
          >
            Crear Cuenta
          </Button>
        </VStack>
      </form>
      
      <Text mt={6} textAlign="center">
        ¿Ya tienes una cuenta?{' '}
        <Link 
          color="blue.500" 
          fontWeight="semibold"
          onClick={() => navigate('/login')}
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          Inicia sesión aquí
        </Link>
      </Text>
    </Box>
  );
};

export default Register;