// src/components/DreamCard.js
import React from 'react';
import { Box, Heading, Text, Badge, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const DreamCard = ({ dream }) => {
  // Determinar el color del badge según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return 'green';
      case 'processing': return 'yellow';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={4}
      shadow="md"
      transition="all 0.2s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Badge colorScheme={getStatusColor(dream.status)}>
          {dream.status === 'analyzed' ? 'Analizado' : 
           dream.status === 'processing' ? 'Procesando' : 'Pendiente'}
        </Badge>
        <Text fontSize="sm" color="gray.500">
          {formatDate(dream.date)}
        </Text>
      </Flex>
      
      <Heading as="h3" size="md" mb={2} noOfLines={1}>
        {dream.title}
      </Heading>
      
      <Text noOfLines={2} mb={3} color="gray.600">
        {dream.narrative}
      </Text>
      
      <Link 
        as={RouterLink} 
        to={`/analysis/${dream.id}`}
        color="blue.500"
        fontWeight="medium"
      >
        Ver detalles →
      </Link>
    </Box>
  );
};

export default DreamCard;