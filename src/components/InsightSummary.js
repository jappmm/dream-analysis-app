// src/components/InsightSummary.js
import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, Flex, Progress, Stat, StatLabel, StatNumber, StatGroup, SimpleGrid } from '@chakra-ui/react';

const InsightSummary = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    // Simulamos la carga de datos
    const loadInsights = async () => {
      setLoading(true);
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados
      setInsights({
        moodDistribution: {
          joy: 42,
          fear: 28,
          confusion: 15,
          sadness: 10,
          neutral: 5
        },
        recurringSymbols: [
          { name: 'Agua', count: 7 },
          { name: 'Vuelo', count: 5 },
          { name: 'Caída', count: 4 }
        ],
        totalDreams: 24,
        completionRate: 85
      });
      
      setLoading(false);
    };

    if (userId) {
      loadInsights();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box textAlign="center" py={6}>
        <Progress size="xs" isIndeterminate colorScheme="blue" />
        <Text mt={2} color="gray.500">Cargando insights...</Text>
      </Box>
    );
  }

  if (!insights) {
    return (
      <Box textAlign="center" py={6}>
        <Text color="gray.500">No hay suficientes datos para generar insights.</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={5} shadow="md">
      <Heading size="md" mb={4}>Resumen de Insights</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <Heading size="sm" mb={3}>Distribución de Emociones</Heading>
          <Box>
            <Flex align="center" mb={2}>
              <Text width="100px">Alegría</Text>
              <Progress value={insights.moodDistribution.joy} max={100} colorScheme="green" size="sm" flex="1" />
              <Text ml={2} fontWeight="medium">{insights.moodDistribution.joy}%</Text>
            </Flex>
            <Flex align="center" mb={2}>
              <Text width="100px">Miedo</Text>
              <Progress value={insights.moodDistribution.fear} max={100} colorScheme="orange" size="sm" flex="1" />
              <Text ml={2} fontWeight="medium">{insights.moodDistribution.fear}%</Text>
            </Flex>
            <Flex align="center" mb={2}>
              <Text width="100px">Confusión</Text>
              <Progress value={insights.moodDistribution.confusion} max={100} colorScheme="purple" size="sm" flex="1" />
              <Text ml={2} fontWeight="medium">{insights.moodDistribution.confusion}%</Text>
            </Flex>
            <Flex align="center" mb={2}>
              <Text width="100px">Tristeza</Text>
              <Progress value={insights.moodDistribution.sadness} max={100} colorScheme="blue" size="sm" flex="1" />
              <Text ml={2} fontWeight="medium">{insights.moodDistribution.sadness}%</Text>
            </Flex>
            <Flex align="center">
              <Text width="100px">Neutral</Text>
              <Progress value={insights.moodDistribution.neutral} max={100} colorScheme="gray" size="sm" flex="1" />
              <Text ml={2} fontWeight="medium">{insights.moodDistribution.neutral}%</Text>
            </Flex>
          </Box>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Estadísticas</Heading>
          <StatGroup>
            <Stat>
              <StatLabel>Sueños Registrados</StatLabel>
              <StatNumber>{insights.totalDreams}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Tasa de Completitud</StatLabel>
              <StatNumber>{insights.completionRate}%</StatNumber>
            </Stat>
          </StatGroup>
          
          <Heading size="sm" mt={4} mb={2}>Símbolos Recurrentes</Heading>
          {insights.recurringSymbols.map((symbol, index) => (
            <Flex key={index} justify="space-between" mb={1}>
              <Text>{symbol.name}</Text>
              <Text fontWeight="medium">{symbol.count} veces</Text>
            </Flex>
          ))}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default InsightSummary;