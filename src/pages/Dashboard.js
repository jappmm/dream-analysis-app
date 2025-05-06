// src/pages/Dashboard.js (versión actualizada)
import React, { useState, useEffect } from 'react';
import {
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  SimpleGrid, 
  Textarea, 
  FormControl, 
  FormLabel, 
  Input,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Icon,
  Flex,
  Divider,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Link
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaCloudMoon, FaUser, FaRegCalendarAlt, FaChartPie, FaBrain } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useDreams } from '../contexts/DreamContext';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { dreams, loading, saveDream } = useDreams();
  const navigate = useNavigate();
  const toast = useToast();
  const [showDreamForm, setShowDreamForm] = useState(false);
  const [stats, setStats] = useState({
    totalDreams: 0,
    daysActive: 0,
    profileComplete: 'No'
  });
  const [newDream, setNewDream] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });

  const bg = useColorModeValue('gray.100', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Calcular estadísticas cuando cambian los sueños
  useEffect(() => {
    if (dreams.length > 0) {
      // Número total de sueños
      const totalDreams = dreams.length;
      
      // Días activos (días únicos con sueños registrados)
      const uniqueDays = new Set();
      dreams.forEach(dream => {
        if (dream.dream_date) {
          uniqueDays.add(dream.dream_date.split('T')[0]);
        }
      });
      const daysActive = uniqueDays.size;
      
      // Perfil completo (simple verificación)
      const profileComplete = user?.email ? 'Sí' : 'No';
      
      setStats({
        totalDreams,
        daysActive,
        profileComplete
      });
    }
  }, [dreams, user]);

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para manejar cambios en el formulario
  const handleDreamChange = (e) => {
    const { name, value } = e.target;
    setNewDream(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar un nuevo sueño
  const handleSaveDream = async (e) => {
    e.preventDefault();
    
    if (!newDream.title.trim() || !newDream.content.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const { data, error } = await saveDream(newDream);

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Sueño registrado',
        description: 'Tu sueño ha sido guardado exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Limpiar formulario y ocultar
      setNewDream({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowDreamForm(false);
      
    } catch (error) {
      console.error('Error al guardar el sueño:', error);
      toast({
        title: 'Error',
        description: `No se pudo guardar tu sueño: ${error.message || 'Error desconocido'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Bienvenido a Dreama
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Hola, {user?.email}. Aquí puedes ver un resumen de tu actividad y registrar nuevos sueños.
          </Text>
        </Box>

        {/* Estadísticas */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg={bg}>
            <VStack spacing={3}>
              <Icon as={FaCloudMoon} boxSize={6} color="teal.500" />
              <StatLabel>Sueños Registrados</StatLabel>
              <StatNumber>{stats.totalDreams}</StatNumber>
            </VStack>
          </Stat>
          <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg={bg}>
            <VStack spacing={3}>
              <Icon as={FaRegCalendarAlt} boxSize={6} color="teal.500" />
              <StatLabel>Días Activo</StatLabel>
              <StatNumber>{stats.daysActive}</StatNumber>
            </VStack>
          </Stat>
          <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg={bg}>
            <VStack spacing={3}>
              <Icon as={FaBrain} boxSize={6} color="purple.500" />
              <StatLabel>Análisis de Sueños</StatLabel>
              <Link onClick={() => navigate('/analysis')}>
                <StatNumber color="purple.500">Ver análisis</StatNumber>
              </Link>
            </VStack>
          </Stat>
        </SimpleGrid>

        <Divider my={4} />

        {/* Botón para mostrar/ocultar formulario */}
        <Box display="flex" justifyContent="center">
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => setShowDreamForm(!showDreamForm)}
          >
            {showDreamForm ? 'Cancelar' : 'Registrar un nuevo sueño'}
          </Button>
        </Box>

        {/* Formulario para registrar un nuevo sueño */}
        {showDreamForm && (
          <Box as="form" onSubmit={handleSaveDream} bg={bg} p={6} borderRadius="lg" shadow="md">
            <VStack spacing={4}>
              <Heading as="h2" size="md" mb={2}>
                Registrar nuevo sueño
              </Heading>
              
              <FormControl id="title" isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  name="title"
                  value={newDream.title}
                  onChange={handleDreamChange}
                  placeholder="Título descriptivo para tu sueño"
                  bg="white"
                />
              </FormControl>
              
              <FormControl id="date" isRequired>
                <FormLabel>Fecha del sueño</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={newDream.date}
                  onChange={handleDreamChange}
                  bg="white"
                />
              </FormControl>
              
              <FormControl id="content" isRequired>
                <FormLabel>Descripción del sueño</FormLabel>
                <Textarea
                  name="content"
                  value={newDream.content}
                  onChange={handleDreamChange}
                  placeholder="Describe tu sueño con todos los detalles que recuerdes..."
                  minH="200px"
                  bg="white"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={loading}
              >
                Guardar sueño
              </Button>
            </VStack>
          </Box>
        )}

        <Divider my={4} />

        {/* Tabs para navegar entre sueños y análisis */}
        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>Mis Sueños</Tab>
            <Tab>Análisis Rápido</Tab>
            <Tab>Recursos</Tab>
          </TabList>
          
          <TabPanels>
            {/* Panel de Sueños */}
            <TabPanel>
              {loading ? (
                <Text textAlign="center">Cargando tus sueños...</Text>
              ) : dreams.length === 0 ? (
                <Text color="gray.600" textAlign="center">
                  Aún no has registrado ningún sueño. ¡Comienza a registrar tus sueños para obtener análisis!
                </Text>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {dreams.map((dream) => (
                    <Box 
                      key={dream.id} 
                      p={5} 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      borderColor="gray.200"
                      boxShadow="sm"
                      _hover={{ boxShadow: "md" }}
                      cursor="pointer"
                      onClick={() => navigate(`/dream/${dream.id}`)}
                      bg="white"
                    >
                      <Heading as="h3" size="sm" mb={2}>
                        {dream.title}
                      </Heading>
                      <Text color="gray.500" fontSize="sm" mb={2}>
                        {new Date(dream.dream_date).toLocaleDateString()}
                      </Text>
                      <Text noOfLines={3}>
                        {dream.content}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
              
              {dreams.length > 0 && (
                <Flex justifyContent="center" mt={6}>
                  <Button 
                    leftIcon={<FaChartPie />}
                    colorScheme="purple" 
                    onClick={() => navigate('/analysis')}
                  >
                    Ver análisis completo
                  </Button>
                </Flex>
              )}
            </TabPanel>
            
            {/* Panel de Análisis Rápido */}
            <TabPanel>
              <Box textAlign="center" p={6} borderRadius="lg" bg={bg}>
                <Icon as={FaChartPie} boxSize={10} color="purple.500" mb={4} />
                <Heading as="h3" size="md" mb={4}>Análisis de tus sueños</Heading>
                
                {dreams.length === 0 ? (
                  <Text mb={4}>Registra tus sueños para obtener análisis personalizados</Text>
                ) : (
                  <>
                    <Text mb={6}>
                      Analiza tus sueños para descubrir patrones, tendencias y significados ocultos. Nuestro sistema
                      te mostrará insights basados en tus experiencias oníricas.
                    </Text>
                    <Button 
                      colorScheme="purple" 
                      onClick={() => navigate('/analysis')}
                      mb={4}
                    >
                      Ver análisis completo
                    </Button>
                  </>
                )}
              </Box>
            </TabPanel>
            
            {/* Panel de Recursos */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box p={5} borderRadius="lg" bg={cardBg} boxShadow="sm">
                  <Heading as="h3" size="md" mb={3}>Consejos para recordar sueños</Heading>
                  <Text mb={3}>
                    Mantén un cuaderno junto a tu cama para anotar tus sueños inmediatamente al despertar.
                  </Text>
                  <Text mb={3}>
                    Trata de despertarte naturalmente, sin alarma, para mejorar el recuerdo de tus sueños.
                  </Text>
                  <Text>
                    Antes de dormir, repítete que recordarás tus sueños al despertar.
                  </Text>
                </Box>
                
                <Box p={5} borderRadius="lg" bg={cardBg} boxShadow="sm">
                  <Heading as="h3" size="md" mb={3}>Cómo interpretar sueños</Heading>
                  <Text mb={3}>
                    Presta atención a tus emociones durante el sueño, son clave para su interpretación.
                  </Text>
                  <Text mb={3}>
                    Busca conexiones entre los símbolos de tus sueños y eventos de tu vida diaria.
                  </Text>
                  <Text>
                    Considera el contexto personal: un símbolo puede tener diferentes significados para cada persona.
                  </Text>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Flex justifyContent="center" mt={8}>
          <Button
            variant="outline"
            colorScheme="teal"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default Dashboard;