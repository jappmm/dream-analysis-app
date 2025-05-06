import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Heading, Text, VStack, SimpleGrid, useToast, Textarea, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDreamForm, setShowDreamForm] = useState(false);
  const [newDream, setNewDream] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Obtener sueños del usuario al cargar el componente
  useEffect(() => {
    fetchDreams();
  }, [user]);

  // Función para obtener los sueños del usuario
  const fetchDreams = async () => {
    try {
      if (!user) return;

      console.log('Obteniendo sueños para el usuario:', user.id);
      
      const { data, error } = await supabase
        .from('Dreama')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener sueños:', error);
        throw error;
      }
      
      console.log('Sueños obtenidos:', data);
      setDreams(data || []);
    } catch (error) {
      console.error('Error detallado al obtener sueños:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar tus sueños: ' + (error.message || 'Error desconocido'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
      console.log('Intentando guardar sueño:', {
        title: newDream.title,
        content: newDream.content,
        dream_date: newDream.date,
        user_id: user.id
      });
      
      const { data, error } = await supabase
        .from('Dreama')
        .insert([
          {
            title: newDream.title,
            content: newDream.content,
            dream_date: newDream.date,
            user_id: user.id
          }
        ])
        .select();

      if (error) {
        console.error('Error detallado de Supabase:', error);
        throw error;
      }
      
      console.log('Sueño guardado exitosamente:', data);
      
      toast({
        title: 'Sueño registrado',
        description: 'Tu sueño ha sido guardado exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Limpiar formulario y actualizar lista
      setNewDream({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowDreamForm(false);
      
      // Añadir el nuevo sueño a la lista
      if (data && data.length > 0) {
        setDreams([data[0], ...dreams]);
      } else {
        // Si no tenemos los datos devueltos, volvemos a cargar todos
        fetchDreams();
      }
      
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
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Panel de Control
          </Heading>
          <Text fontSize="lg">
            Bienvenido, {user?.email}
          </Text>
        </Box>

        {/* Botón para mostrar/ocultar formulario */}
        <Box display="flex" justifyContent="center">
          <Button
            colorScheme="brand"
            size="lg"
            onClick={() => setShowDreamForm(!showDreamForm)}
          >
            {showDreamForm ? 'Cancelar' : 'Registrar un nuevo sueño'}
          </Button>
        </Box>

        {/* Formulario para registrar un nuevo sueño */}
        {showDreamForm && (
          <Box as="form" onSubmit={handleSaveDream} bg="gray.50" p={6} borderRadius="md">
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
                />
              </FormControl>
              
              <FormControl id="date" isRequired>
                <FormLabel>Fecha del sueño</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={newDream.date}
                  onChange={handleDreamChange}
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
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="brand"
                width="full"
              >
                Guardar sueño
              </Button>
            </VStack>
          </Box>
        )}

        {/* Lista de sueños */}
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Tus sueños recientes
          </Heading>
          
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
        </Box>

        <Box textAlign="center" mt={8}>
          <Button
            variant="outline"
            colorScheme="brand"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;