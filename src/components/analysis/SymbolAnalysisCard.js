// src/components/analysis/SymbolAnalysisCard.js
import React from 'react';
import {
  Box,
  Text,
  Badge,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

const SymbolAnalysisCard = ({ symbol, meaning, frequency }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      borderColor={borderColor}
      bg={bg}
      p={5}
      shadow="md"
    >
      <Stack spacing={3}>
        <Heading size="md">{symbol}</Heading>
        <Text fontSize="sm" color="gray.500">
          {meaning}
        </Text>
        <Badge colorScheme="purple" alignSelf="start">
          Aparece {frequency} veces
        </Badge>
      </Stack>
    </Box>
  );
};

export default SymbolAnalysisCard;
