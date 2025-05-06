// src/pages/AnalysisDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Divider,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue
} from '@chakra-ui/react';
import { FaArrowLeft, FaBrain } from 'react-icons/fa';
import { useAnalysis } from '../hooks/useAnalysis';
import AnalysisResults from '../components/analysis/AnalysisResults';
import { useDreams } from '../contexts/DreamContext';

const AnalysisDetail = () => {
  const { dreamId } = useParams();
  const navigate = useNavigate();
  const { dreams } = useDreams();
  const { analysisResults, loading, error } = useAnalysis(dreamId);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Encontrar el sueño actual
  const currentDream = dreams.find(dream => dream.id === dreamId);
  
  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/dashboard')}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/dreams')}>Sueños</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Análisis</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      
      <VStack spacing={6} align="stretch">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="xl" display="flex" alignItems="center">
            <Icon as={FaBrain} mr={3} color="purple.400" />
            Análisis de Sueño
          </Heading>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
        </Box>
        
        {currentDream && (
          <Box p={6} borderRadius="lg" bg={bgColor} mb={4}>
            <Heading as="h2" size="md" mb={2}>{currentDream.title}</Heading>
            <Text color="gray.500" fontSize="sm" mb={3}>
              Registrado el {new Date(currentDream.created_at).toLocaleDateString()}
            </Text>
            <Divider mb={3} />
            <Text whiteSpace="pre-wrap">{currentDream.content}</Text>
          </Box>
        )}
        
        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="purple.500" />
            <Text mt={4}>Analizando el sueño...</Text>
          </Box>
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>Error al realizar el análisis: {error}</Text>
          </Alert>
        ) : (
          <AnalysisResults dreamId={dreamId} analysisData={analysisResults} />
        )}
      </VStack>
    </Container>
  );
};

export default AnalysisDetail;