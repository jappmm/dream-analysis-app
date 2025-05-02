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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Usamos las funciones de autenticación de Supabase a través del contexto
  const { signIn, user } = useDreams();
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
    if (!email.trim() || !password.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor, completa todos los campos'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Llamamos a la función de inicio de sesión de Supabase
      const result = await signIn(email, password);
      
      if (result.success) {
        toast({
          title: 'Inicio de sesión exitoso',
          description: '¡Bienvenido de nuevo!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al iniciar sesión. Verifica tus credenciales.'
        });
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
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
      <Heading size="xl" mb={6} textAlign="center">Iniciar Sesión</Heading>
      
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
              placeholder="Tu contraseña"
              size="lg"
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={isSubmitting}
            loadingText="Iniciando sesión"
            mt={4}
          >
            Iniciar Sesión
          </Button>
        </VStack>
      </form>
      
      <Text mt={6} textAlign="center">
        ¿No tienes una cuenta?{' '}
        <Link 
          color="blue.500" 
          fontWeight="semibold"
          onClick={() => navigate('/register')}
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          Regístrate aquí
        </Link>
      </Text>
    </Box>
  );
};

export default Login;