// src/components/PatternItem.js
import React from 'react';
import { Box, Flex, Text, Heading, useColorModeValue } from '@chakra-ui/react';

const PatternItem = ({ pattern, index }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const isEven = index % 2 === 0;

  return (
    <Box 
      p={4} 
      borderBottomWidth={1} 
      borderColor={borderColor}
      bg={isEven ? bgColor : useColorModeValue('gray.50', 'gray.700')}
    >
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
      >
        <Box flex="1">
          <Heading as="h4" size="sm">{pattern.description}</Heading>
          <Text mt={1} color="gray.600">{pattern.significance}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default PatternItem;