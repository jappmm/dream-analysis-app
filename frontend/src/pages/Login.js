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
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { useDreams } from '../contexts/DreamContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  
  // Modal para recuperación de contraseña
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { user } = useDreams();
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
      // Usamos directamente la API de Supabase para el inicio de sesión
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: '¡Bienvenido de nuevo!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redireccionar al dashboard
      navigate('/dream-journal');
      
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      
      // Mensajes de error más descriptivos según el tipo de error
      if (error.message && (error.message.includes('credentials') || error.message.includes('auth'))) {
        setMessage({
          type: 'error',
          text: 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.'
        });
      } else {
        setMessage({
          type: 'error',
          text: `Error: ${error.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}`
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar la recuperación de contraseña
  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, introduce tu correo electrónico',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const result = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'https://vocal-speculoos-3d7513.netlify.app/reset-password',
      });
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Correo enviado',
        description: 'Se ha enviado un enlace para restablecer tu contraseña.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar el correo de recuperación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
      
      <Text mt={2} textAlign="center">
        <Link 
          color="blue.500" 
          fontWeight="semibold"
          onClick={onOpen}
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Text>
      
      {/* Modal para recuperación de contraseña */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recuperar contraseña</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input 
                placeholder="Introduce tu correo electrónico" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePasswordReset}>
              Enviar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Login;