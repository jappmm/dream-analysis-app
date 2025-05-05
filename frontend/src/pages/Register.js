import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Stack, Heading, Text, Select, Checkbox, FormErrorMessage,
  useColorModeValue, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '../services/supabase'; // ✅ IMPORTACIÓN CORRECTA

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    dataSharing: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.email.trim()) errors.email = 'El correo electrónico es requerido';
    if (!formData.password) errors.password = 'La contraseña es requerida';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.age || parseInt(formData.age) < 13) errors.age = 'Debes tener al menos 13 años';
    if (!formData.gender) errors.gender = 'Selecciona tu género';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            age: parseInt(formData.age),
            gender: formData.gender,
            dataSharing: formData.dataSharing,
          },
        },
      });

      if (error) {
        setServerError(error.message);
      } else {
        alert('Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta.');
        navigate('/login');
      }
    } catch (err) {
      setServerError('Error al registrar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={12} px={6}>
      <Stack spacing={8}>
        <Stack textAlign="center">
          <Heading>Crea tu cuenta</Heading>
          <Text color={textColor}>Explora el mundo de tus sueños</Text>
        </Stack>

        {serverError && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <Box bg={cardBg} p={8} rounded="lg" shadow="md">
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isInvalid={formErrors.email} isRequired>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formErrors.password} isRequired>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formErrors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formErrors.confirmPassword} isRequired>
                <FormLabel>Confirmar contraseña</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formErrors.age} isRequired>
                <FormLabel>Edad</FormLabel>
                <Input
                  type="number"
                  name="age"
                  min="13"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Edad"
                />
                <FormErrorMessage>{formErrors.age}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formErrors.gender} isRequired>
                <FormLabel>Género</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Selecciona tu género"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no binario">No binario</option>
                  <option value="otro">Otro</option>
                </Select>
                <FormErrorMessage>{formErrors.gender}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <Checkbox
                  name="dataSharing"
                  isChecked={formData.dataSharing}
                  onChange={handleChange}
                >
                  Acepto compartir mis datos anónimos para investigación
                </Checkbox>
              </FormControl>

              <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Registrando">
                Registrarse
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default Register;
