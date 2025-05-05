// src/pages/NotFound.js
import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box textAlign="center" py={20} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Página no encontrada
      </Text>
      <Text color="gray.500" mb={6}>
        Lo sentimos, la página que estás buscando no existe.
      </Text>

      <Button
        as={Link}
        to="/"
        colorScheme="teal"
        variant="solid"
      >
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFound;
