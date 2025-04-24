// src/components/analysis/InsightChart.js
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const InsightChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Box w="100%" h="300px" p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h3" size="sm" mb={4}>
        Evolución de Insights
      </Heading>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3182ce" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default InsightChart;
