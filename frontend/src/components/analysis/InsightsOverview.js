// src/components/analysis/InsightsOverview.js
import React from 'react';
import { VStack, Heading, SimpleGrid } from '@chakra-ui/react';
import InsightCard from './InsightCard';

const mockInsights = [
  {
    title: 'Símbolo recurrente: Agua',
    description:
      'La presencia constante de agua en tus sueños puede reflejar tus emociones profundas o cambios emocionales recientes.',
  },
  {
    title: 'Tema dominante: Búsqueda',
    description:
      'Los sueños que involucran búsquedas o exploraciones indican una necesidad de propósito o dirección en tu vida.',
  },
  {
    title: 'Patrón de ansiedad',
    description:
      'Se ha detectado un patrón que sugiere ansiedad persistente, especialmente relacionado con entornos laborales o académicos.',
  },
];

const InsightsOverview = () => {
  return (
    <VStack spacing={6} align="start">
      <Heading size="lg">Resumen de Insights</Heading>
      <SimpleGrid columns={[1, null, 2]} spacing={5} w="full">
        {mockInsights.map((insight, idx) => (
          <InsightCard key={idx} title={insight.title} description={insight.description} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default InsightsOverview;
