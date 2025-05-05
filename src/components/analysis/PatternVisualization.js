// src/components/analysis/PatternVisualization.js
import React from 'react';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';

const PatternVisualization = ({ patterns }) => {
  if (!patterns || patterns.length === 0) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text>No se han detectado patrones en los sueños.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
      <Heading size="md" mb={4}>
        Visualización de Patrones
      </Heading>
      <VStack align="start" spacing={4}>
        {patterns.map((pattern, index) => (
          <Box key={index} p={3} w="100%" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text fontWeight="bold">Patrón: {pattern.name}</Text>
            <Text>Frecuencia: {pattern.frequency}</Text>
            <Divider />
            <Text color="gray.600" fontSize="sm">
              Descripción: {pattern.description}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default PatternVisualization;
