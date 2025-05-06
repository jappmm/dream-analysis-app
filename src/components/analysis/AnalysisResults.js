// src/components/analysis/AnalysisResults.js
import React from 'react';
import {
  Box, 
  Heading, 
  Text, 
  VStack, 
  SimpleGrid, 
  Divider,
  Icon,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { FaLightbulb, FaBrain, FaRegSmile, FaRegSadTear, FaRegAngry, FaRegMeh } from 'react-icons/fa';
import InsightCard from './InsightCard';
import SymbolCard from './SymbolCard';
import EmotionChart from './EmotionChart';
import PatternList from './PatternList';

const AnalysisResults = ({ dreamId, analysisData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Si no hay datos de análisis
  if (!analysisData) {
    return (
      <Box p={6} borderRadius="lg" bg={bgColor} textAlign="center">
        <Heading size="md" mb={4}>Análisis no disponible</Heading>
        <Text>No hay suficientes datos para realizar un análisis detallado.</Text>
      </Box>
    );
  }
  
  // Si es análisis general
  if (analysisData.overview) {
    return (
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="lg" mb={4}>Análisis General de Sueños</Heading>
        
        {/* Sección de Insights */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            <Icon as={FaLightbulb} mr={2} color="yellow.400" />
            Principales Insights
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {analysisData.insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </SimpleGrid>
        </Box>
        
        <Divider />
        
        {/* Sección de Tendencias Emocionales */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            <Icon as={FaRegSmile} mr={2} color="blue.400" />
            Tendencias Emocionales
          </Heading>
          <Box p={4} borderRadius="lg" bg={cardBg} boxShadow="sm">
            <EmotionChart data={analysisData.emotionTrends.chartData} />
            <Text mt={4} fontWeight="medium">
              Emoción predominante: 
              <Badge ml={2} colorScheme={getEmotionColor(analysisData.emotionTrends.predominantEmotion)}>
                {capitalize(analysisData.emotionTrends.predominantEmotion)}
              </Badge>
            </Text>
          </Box>
        </Box>
        
        <Divider />
        
        {/* Sección de Símbolos Recurrentes */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            <Icon as={FaBrain} mr={2} color="purple.400" />
            Símbolos Recurrentes
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {Object.entries(analysisData.symbols).slice(0, 6).map(([symbol, count]) => (
              <SymbolCard key={symbol} symbol={symbol} count={count} />
            ))}
          </SimpleGrid>
        </Box>
        
        <Divider />
        
        {/* Sección de Patrones Identificados */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            <Icon as={FaRegMeh} mr={2} color="green.400" />
            Patrones Identificados
          </Heading>
          <PatternList patterns={analysisData.patterns} />
        </Box>
      </VStack>
    );
  }
  
  // Si es análisis individual de un sueño
  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="lg" mb={2}>{analysisData.title}</Heading>
      <Text color="gray.500">
        Análisis del sueño del {new Date(analysisData.date).toLocaleDateString()}
      </Text>
      
      {/* Sección de Emociones */}
      <Box p={5} borderRadius="lg" bg={cardBg} boxShadow="sm">
        <Heading as="h3" size="md" mb={3}>
          <Icon as={getEmotionIcon(analysisData.emotions.primaryEmotion)} mr={2} color={getEmotionIconColor(analysisData.emotions.primaryEmotion)} />
          Análisis Emocional
        </Heading>
        
        {analysisData.emotions.detected ? (
          <>
            <Text mb={3}>
              Emoción principal: <Badge colorScheme={getEmotionColor(analysisData.emotions.primaryEmotion)}>
                {capitalize(analysisData.emotions.primaryEmotion)}
              </Badge>
            </Text>
            <Text mb={3}>Intensidad emocional: {analysisData.emotions.intensity}/10</Text>
            
            <Heading as="h4" size="sm" mb={2}>Emociones detectadas:</Heading>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mb={3}>
              {Object.entries(analysisData.emotions.emotions).map(([emotion, percentage]) => (
                <Badge key={emotion} variant="subtle" colorScheme={getEmotionColor(emotion)}>
                  {capitalize(emotion)}: {percentage}%
                </Badge>
              ))}
            </SimpleGrid>
          </>
        ) : (
          <Text>No se detectaron emociones específicas en este sueño.</Text>
        )}
      </Box>
      
      {/* Sección de Símbolos */}
      <Box p={5} borderRadius="lg" bg={cardBg} boxShadow="sm">
        <Heading as="h3" size="md" mb={3}>
          <Icon as={FaBrain} mr={2} color="purple.400" />
          Símbolos Detectados
        </Heading>
        
        {Object.keys(analysisData.symbols).length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {Object.entries(analysisData.symbols).map(([symbol, data]) => (
              <SymbolCard key={symbol} symbol={symbol} data={data} />
            ))}
          </SimpleGrid>
        ) : (
          <Text>No se detectaron símbolos específicos en este sueño.</Text>
        )}
      </Box>
      
      {/* Sección de Interpretación */}
      <Box p={5} borderRadius="lg" bg={cardBg} boxShadow="sm">
        <Heading as="h3" size="md" mb={3}>
          <Icon as={FaLightbulb} mr={2} color="yellow.400" />
          Interpretación
        </Heading>
        
        <VStack spacing={3} align="stretch">
          {analysisData.interpretation.map((interp, index) => (
            <Text key={index}>{interp}</Text>
          ))}
        </VStack>
      </Box>
      
      {/* Sección de Recomendaciones */}
      <Box p={5} borderRadius="lg" bg={cardBg} boxShadow="sm">
        <Heading as="h3" size="md" mb={3}>
          <Icon as={FaLightbulb} mr={2} color="green.400" />
          Recomendaciones
        </Heading>
        
        <VStack spacing={3} align="stretch">
          {analysisData.recommendations.map((rec, index) => (
            <Box key={index} p={3} borderRadius="md" bg={bgColor}>
              <Text>{rec}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

// Funciones auxiliares
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getEmotionColor = (emotion) => {
  const colorMap = {
    alegría: 'yellow',
    tristeza: 'blue',
    miedo: 'red',
    ansiedad: 'orange',
    calma: 'teal',
    ira: 'red',
    confusión: 'purple',
    sorpresa: 'green',
    neutral: 'gray'
  };
  return colorMap[emotion] || 'gray';
};

const getEmotionIcon = (emotion) => {
  const iconMap = {
    alegría: FaRegSmile,
    tristeza: FaRegSadTear,
    miedo: FaRegMeh,
    ansiedad: FaRegMeh,
    calma: FaRegSmile,
    ira: FaRegAngry,
    confusión: FaRegMeh,
    sorpresa: FaRegSmile,
    neutral: FaRegMeh
  };
  return iconMap[emotion] || FaRegMeh;
};

const getEmotionIconColor = (emotion) => {
  const colorMap = {
    alegría: 'yellow.400',
    tristeza: 'blue.400',
    miedo: 'red.400',
    ansiedad: 'orange.400',
    calma: 'teal.400',
    ira: 'red.500',
    confusión: 'purple.400',
    sorpresa: 'green.400',
    neutral: 'gray.400'
  };
  return colorMap[emotion] || 'gray.400';
};

export default AnalysisResults;