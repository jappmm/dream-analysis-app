// src/components/dream/SymbolCard.js
import React from 'react';
import { Box, Text, Badge, useColorModeValue } from '@chakra-ui/react';

const SymbolCard = ({ symbol, meaning }) => {
  const bg = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="2xl"
      boxShadow="md"
      bg={bg}
      color={color}
    >
      <Badge colorScheme="purple" mb={2}>
        Símbolo
      </Badge>
      <Text fontWeight="bold" fontSize="xl" mb={1}>
        {symbol}
      </Text>
      <Text fontSize="md">{meaning}</Text>
    </Box>
  );
};

export default SymbolCard;
