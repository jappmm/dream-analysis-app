import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Dream Analysis App
          </Heading>
          <Text fontSize="xl">
            Bienvenido a la aplicación de análisis de sueños.
          </Text>
        </Box>

        <HStack spacing={4} justify="center">
          <Button
            as={RouterLink}
            to="/login"
            colorScheme="brand"
            size="lg"
          >
            Iniciar sesión
          </Button>
          <Button
            as={RouterLink}
            to="/register"
            colorScheme="brand"
            variant="outline"
            size="lg"
          >
            Registrarse
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Home;