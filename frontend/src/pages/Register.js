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
import { supabase } from '../supabaseClient'; // Importamos directamente supabase

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  
  // Modal para recuperación de contraseña
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Usamos las funciones de autenticación tanto del contexto como directamente
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
      // Usamos directamente la API de Supabase para el registro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Mostrar mensaje de confirmación
      setMessage({
        type: 'success',
        text: 'Cuenta creada correctamente. Ya puedes iniciar sesión con tus credenciales.'
      });
      
      // Redireccionar al login después de un breve retraso
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Mensajes de error más descriptivos según el tipo de error
      if (error.message.includes('email')) {
        setMessage({
          type: 'error',
          text: 'El correo electrónico ya está registrado o no es válido.'
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
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
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

export default Register;