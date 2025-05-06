// src/pages/DreamDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Badge,
  Icon,
  useToast,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { FaArrowLeft, FaChartPie, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useDreams } from '../contexts/DreamContext';
import { useAnalysis } from '../hooks/useAnalysis';

const DreamDetail = () => {
  const { dreamId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { dreams, loading: dreamsLoading } = useDreams();
  const { analysisResults } = useAnalysis(dreamId);
  const bgColor = useColorModeValue('white', 'gray.800');
  const bgSecondary = useColorModeValue('gray.50', 'gray.700');
  
  // Encontrar el sueño actual
  const dream = dreams.find(d => d.id === dreamId);
  
  // Si el sueño no existe o está cargando
  if (dreamsLoading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>Cargando sueño...</Text>
      </Container>
    );
  }
  
  if (!dream) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Heading>Sueño no encontrado</Heading>
          <Text>El sueño que buscas no existe o ha sido eliminado.</Text>
          <Button onClick={() => navigate('/dashboard')} colorScheme="teal">
            Volver al dashboard
          </Button>
        </VStack>
      </Container>
    );
  }
  
  const handleDelete = async () => {
    // Aquí iría la lógica para eliminar el sueño
    toast({
      title: "Sueño eliminado",
      description: "El sueño ha sido eliminado correctamente",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate('/dashboard');
  };
  
  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/dashboard')}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Sueño</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      
      <VStack spacing={6} align="stretch">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="xl">
            Detalle del Sueño
          </Heading>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
        </Box>
        
        <Box p={6} borderRadius="lg" bg={bgColor} boxShadow="sm">
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Heading as="h2" size="lg">{dream.title}</Heading>
            <HStack>
              <Badge colorScheme="teal" display="flex" alignItems="center">
                <Icon as={FaCalendarAlt} mr={1} />
                {new Date(dream.dream_date).toLocaleDateString()}
              </Badge>
            </HStack>
          </Box>
          
          <Divider mb={4} />
          
          <Text whiteSpace="pre-wrap" mb={6}>{dream.content}</Text>
          
          <HStack spacing={4} mt={4}>
            <Button 
              leftIcon={<FaChartPie />} 
              colorScheme="purple" 
              onClick={() => navigate(`/analysis/${dream.id}`)}
            >
              Ver análisis
            </Button>
            <Button 
              leftIcon={<FaEdit />} 
              variant="outline"
              colorScheme="teal"
            >
              Editar
            </Button>
            <Button 
              leftIcon={<FaTrash />} 
              variant="outline"
              colorScheme="red"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </HStack>
        </Box>
        
        {analysisResults && (
          <Box p={6} borderRadius="lg" bg={bgSecondary}>
            <Heading as="h3" size="md" mb={4}>
              <Icon as={FaChartPie} mr={2} color="purple.400" />
              Insights Rápidos
            </Heading>
            
            {analysisResults.emotions && analysisResults.emotions.detected && (
              <Box mb={4}>
                <Text fontWeight="medium" mb={2}>
                  Emoción principal: 
                  <Badge ml={2} colorScheme={getEmotionColor(analysisResults.emotions.primaryEmotion)}>
                    {capitalize(analysisResults.emotions.primaryEmotion)}
                  </Badge>
                </Text>
              </Box>
            )}
            
            {analysisResults.symbols && Object.keys(analysisResults.symbols).length > 0 && (
              <Box mb={4}>
                <Text fontWeight="medium" mb={2}>Principales símbolos:</Text>
                <HStack spacing={2}>
                  {Object.keys(analysisResults.symbols).slice(0, 3).map(symbol => (
                    <Badge key={symbol} colorScheme="purple">{symbol}</Badge>
                  ))}
                </HStack>
              </Box>
            )}
            
            {analysisResults.interpretation && analysisResults.interpretation.length > 0 && (
              <Box>
                <Text fontWeight="medium" mb={2}>Interpretación clave:</Text>
                <Text>{analysisResults.interpretation[0]}</Text>
              </Box>
            )}
            
            <Button 
              mt={4}
              colorScheme="purple" 
              variant="outline"
              onClick={() => navigate(`/analysis/${dream.id}`)}
            >
              Ver análisis completo
            </Button>
          </Box>
        )}
      </VStack>
    </Container>
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

export default DreamDetail;