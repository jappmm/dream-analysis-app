import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  Text,
  VStack,
  Tooltip,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import useDreams from '../../hooks/useDreams';
import Loader from '../common/Loader';

const SymbolsExplorer = () => {
  const toast = useToast();
  const { getSymbols, loading, error } = useDreams();
  
  const [symbols, setSymbols] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  
  // Colores
  const cardBg = useColorModeValue('white', 'gray.800');
  const highlightBg = useColorModeValue('blue.50', 'blue.900');
  
  // Cargar símbolos al montar el componente
  useEffect(() => {
    fetchSymbols();
  }, []);
  
  // Filtrar símbolos cuando cambia la búsqueda
  useEffect(() => {
    if (search) {
      const filtered = symbols.filter(symbol => 
        symbol._id.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSymbols(filtered);
    } else {
      setFilteredSymbols(symbols);
    }
  }, [search, symbols]);
  
  const fetchSymbols = async () => {
    try {
      const data = await getSymbols();
      setSymbols(data);
      setFilteredSymbols(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los símbolos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleSymbolClick = (symbol) => {
    setSelectedSymbol(symbol);
  };
  
  if (loading && symbols.length === 0) {
    return <Loader text="Cargando símbolos..." />;
  }
  
  return (
    <Box>
      <Card mb={6}>
        <CardHeader>
          <Heading size="lg">Explorador de Símbolos</Heading>
        </CardHeader>
        
        <Divider />
        
        <CardBody>
          <Text mb={4}>
            Explora los símbolos que han aparecido en tus sueños y sus interpretaciones.
            Esto te ayudará a identificar patrones y significados recurrentes.
          </Text>
          
          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Buscar símbolos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={6}
          >
            <VStack align="stretch" flex="1" spacing={4} minW="200px" maxW={{ base: "100%", md: "300px" }}>
              <Heading size="sm" mb={2}>Símbolos ({filteredSymbols.length})</Heading>
              
              {filteredSymbols.length === 0 ? (
                <Text>No se encontraron símbolos</Text>
              ) : (
                <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto" pr={2}>
                  {filteredSymbols.map((symbol) => (
                    <Button
                      key={symbol._id}
                      variant="ghost"
                      justifyContent="flex-start"
                      py={2}
                      onClick={() => handleSymbolClick(symbol)}
                      bg={selectedSymbol?._id === symbol._id ? highlightBg : undefined}
                      _hover={{ bg: highlightBg }}
                    >
                      <Flex justify="space-between" w="100%" align="center">
                        <Text>{symbol._id}</Text>
                        <Tag size="sm" colorScheme="blue">{symbol.count}</Tag>
                      </Flex>
                    </Button>
                  ))}
                </VStack>
              )}
            </VStack>
            
            <Box flex="2">
              {selectedSymbol ? (
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">{selectedSymbol._id}</Heading>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <Heading size="sm" mb={3}>Interpretaciones:</Heading>
                    <VStack align="stretch" spacing={4}>
                      {selectedSymbol.interpretations.map((interpretation, index) => (
                        <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                          <Text>{interpretation}</Text>
                        </Box>
                      ))}
                    </VStack>
                    
                    <Text mt={6} fontSize="sm" color="gray.500">
                      Aparece en {selectedSymbol.count} sueño{selectedSymbol.count !== 1 ? 's' : ''}
                    </Text>
                  </CardBody>
                </Card>
              ) : (
                <Flex 
                  height="100%" 
                  justify="center" 
                  align="center" 
                  p={8} 
                  borderWidth="1px"
                  borderRadius="md"
                  borderStyle="dashed"
                >
                  <Text color="gray.500">
                    Selecciona un símbolo para ver sus interpretaciones
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default SymbolsExplorer;