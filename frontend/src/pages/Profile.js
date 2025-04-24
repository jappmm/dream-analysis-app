// src/pages/Profile.js
import React from 'react';
import { Box, Heading, Text, Avatar, VStack, Divider, Spinner } from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, isAuthenticating } = useAuth();
  
  if (isAuthenticating) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>No se ha iniciado sesión.</Text>
      </Box>
    );
  }
  
  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={4} align="center">
        <Avatar size="xl" name={user.name} />
        <Heading size="md">{user.name}</Heading>
        <Text color="gray.600">{user.email}</Text>
        <Divider />
        <Text fontSize="sm" color="gray.500">
          Fecha de creación: {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </VStack>
    </Box>
  );
};

export default Profile;