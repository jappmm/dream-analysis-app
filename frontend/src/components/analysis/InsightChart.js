// src/components/analysis/InsightChart.js
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const InsightChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="sm">
      <Heading as="h3" size="md" mb={4}>
        Frecuencia de insights por categoría
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default InsightChart;
