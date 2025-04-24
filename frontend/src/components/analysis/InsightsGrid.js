// src/components/analysis/InsightsGrid.js
import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import InsightCard from './InsightCard';

const InsightsGrid = ({ insights }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      {insights.map((insight, index) => (
        <InsightCard
          key={index}
          title={insight.title}
          description={insight.description}
        />
      ))}
    </SimpleGrid>
  );
};

export default InsightsGrid;
