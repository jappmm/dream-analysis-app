// src/pages/Analysis.js (versión con mejor manejo de errores)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid
} from '@chakra-ui/react';
import { FaChartPie, FaBrain, FaStream } from 'react-icons/fa';
import { useAnalysis } from '../hooks/useAnalysis';
import AnalysisResults from '../components/analysis/AnalysisResults';
import SymbolCard from '../components/analysis/SymbolCard';
import PatternList from '../components/analysis/PatternList';
import { useDreams } from '../contexts/DreamContext';

const Analysis = () => {
  const navigate = useNavigate();
  const { dreams } = useDreams();
  const { analysisResults, loading, error } = useAnalysis(); // Sin dreamId para análisis general
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="xl" display="flex" alignItems="center" fontSize="2xl">
            <Icon as={FaChartPie} mr={3} color="purple.400" />
            Análisis e Insights
          </Heading>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="sm"
          >
            Volver al Dashboard
          </Button>
        </Box>
        
        <Text color="gray.600" fontSize="sm">
          Descubre patrones, tendencias y insights basados en tus sueños registrados.
        </Text>
        
        {(!dreams || dreams.length === 0) ? (
          <Box p={6} borderRadius="lg" bg={bgColor} textAlign="center">
            <Heading size="md" mb={4} fontSize="lg">No hay sueños para analizar</Heading>
            <Text mb={6} fontSize="sm">Registra tus sueños para obtener un análisis personalizado.</Text>
            <Button 
              colorScheme="teal" 
              onClick={() => navigate('/dashboard')}
              size="sm"
            >
              Registrar un sueño
            </Button>
          </Box>
        ) : loading ? (
          <Box textAlign="center" py={8}>
            <Spinner size="lg" color="purple.500" />
            <Text mt={4} fontSize="sm">Generando análisis...</Text>
          </Box>
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">Error al realizar el análisis: {error}</Text>
          </Alert>
        ) : !analysisResults ? (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">No se pudieron generar resultados de análisis. Intenta nuevamente más tarde.</Text>
          </Alert>
        ) : (
          <Tabs colorScheme="purple" variant="enclosed" size="sm">
            <TabList>
              <Tab fontSize="sm"><Icon as={FaChartPie} mr={2} /> Vista General</Tab>
              <Tab fontSize="sm"><Icon as={FaBrain} mr={2} /> Patrones y Símbolos</Tab>
              <Tab fontSize="sm"><Icon as={FaStream} mr={2} /> Sueños Recientes</Tab>
            </TabList>
            
            <TabPanels>
              {/* Vista General */}
              <TabPanel>
                <AnalysisResults analysisData={analysisResults} />
              </TabPanel>
              
              {/* Patrones y Símbolos */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Box p={4} borderRadius="lg" bg={bgColor}>
                    <Heading as="h3" size="md" mb={3} fontSize="md">Símbolos Recurrentes</Heading>
                    {analysisResults && analysisResults.symbols && Object.keys(analysisResults.symbols).length > 0 ? (
                      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                        {Object.entries(analysisResults.symbols).map(([symbol, count]) => (
                          <SymbolCard key={symbol} symbol={symbol} count={count} />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Text fontSize="sm">No se han detectado símbolos recurrentes en tus sueños.</Text>
                    )}
                  </Box>
                  
                  <Box p={4} borderRadius="lg" bg={bgColor}>
                    <Heading as="h3" size="md" mb={3} fontSize="md">Patrones Identificados</Heading>
                    <PatternList patterns={analysisResults && analysisResults.patterns ? analysisResults.patterns : []} />
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Sueños Recientes */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  {dreams.slice(0, 6).map((dream) => (
                    <Box 
                      key={dream.id} 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="lg"
                      bg="white"
                      boxShadow="sm"
                      _hover={{ boxShadow: "md" }}
                      cursor="pointer"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Heading as="h3" size="sm" mb={2} fontSize="sm">
                        {dream.title}
                      </Heading>
                      <Text color="gray.500" fontSize="xs" mb={2}>
                        {new Date(dream.dream_date).toLocaleDateString()}
                      </Text>
                      <Text noOfLines={2} fontSize="sm">
                        {dream.content}
                      </Text>
                      <Button 
                        size="xs" 
                        mt={3} 
                        colorScheme="purple" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/dashboard');
                        }}
                      >
                        Ver detalles
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
    </Container>
  );
};

export default Analysis;