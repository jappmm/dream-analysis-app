// src/components/LoadingSpinner.js
import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <Flex direction="column" align="center" justify="center" h="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text mt={4} color="gray.600" fontWeight="medium">
        {message}
      </Text>
    </Flex>
  );
};

export default LoadingSpinner;