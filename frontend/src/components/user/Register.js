import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  Select,
  Checkbox,
  Icon,
  IconButton,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  useDisclosure,
  Progress
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

// Componente para verificar seguridad de contraseña
const PasswordStrengthMeter = ({ password }) => {
  const rules = [
    { label: 'Al menos 8 caracteres', valid: password.length >= 8 },
    { label: 'Al menos una letra mayúscula', valid: /[A-Z]/.test(password) },
    { label: 'Al menos una letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Al menos un número', valid: /[0-9]/.test(password) },
    { label: 'Al menos un caracter especial', valid: /[^A-Za-z0-9]/.test(password) }
  ];
  
  const validRulesCount = rules.filter(rule => rule.valid).length;
  const strengthPercentage = (validRulesCount / rules.length) * 100;
  
  let strengthColor = 'red';
  if (strengthPercentage >= 80) strengthColor = 'green';
  else if (strengthPercentage >= 60) strengthColor = 'yellow';
  else if (strengthPercentage >= 40) strengthColor = 'orange';
  
  return (
    <Box mt={2}>
      <HStack justify="space-between" mb={1}>
        <Text fontSize="sm">Seguridad de contraseña:</Text>
        <Text fontSize="sm" fontWeight="bold" color={`${strengthColor}.500`}>
          {strengthPercentage < 40 && 'Débil'}
          {strengthPercentage >= 40 && strengthPercentage < 60 && 'Regular'}
          {strengthPercentage >= 60 && strengthPercentage < 80 && 'Buena'}
          {strengthPercentage >= 80 && 'Fuerte'}
        </Text>
      </HStack>
      
      <Progress value={strengthPercentage} size="sm" colorScheme={strengthColor} mb={2} />
      
      <Stack spacing={1}>
        {rules.map((rule, index) => (
          <HStack key={index} spacing={1}>
            <Icon 
              as={rule.valid ? FaCheck : FaTimes} 
              color={rule.valid ? 'green.500' : 'red.500'} 
              boxSize={3}
            />
            <Text fontSize="xs" color={rule.valid ? 'green.500' : 'red.500'}>
              {rule.label}
            </Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    dataSharing: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error, clearError } = useAuth();
  
  const { isOpen: isPasswordCheckOpen, onToggle: togglePasswordCheck } = useDisclosure();
  
  const navigate = useNavigate();
  
  // Colores
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'La contraseña debe incluir al menos una letra mayúscula';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'La contraseña debe incluir al menos una letra minúscula';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'La contraseña debe incluir al menos un número';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.age) {
      errors.age = 'Por favor ingresa tu edad';
    } else if (parseInt(formData.age) < 13) {
      errors.age = 'Debes tener al menos 13 años para registrarte';
    }
    
    if (!formData.gender) {
      errors.gender = 'Por favor selecciona tu género';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        demographics: {
          age: parseInt(formData.age),
          gender: formData.gender
        },
        preferences: {
          dataSharing: formData.dataSharing
        }
      };
      
      await register(userData);
      navigate('/registration-success');
    } catch (err) {
      // El error ya será manejado por el hook useAuth
    }
  };
  
  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Abrir validación de contraseña cuando el usuario comienza a escribirla
    if (name === 'password' && value && !isPasswordCheckOpen) {
      togglePasswordCheck();
    }
    
    // Limpiar error cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    // Limpiar error global
    if (error) {
      clearError();
    }
  };
  
  return (
    <Container maxW="lg" py={{ base: '12', md: '16' }} px={{ base: '4', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size={{ base: 'xl', md: '2xl' }}>Crea tu cuenta</Heading>
          <Text color={textColor}>
            Comienza a explorar el fascinante mundo de tus sueños y su significado
          </Text>
        </Stack>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription display="block">
                {error}
              </AlertDescription>
            </Box>
            <Button onClick={clearError} variant="ghost" size="sm">
              X
            </Button>
          </Alert>
        )}
        
        <Box
          py={{ base: '6', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={cardBg}
          boxShadow="md"
          borderRadius="xl"
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isRequired isInvalid={formErrors.username}>
                  <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
                  <InputGroup>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Tu nombre de usuario"
                    />
                    <InputRightElement>
                      <Icon as={FaUser} color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={formErrors.email}>
                  <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                  <InputGroup>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                    />
                    <InputRightElement>
                      <Icon as={FaEnvelope} color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={formErrors.password}>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => !isPasswordCheckOpen && togglePasswordCheck()}
                      placeholder="••••••••"
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                  
                  <Collapse in={isPasswordCheckOpen} animateOpacity>
                    <PasswordStrengthMeter password={formData.password} />
                  </Collapse>
                </FormControl>
                
                <FormControl isRequired isInvalid={formErrors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Confirmar contraseña</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
                </FormControl>
                
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={5}>
                  <FormControl isRequired isInvalid={formErrors.age}>
                    <FormLabel htmlFor="age">Edad</FormLabel>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min={13}
                      max={99}
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Tu edad"
                    />
                    <FormErrorMessage>{formErrors.age}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={formErrors.gender}>
                    <FormLabel htmlFor="gender">Género</FormLabel>
                    <Select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      placeholder="Selecciona tu género"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="no binario">No binario</option>
                      <option value="prefiero no decir">Prefiero no decir</option>
                      <option value="otro">Otro</option>
                    </Select>
                    <FormErrorMessage>{formErrors.gender}</FormErrorMessage>
                  </FormControl>
                </Stack>
                
                <FormControl>
                  <Checkbox
                    id="dataSharing"
                    name="dataSharing"
                    isChecked={formData.dataSharing}
                    onChange={handleChange}
                  >
                    Acepto compartir mis datos de forma anónima para investigación
                  </Checkbox>
                  <FormHelperText>
                    Tus datos serán anonimizados y solo se usarán con fines de investigación.
                  </FormHelperText>
                </FormControl>
              </Stack>
              
              <Stack spacing="6">
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={loading}
                  loadingText="Registrando"
                >
                  Crear cuenta
                </Button>
                
                <HStack spacing="1" justify="center">
                  <Text color={textColor}>¿Ya tienes una cuenta?</Text>
                  <Button variant="link" colorScheme="blue" as={RouterLink} to="/login">
                    Inicia sesión
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </form>
        </Box>
        
        <Text fontSize="sm" textAlign="center" color={textColor}>
          Al registrarte, aceptas nuestros{' '}
          <Link as={RouterLink} to="/terms" color="blue.500">
            Términos de servicio
          </Link>{' '}
          y{' '}
          <Link as={RouterLink} to="/privacy" color="blue.500">
            Política de privacidad
          </Link>
          .
        </Text>
      </Stack>
    </Container>
  );
};

export default Register;