import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  SimpleGrid, 
  VStack,
  HStack,
  Icon,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiEdit, FiClock, FiBarChart2 } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import { useDreams } from '../contexts/DreamContext';
import DreamCard from '../components/DreamCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();
  const { getDreams } = useDreams();
  const [recentDreams, setRecentDreams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colores
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const actionBg = useColorModeValue('blue.50', 'blue.900');
  
  // Cargar sueños recientes al montar el componente
  useEffect(() => {
    const loadDreams = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          // Utilizamos el localStorage directamente como alternativa temporal
          const stored = localStorage.getItem('dreams');
          const allDreams = stored ? JSON.parse(stored) : [];
          const userDreams = allDreams
            .filter(dream => dream.userId === user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
          
          setRecentDreams(userDreams);
        } catch (error) {
          console.error('Error al cargar sueños:', error);
        } finally {
          // Asegurarnos de que loading se establece a false
          setLoading(false);
        }
      } else {
        // Si no hay usuario, no cargamos sueños pero establecemos loading a false
        setLoading(false);
      }
    };
    
    loadDreams();
    
    // Añadimos un temporizador de seguridad para garantizar que loading se establezca a false
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(safetyTimer);
  }, [user]);

  return (
    <Container maxW="container.xl" py={8}>
      {/* Sección de bienvenida */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" mb={4} fontSize="3xl">
          Bienvenido{user?.name ? `, ${user.name}` : ''}
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="800px" mx="auto">
          Explora tus sueños y descubre los patrones que revelan sobre tu subconsciente. 
          Nuestra IA te ayuda a entender tus experiencias oníricas de manera segura y confidencial.
        </Text>
      </Box>

      {/* Acciones rápidas */}
      <Box mb={10}>
        <Heading as="h2" size="lg" mb={6}>
          Acciones Rápidas
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Link to="/register-dream">
            <Box 
              p={6} 
              bg={actionBg} 
              borderRadius="lg" 
              shadow="md"
              _hover={{ transform: "translateY(-5px)", transition: "all 0.3s ease" }}
            >
              <HStack spacing={4}>
                <Icon as={FiEdit} boxSize={10} color="blue.500" />
                <VStack align="start" spacing={2}>
                  <Heading as="h3" size="md">Registrar Sueño</Heading>
                  <Text>Anota un nuevo sueño para analizarlo</Text>
                </VStack>
              </HStack>
            </Box>
          </Link>
          
          <Link to="/history">
            <Box 
              p={6} 
              bg={actionBg} 
              borderRadius="lg" 
              shadow="md"
              _hover={{ transform: "translateY(-5px)", transition: "all 0.3s ease" }}
            >
              <HStack spacing={4}>
                <Icon as={FiClock} boxSize={10} color="purple.500" />
                <VStack align="start" spacing={2}>
                  <Heading as="h3" size="md">Historial</Heading>
                  <Text>Revisa tus sueños anteriores</Text>
                </VStack>
              </HStack>
            </Box>
          </Link>
          
          <Link to="/insights">
            <Box 
              p={6} 
              bg={actionBg} 
              borderRadius="lg" 
              shadow="md"
              _hover={{ transform: "translateY(-5px)", transition: "all 0.3s ease" }}
            >
              <HStack spacing={4}>
                <Icon as={FiBarChart2} boxSize={10} color="green.500" />
                <VStack align="start" spacing={2}>
                  <Heading as="h3" size="md">Insights</Heading>
                  <Text>Descubre patrones en tus sueños</Text>
                </VStack>
              </HStack>
            </Box>
          </Link>
        </SimpleGrid>
      </Box>

      {/* Sueños recientes */}
      <Box mb={10}>
        <Flex justify="space-between" mb={6}>
          <Heading as="h2" size="lg">Sueños Recientes</Heading>
          <Link to="/history">
            <Button variant="link" colorScheme="blue">Ver todos →</Button>
          </Link>
        </Flex>
        
        {loading ? (
          <LoadingSpinner message="Cargando sueños recientes..." />
        ) : recentDreams.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {recentDreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
          </SimpleGrid>
        ) : (
          <Box p={10} textAlign="center" borderWidth="1px" borderRadius="lg" borderColor={cardBorder} bg={cardBg}>
            <Heading size="md" mb={4} color="gray.500">No hay sueños registrados</Heading>
            <Text mb={6}>Comienza a registrar tus sueños para recibir análisis detallados</Text>
            <Link to="/register-dream">
              <Button colorScheme="blue">Registrar mi primer sueño</Button>
            </Link>
          </Box>
        )}
      </Box>

      <Divider my={10} />

      {/* Sección informativa */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box>
          <Heading as="h3" size="md" mb={4}>¿Cómo funciona?</Heading>
          <VStack align="start" spacing={3}>
            <Text>1. Registra tus sueños con el mayor detalle posible</Text>
            <Text>2. Nuestra IA analiza los símbolos y patrones</Text>
            <Text>3. Recibe interpretaciones y preguntas para reflexionar</Text>
            <Text>4. Con el tiempo, descubre insights sobre tu mente inconsciente</Text>
          </VStack>
        </Box>
        
        <Box>
          <Heading as="h3" size="md" mb={4}>Beneficios</Heading>
          <VStack align="start" spacing={3}>
            <Text>• Mayor autoconocimiento y crecimiento personal</Text>
            <Text>• Identificación de patrones emocionales y psicológicos</Text>
            <Text>• Ayuda para procesar experiencias difíciles</Text>
            <Text>• Inspiración para la creatividad y resolución de problemas</Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Home;