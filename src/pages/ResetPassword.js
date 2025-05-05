import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const validatePasswords = () => {
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    setIsLoading(true);
    
    try {
      // Eliminamos la variable data que no se usaba
      const { error: resetError } = await supabase.auth.updateUser({
        password: password,
      });

      if (resetError) throw resetError;

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Usamos navigate para redirigir después de restablecer la contraseña
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al restablecer la contraseña",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={12}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl">
            Restablecer contraseña
          </Heading>
          <Text mt={4}>
            Introduce tu nueva contraseña.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="password" isRequired>
              <FormLabel>Nueva contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>
                La contraseña debe tener al menos 6 caracteres.
              </FormHelperText>
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirmar contraseña</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
              />
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              mt={6}
              colorScheme="blue"
              type="submit"
              width="full"
              isLoading={isLoading}
            >
              Restablecer contraseña
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ResetPassword;