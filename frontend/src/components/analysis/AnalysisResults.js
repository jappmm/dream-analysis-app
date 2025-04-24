// src/components/analysis/AnalysisResults.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

const AnalysisResults = ({ results }) => {
  const bg = useColorModeValue('gray.100', 'gray.700');

  if (!results || Object.keys(results).length === 0) {
    return (
      <Box p={6} bg={bg} borderRadius="md" boxShadow="md">
        <Text>No hay resultados de análisis disponibles.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bg} borderRadius="md" boxShadow="md">
      <Heading as="h3" size="lg" mb={4}>
        Resultados del Análisis
      </Heading>
      <VStack align="start" spacing={4}>
        {results.keywords && (
          <Box>
            <Text fontWeight="bold">Palabras Clave:</Text>
            <Text>{results.keywords.join(', ')}</Text>
          </Box>
        )}

        {results.symbols && results.symbols.length > 0 && (
          <Box>
            <Text fontWeight="bold">Símbolos:</Text>
            <VStack align="start" spacing={1}>
              {results.symbols.map((symbol, index) => (
                <Badge key={index} colorScheme="purple">
                  {symbol}
                </Badge>
              ))}
            </VStack>
          </Box>
        )}

        {results.meaning && (
          <Box>
            <Text fontWeight="bold">Interpretación:</Text>
            <Text>{results.meaning}</Text>
          </Box>
        )}

        {results.suggestions && (
          <Box>
            <Text fontWeight="bold">Sugerencias:</Text>
            <Text>{results.suggestions}</Text>
          </Box>
        )}

        {results.moodAnalysis && (
          <Box>
            <Text fontWeight="bold">Análisis Emocional:</Text>
            <Text>{results.moodAnalysis}</Text>
          </Box>
        )}
      </VStack>
      <Divider mt={6} />
    </Box>
  );
};

export default AnalysisResults;
