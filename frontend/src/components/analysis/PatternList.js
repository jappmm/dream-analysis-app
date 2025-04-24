import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { FiLayers } from 'react-icons/fi';

const PatternList = ({ patterns = [] }) => {
  const bg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (patterns.length === 0) {
    return (
      <Box p={4} bg={bg} borderRadius="md" borderWidth={1} borderColor={borderColor}>
        <Text>No se encontraron patrones en tus sueños.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {patterns.map((pattern, index) => (
        <Box
          key={index}
          p={4}
          bg={bg}
          borderWidth={1}
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="sm"
        >
          <HStack spacing={3} align="start">
            <Icon as={FiLayers} boxSize={5} mt={1} color="teal.400" />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="bold">{pattern.title}</Text>
              <Text fontSize="sm" color="gray.500">{pattern.description}</Text>
              <HStack spacing={2} mt={2}>
                {pattern.tags?.map((tag, i) => (
                  <Badge key={i} colorScheme="purple">{tag}</Badge>
                ))}
              </HStack>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default PatternList;
