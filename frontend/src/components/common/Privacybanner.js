import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  Stack,
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const PrivacyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Colores
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const buttonColorScheme = 'blue';
  
  useEffect(() => {
    // Verificar si el usuario ya ha aceptado
    const hasAccepted = localStorage.getItem('privacyAccepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setIsVisible(false);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg={bgColor}
      p={4}
      zIndex="banner"
      borderTopWidth={1}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      boxShadow="lg"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'center', md: 'center' }}
        maxW="container.xl"
        mx="auto"
        wrap="wrap"
      >
        <Text mb={{ base: 4, md: 0 }} fontSize="sm" color={textColor} mr={4}>
          Esta aplicación utiliza cookies y almacena datos para mejorar tu experiencia. 
          Al utilizarla, aceptas nuestra{' '}
          <Link as={RouterLink} to="/privacy" color="blue.500" fontWeight="medium">
            Política de Privacidad
          </Link>{' '}
          y{' '}
          <Link as={RouterLink} to="/terms" color="blue.500" fontWeight="medium">
            Términos de Servicio
          </Link>
          .
        </Text>
        <Stack direction="row" spacing={4}>
          <Button 
            size="sm" 
            onClick={handleAccept}
            colorScheme={buttonColorScheme}
          >
            Aceptar
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default PrivacyBanner;