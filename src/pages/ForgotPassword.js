import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Mantenemos useNavigate pero lo comentamos para indicar que lo usaremos después
  // o podemos usarlo realmente para redirigir después de enviar el correo
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) throw error;

      toast({
        title: "Correo enviado",
        description: "Se ha enviado un enlace para restablecer tu contraseña al correo proporcionado.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Puedes usar navigate aquí para redirigir después de enviar el correo
      // Por ejemplo: navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al enviar el correo de restablecimiento",
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
            Recuperar contraseña
          </Heading>
          <Text mt={4}>
            Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </FormControl>

          <Button
            mt={6}
            colorScheme="blue"
            type="submit"
            width="full"
            isLoading={isLoading}
          >
            Enviar enlace de recuperación
          </Button>
        </Box>

        <Box textAlign="center">
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            colorScheme="blue"
          >
            Volver a iniciar sesión
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default ForgotPassword;