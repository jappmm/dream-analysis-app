// src/components/analysis/InsightDetails.js
import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const InsightDetails = ({ insight }) => {
  if (!insight) {
    return <Text>No hay detalles disponibles.</Text>;
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <VStack align="start" spacing={3}>
        <Heading size="md">{insight.title}</Heading>
        <Text fontSize="sm" color="gray.500">
          {insight.date ? new Date(insight.date).toLocaleDateString() : 'Sin fecha'}
        </Text>
        <Text>{insight.description}</Text>
        {insight.keywords && (
          <Text fontSize="sm" color="gray.600">
            Palabras clave: {insight.keywords.join(', ')}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default InsightDetails;
