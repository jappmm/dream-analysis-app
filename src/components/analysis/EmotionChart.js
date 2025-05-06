// src/components/analysis/EmotionChart.js
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const EmotionChart = ({ data }) => {
  // Traducir nombres de emociones para mostrar
  const translatedLabels = data.labels.map(label => {
    const translations = {
      alegría: 'Alegría',
      tristeza: 'Tristeza',
      miedo: 'Miedo',
      ansiedad: 'Ansiedad',
      calma: 'Calma',
      ira: 'Ira',
      confusión: 'Confusión',
      sorpresa: 'Sorpresa'
    };
    return translations[label] || label;
  });
  
  // Configurar datos para el gráfico
  const chartData = {
    labels: translatedLabels,
    datasets: data.datasets
  };
  
  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };
  
  return (
    <Box>
      {data.labels.length > 0 ? (
        <Box height="300px">
          <Pie data={chartData} options={options} />
        </Box>
      ) : (
        <Text textAlign="center">No hay suficientes datos emocionales para mostrar un gráfico.</Text>
      )}
    </Box>
  );
};

export default EmotionChart;