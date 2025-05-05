// src/components/analysis/ReflectionResponse.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

const ReflectionResponse = ({ response }) => {
  const bg = useColorModeValue('gray.100', 'gray.700');

  if (!response) {
    return (
      <Box p={6} bg={bg} rounded="xl" shadow="md">
        <Text>No hay respuestas de reflexión disponibles.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bg} rounded="xl" shadow="md">
      <VStack spacing={4} align="start">
        <Heading as="h4" size="md">
          Reflexión personal
        </Heading>
        <Divider />
        <Text whiteSpace="pre-line">{response}</Text>
      </VStack>
    </Box>
  );
};

export default ReflectionResponse;
