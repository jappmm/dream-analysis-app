// src/components/ReflectionQuestion.js
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const ReflectionQuestion = ({ question, index }) => {
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="md"
      borderColor="blue.200"
      bg="blue.50"
    >
      <Text fontWeight="medium">
        {index + 1}. {question}
      </Text>
    </Box>
  );
};

export default ReflectionQuestion;