import React from 'react';
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Dashboard
          </Heading>
          <Text fontSize="lg">
            Bienvenido, {user?.email || 'Usuario'}
          </Text>
        </Box>

        <Box p={6} bg="gray.50" borderRadius="md">
          <Heading as="h2" size="md" mb={4}>
            Tus sueños recientes
          </Heading>
          <Text color="gray.600">
            Aún no has registrado ningún sueño. ¡Comienza a registrar tus sueños para obtener análisis!
          </Text>
        </Box>

        <Box display="flex" justifyContent="center">
          <Button
            colorScheme="brand"
            size="lg"
            onClick={() => navigate('/register-dream')}
          >
            Registrar un nuevo sueño
          </Button>
        </Box>

        <Box textAlign="center" mt={8}>
          <Button
            variant="outline"
            colorScheme="brand"
            onClick={handleLogout}
            isLoading={loading}
          >
            Cerrar sesión
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;