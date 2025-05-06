// src/components/analysis/InsightCard.js
import React from 'react';
import { Box, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaLightbulb } from 'react-icons/fa';

const InsightCard = ({ insight }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box 
      p={4} 
      borderRadius="lg" 
      boxShadow="sm"
      bg={bgColor}
      borderWidth="1px"
      borderColor="yellow.100"
      _hover={{
        boxShadow: "md",
        borderColor: "yellow.200"
      }}
      transition="all 0.2s"
    >
      <Box display="flex" alignItems="center" mb={3}>
        <Icon as={FaLightbulb} color="yellow.400" mr={2} />
        <Text fontWeight="medium">Insight</Text>
      </Box>
      <Text>{insight}</Text>
    </Box>
  );
};

export default InsightCard;