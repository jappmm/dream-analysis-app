import React from 'react';
import { Box, Text, Container } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" py={4} bg="gray.100">
      <Container maxW="container.xl">
        <Text textAlign="center" fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} Dream Analyzer. Todos los derechos reservados.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;