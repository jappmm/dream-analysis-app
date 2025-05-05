// src/pages/About.js
import React from 'react';
import { Box, Heading, Text, Stack } from '@chakra-ui/react';

const About = () => {
  return (
    <Box maxW="3xl" mx="auto" p={6}>
      <Heading as="h2" size="xl" mb={4}>
        Acerca de esta aplicación
      </Heading>
      <Stack spacing={4}>
        <Text>
          Dream Analysis App es una plataforma para explorar, registrar y analizar tus sueños con la ayuda de inteligencia artificial.
        </Text>
        <Text>
          Puedes guardar sueños, descubrir patrones comunes, obtener insights y visualizaciones personalizadas sobre tu subconsciente.
        </Text>
        <Text>
          Esta aplicación es solo con fines informativos y de autoexploración, y no sustituye ningún diagnóstico o terapia profesional.
        </Text>
        <Text fontStyle="italic" color="gray.600">
          Gracias por usar Dream Analysis.
        </Text>
      </Stack>
    </Box>
  );
};

export default About;
