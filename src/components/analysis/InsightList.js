// src/components/analysis/InsightList.js
import React from 'react';
import { SimpleGrid, Heading, Box } from '@chakra-ui/react';
import InsightCard from './InsightCard';

const InsightList = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <Box py={10}>
        <Heading size="sm" textAlign="center">
          No se encontraron insights.
        </Heading>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
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

export default InsightList;

