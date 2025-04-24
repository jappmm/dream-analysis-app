// src/components/analysis/InsightCard.js
import React from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const InsightCard = ({ title, description }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderColor={border}
      borderRadius="xl"
      bg={bg}
    >
      <Heading fontSize="lg" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm">{description}</Text>
    </Box>
  );
};

export default InsightCard;
