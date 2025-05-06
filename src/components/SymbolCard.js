// src/components/SymbolCard.js
import React from 'react';
import { Box, Heading, Text, Badge, Flex, useColorModeValue } from '@chakra-ui/react';

const SymbolCard = ({ symbol, count, data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Iconos y colores para cada categoría de símbolo
  const symbolInfo = {
    agua: { color: 'blue', description: 'Representa emociones y subconsciente' },
    fuego: { color: 'red', description: 'Simboliza transformación y pasión' },
    aire: { color: 'cyan', description: 'Relacionado con pensamientos e ideas' },
    tierra: { color: 'brown', description: 'Representa estabilidad y materialidad' },
    casa: { color: 'orange', description: 'Refleja aspectos del yo o identidad' },
    viaje: { color: 'green', description: 'Simboliza el camino de vida' },
    vehículos: { color: 'gray', description: 'Forma en que te mueves por la vida' },
    animales: { color: 'purple', description: 'Instintos y cualidades específicas' },
    personas: { color: 'pink', description: 'Aspectos de ti mismo o relaciones' },
    familia: { color: 'teal', description: 'Conexiones y dinámica familiar' },
    muerte: { color: 'gray', description: 'Transformación, finales, renovación' },
    cuerpo: { color: 'orange', description: 'Imagen personal y autoconcepto' },
    caída: { color: 'red', description: 'Inseguridad o pérdida de control' },
    vuelo: { color: 'blue', description: 'Libertad, perspectiva, superación' },
    persecución: { color: 'purple', description: 'Evasión o conflicto interno' },
    transformación: { color: 'green', description: 'Cambio personal y evolución' }
  };
  
  const info = symbolInfo[symbol] || { color: 'gray', description: 'Símbolo personal' };
  
  return (
    <Box 
      p={4} 
      borderRadius="lg" 
      boxShadow="sm"
      bg={bgColor}
      borderWidth="1px"
      borderColor={`${info.color}.100`}
      _hover={{
        boxShadow: "md",
        borderColor: `${info.color}.200`
      }}
      transition="all 0.2s"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Heading as="h4" size="sm" textTransform="capitalize">
          {symbol}
        </Heading>
        {count && (
          <Badge colorScheme={info.color}>{count}</Badge>
        )}
        {data && data.count && (
          <Badge colorScheme={info.color}>{data.count}</Badge>
        )}
      </Flex>
      
      <Text fontSize="sm" color="gray.600">
        {info.description}
      </Text>
      
      {data && data.terms && data.terms.length > 0 && (
        <Flex mt={2} flexWrap="wrap" gap={1}>
          {data.terms.map((term, index) => (
            <Badge key={index} colorScheme={info.color} variant="outline" size="sm">
              {term}
            </Badge>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default SymbolCard;