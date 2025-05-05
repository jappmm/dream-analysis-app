// src/components/analysis/InsightDetail.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Badge,
} from '@chakra-ui/react';

const InsightDetail = ({ insight }) => {
  if (!insight) return null;

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" shadow="sm">
      <VStack align="start" spacing={3}>
        <Heading as="h3" size="md">
          {insight.title}
        </Heading>
        {insight.category && (
          <Badge colorScheme="purple">{insight.category}</Badge>
        )}
        <Divider />
        <Text fontSize="sm" color="gray.500">
          {new Date(insight.date).toLocaleDateString()}
        </Text>
        <Text>{insight.description}</Text>
        {insight.keywords && (
          <Box>
            <Heading as="h4" size="sm" mt={4} mb={2}>
              Palabras clave
            </Heading>
            <VStack align="start" spacing={1}>
              {insight.keywords.map((word, i) => (
                <Badge key={i} variant="subtle" colorScheme="blue">
                  {word}
                </Badge>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default InsightDetail;
