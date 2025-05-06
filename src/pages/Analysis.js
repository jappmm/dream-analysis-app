// src/pages/Analysis.js
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
          <Heading as="h1" size="xl" display="flex" alignItems="center">
            <Icon as={FaChartPie} mr={3} color="purple.400" />
            Análisis e Insights
          </Heading>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
          >
            Dashboard
          </Button>
        </Box>
        
        <Text color="gray.600">
          Descubre patrones, tendencias y insights basados en tus sueños registrados.
        </Text>
        
        {dreams.length === 0 ? (
          <Box p={8} borderRadius="lg" bg={bgColor} textAlign="center">
            <Heading size="md" mb={4}>No hay sueños para analizar</Heading>
            <Text mb={6}>Registra tus sueños para obtener un análisis personalizado.</Text>
            <Button 
              colorScheme="teal" 
              onClick={() => navigate('/dashboard')}
            >
              Registrar un sueño
            </Button>
          </Box>
        ) : loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="purple.500" />
            <Text mt={4}>Generando análisis...</Text>
          </Box>
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>Error al realizar el análisis: {error}</Text>
          </Alert>
        ) : (
         <Tabs colorScheme="purple" variant="enclosed">
            <TabList>
              <Tab><Icon as={FaChartPie} mr={2} /> Vista General</Tab>
              <Tab><Icon as={FaBrain} mr={2} /> Patrones y Símbolos</Tab>
              <Tab><Icon as={FaStream} mr={2} /> Sueños Recientes</Tab>
            </TabList>
            
            <TabPanels>
              {/* Vista General */}
              <TabPanel>
                <AnalysisResults analysisData={analysisResults} />
              </TabPanel>
              
              {/* Patrones y Símbolos */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box p={6} borderRadius="lg" bg={bgColor}>
                    <Heading as="h3" size="md" mb={4}>Símbolos Recurrentes</Heading>
                    {Object.keys(analysisResults.symbols).length > 0 ? (
                      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                        {Object.entries(analysisResults.symbols).map(([symbol, count]) => (
                          <SymbolCard key={symbol} symbol={symbol} count={count} />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Text>No se han detectado símbolos recurrentes en tus sueños.</Text>
                    )}
                  </Box>
                  
                  <Box p={6} borderRadius="lg" bg={bgColor}>
                    <Heading as="h3" size="md" mb={4}>Patrones Identificados</Heading>
                    <PatternList patterns={analysisResults.patterns} />
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Sueños Recientes */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {dreams.slice(0, 6).map((dream) => (
                    <Box 
                      key={dream.id} 
                      p={5} 
                      borderWidth="1px" 
                      borderRadius="lg"
                      bg="white"
                      boxShadow="sm"
                      _hover={{ boxShadow: "md" }}
                      cursor="pointer"
                      onClick={() => navigate(`/analysis/${dream.id}`)}
                    >
                      <Heading as="h3" size="sm" mb={2}>
                        {dream.title}
                      </Heading>
                      <Text color="gray.500" fontSize="sm" mb={2}>
                        {new Date(dream.dream_date).toLocaleDateString()}
                      </Text>
                      <Text noOfLines={3}>
                        {dream.content}
                      </Text>
                      <Button 
                        size="sm" 
                        mt={3} 
                        colorScheme="purple" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/analysis/${dream.id}`);
                        }}
                      >
                        Ver análisis
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
                
                {dreams.length > 6 && (
                  <Box textAlign="center" mt={6}>
                    <Button onClick={() => navigate('/dreams')} colorScheme="teal" variant="outline">
                      Ver todos los sueños
                    </Button>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
    </Container>
  );
};

export default Analysis;