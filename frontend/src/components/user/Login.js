import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  
  // Obtener URL de redirección si existe
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Colores
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    }
    
    if (!password) {
      errors.password = 'La contraseña es requerida';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Iniciar sesión
      await login(email, password, rememberMe);
      
      // Redireccionar
      navigate(from, { replace: true });
    } catch (err) {
      // El error ya será manejado por el contexto de autenticación
    }
  };
  
  // Limpiar errores al cambiar los campos
  const handleChange = (e) => {
    if (error) {
      clearError();
    }
    
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null
      });
    }
  };
  
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Inicia sesión en tu cuenta</Heading>
          <Text fontSize={'lg'} color={textColor}>
            para continuar explorando tus sueños ✨
          </Text>
        </Stack>
        
        <Box
          rounded={'lg'}
          bg={cardBg}
          boxShadow={'lg'}
          p={8}
          width={{ base: 'xs', sm: 'sm', md: 'md' }}
        >
          {error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired isInvalid={formErrors.email}>
                <FormLabel>Correo electrónico</FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleChange(e);
                    }}
                    placeholder="tu@correo.com"
                  />
                  <InputRightElement>
                    <Icon as={FaEnvelope} color="gray.400" />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="password" isRequired isInvalid={formErrors.password}>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleChange(e);
                    }}
                    placeholder="••••••••"
                  />
                  <InputRightElement cursor="pointer" onClick={() => setShowPassword(!showPassword)}>
                    <Icon as={showPassword ? FaEyeSlash : FaEye} color="gray.400" />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formErrors.password}</FormErrorMessage>
              </FormControl>
              
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Checkbox
                    isChecked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    Recordarme
                  </Checkbox>
                  <Link as={RouterLink} to="/forgot-password" color={'blue.400'}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Stack>
                
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  isLoading={loading}
                  loadingText="Iniciando sesión"
                >
                  Iniciar Sesión
                </Button>
              </Stack>
              
              <Stack pt={6}>
                <Text align={'center'}>
                  ¿No tienes una cuenta?{' '}
                  <Link as={RouterLink} to="/register" color={'blue.400'}>
                    Regístrate
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;