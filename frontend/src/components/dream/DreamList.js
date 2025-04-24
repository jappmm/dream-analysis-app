import React from 'react';
import {
  Box,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Spacer,
  IconButton
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const DreamList = ({ dreams, onDelete }) => {
  if (!dreams || dreams.length === 0) {
    return (
      <Box p={4}>
        <Text>No hay sueños registrados aún.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {dreams.map((dream) => (
        <Card key={dream.id} variant="outline">
          <CardHeader>
            <Flex>
              <Heading size="md">{dream.title}</Heading>
              <Spacer />
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Eliminar sueño"
                size="sm"
                colorScheme="red"
                onClick={() => onDelete(dream.id)}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>{dream.description}</Text>
            <Text mt={2} fontSize="sm" color="gray.500">
              Fecha: {new Date(dream.date).toLocaleDateString()}
            </Text>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

export default DreamList;
