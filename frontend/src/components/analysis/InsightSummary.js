// src/components/analysis/InsightSummary.js
import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const InsightSummary = ({ summary }) => {
  if (!summary) {
    return <Text>No hay resumen disponible.</Text>;
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack align="start" spacing={3}>
        <Heading size="md">Resumen de Insights</Heading>
        <Text>{summary}</Text>
      </VStack>
    </Box>
  );
};

export default InsightSummary;
