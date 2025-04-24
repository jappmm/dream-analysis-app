// src/components/analysis/PatternInsights.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  Divider,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

const PatternInsights = ({ insights }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');

  if (!insights || insights.length === 0) {
    return (
      <Box p={6} bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="lg">
        <Text fontStyle="italic" color="gray.500">Aún no hay insights generados para tus sueños.</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={6}>
      {insights.map((insight, index) => (
        <Box
          key={index}
          p={6}
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <Stack direction="row" justify="space-between" align="center">
            <Heading size="md">{insight.title}</Heading>
            <Badge colorScheme="purple">{insight.category}</Badge>
          </Stack>
          <Divider my={2} />
          <Text mt={2} fontSize="sm" color="gray.600">{insight.description}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default PatternInsights;
