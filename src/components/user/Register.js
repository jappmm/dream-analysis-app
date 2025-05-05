import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Container, FormControl, FormLabel, Input, InputGroup, 
  InputRightElement, Stack, Heading, Text, Select, Checkbox, 
  FormErrorMessage, Progress, HStack, Collapse, Icon, IconButton, Alert, AlertIcon, AlertTitle, AlertDescription, useDisclosure, useColorModeValue
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import { supabase } from '../services/supabase';

// Componente para medir fuerza de contraseña
const PasswordStrengthMeter = ({ password }) => {
  const rules = [
    { label: 'Al menos 8 caracteres', valid: password.length >= 8 },
    { label: 'Una mayúscula', valid: /[A-Z]/.test(password) },
    { label: 'Una minúscula', valid: /[a-z]/.test(password) },
    { label: 'Un número', valid: /[0-9]/.test(password) },
    { label: 'Un caracter especial', valid: /[^A-Za-z0-9]/.test(password) }
  ];

  const validCount = rules.filter(r => r.valid).length;
  const percentage = (validCount / rules.length) * 100;

  const color = percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : percentage >= 40 ? 'orange' : 'red';
  const label = percentage >= 80 ? 'Fuerte' : percentage >= 60 ? 'Buena' : percentage >= 40 ? 'Regular' : 'Débil';

  return (
    <Box mt={2}>
      <HStack justify="space-between">
        <Text fontSize="sm">Seguridad:</Text>
        <Text fontSize="sm" fontWeight="bold" color={`${color}.500`}>{label}</Text>
      </HStack>
      <Progress value={percentage} size="sm" colorScheme={color} mt={1} />
      <Stack spacing={1} mt={2}>
        {rules.map((rule, i) => (
          <HStack key={i}>
            <Icon as={rule.valid ? FaCheck : FaTimes} color={rule.valid ? 'green.500' : 'red.500'} boxSize={3} />
            <Text fontSize="xs" color={rule.valid ? 'green.500' : 'red.500'}>{rule.label}</Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', age: '', gender: '', dataSharing: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const { isOpen: showStrength, onToggle: toggleStrength } = useDisclosure();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });

    if (name === 'password' && value && !showStrength) toggleStrength();
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'No coincide';
    if (!formData.age || parseInt(formData.age) < 13) newErrors.age = 'Debes tener 13+ años';
    if (!formData.gender) newErrors.gender = 'Selecciona género';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const { email, password } = formData;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { age: parseInt(formData.age), gender: formData.gender, dataSharing: formData.dataSharing } }
    });

    if (error) {
      setServerError(error.message);
    } else {
      alert('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
      navigate('/login'); // o una página de éxito
    }
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container maxW="lg" py={12} px={6}>
      <Stack spacing={8}>
        <Stack textAlign="center">
          <Heading>Crea tu cuenta</Heading>
          <Text color={textColor}>Explora el mundo de tus sueños</Text>
        </Stack>

        {serverError && (
          <Alert status="error">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Box>
          </Alert>
        )}

        <Box bg={cardBg} p={8} rounded="lg" shadow="md">
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <Input name="email" value={formData.email} onChange={handleChange} type="email" required />
                  <InputRightElement><Icon as={FaEnvelope} /></InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    onFocus={!showStrength ? toggleStrength : undefined}
                    required
                  />
                  <InputRightElement>
                    <IconButton size="sm" variant="ghost" onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />} />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
                <Collapse in={showStrength}><PasswordStrengthMeter password={formData.password} /></Collapse>
              </FormControl>

              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" required />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.age}>
                <FormLabel>Edad</FormLabel>
                <Input name="age" value={formData.age} onChange={handleChange} type="number" min={13} required />
                <FormErrorMessage>{errors.age}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.gender}>
                <FormLabel>Género</FormLabel>
                <Select name="gender" value={formData.gender} onChange={handleChange} placeholder="Selecciona">
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no binario">No binario</option>
                  <option value="otro">Otro</option>
                </Select>
                <FormErrorMessage>{errors.gender}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <Checkbox name="dataSharing" isChecked={formData.dataSharing} onChange={handleChange}>
                  Acepto compartir mis datos anónimos para investigación
                </Checkbox>
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg">Registrarme</Button>
            </Stack>
          </form>
        </Box>

        <Text fontSize="sm" textAlign="center" color={textColor}>
          ¿Ya tienes cuenta?{' '}
          <Button as={RouterLink} to="/login" variant="link" colorScheme="blue">Inicia sesión</Button>
        </Text>
      </Stack>
    </Container>
  );
};

export default Register;
