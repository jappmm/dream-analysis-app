import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Icon,
  List,
  ListItem,
  Stack,
  Tag,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, TimeIcon, StarIcon } from '@chakra-ui/icons';
import { FaMoon, FaSun, FaRegLightbulb, FaUsers, FaMapMarkerAlt, FaEye, FaTag } from 'react-icons/fa';
import { useDreams } from '../../hooks/useDreams';
import Loader from '../common/Loader';

const DreamDetail = () => {
  const { dreamId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { getDreamById, deleteDream, loading, error } = useDreams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [dream, setDream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  
  // Memoizar la función fetchDream para evitar recreaciones innecesarias
  const fetchDream = useCallback(async () => {
    if (!dreamId) return;
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      console.log('Fetching dream with ID:', dreamId);
      const data = await getDreamById(dreamId);
      
      console.log('Dream data received:', data);
      
      if (!data) {
        throw new Error('Sueño no encontrado');
      }
      
      setDream(data);
    } catch (err) {
      console.error('Error fetching dream:', err);
      setLoadError(err.message || 'Error al cargar el sueño');
      toast({
        title: 'Error',
        description: 'No se pudo cargar el sueño',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dreamId, getDreamById, toast]);
  
  // Cargar datos del sueño UNA SOLA VEZ al montar el componente
  useEffect(() => {
    fetchDream();
    // La dependencia es fetchDream que ya está memoizada con useCallback
  }, [fetchDream]);
  
  // Manejar eliminación de sueño
  const handleDelete = async () => {
    try {
      await deleteDream(dreamId);
      toast({
        title: 'Sueño eliminado',
        description: 'El sueño ha sido eliminado exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/dreams');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el sueño',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Navegar a la pantalla de edición
  const handleEdit = () => {
    navigate(`/dreams/${dreamId}/edit`);
  };
  
  // Navegar a la pantalla de análisis
  const viewAnalysis = () => {
    navigate(`/analysis/${dreamId}`);
  };
  
  // Mostrar pantalla de carga
  if (isLoading) {
    return <Loader text="Cargando sueño..." />;
  }
  
  // Mostrar mensaje de error
  if (loadError && !dream) {
    return (
      <Card>
        <CardBody>
          <Stack spacing={3} align="center">
            <Heading size="md" color="red.500">Error al cargar el sueño</Heading>
            <Text>{loadError}</Text>
            <Button colorScheme="blue" onClick={() => navigate('/dreams')}>
              Volver a mis sueños
            </Button>
          </Stack>
        </CardBody>
      </Card>
    );
  }
  
  // Si no hay sueño después de cargar, mostrar mensaje
  if (!dream) {
    return (
      <Card>
        <CardBody>
          <Stack spacing={3} align="center">
            <Heading size="md">No se encontró el sueño</Heading>
            <Text>El sueño que buscas no existe o ha sido eliminado</Text>
            <Button colorScheme="blue" onClick={() => navigate('/dreams')}>
              Volver a mis sueños
            </Button>
          </Stack>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Box>
      <Stack spacing={6}>
        <Card>
          <CardHeader>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Heading size="lg">{dream.title}</Heading>
              
              <HStack>
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={onOpen}
                >
                  Eliminar
                </Button>
                
                {dream.analysis && (
                  <Button
                    leftIcon={<FaRegLightbulb />}
                    colorScheme="yellow"
                    onClick={viewAnalysis}
                  >
                    Ver Análisis
                  </Button>
                )}
              </HStack>
            </Flex>
          </CardHeader>
          
          <Divider />
          
          <CardBody>
            <Stack spacing={6}>
              <HStack spacing={4} flexWrap="wrap">
                <Tag size="md" colorScheme="blue" variant="subtle">
                  <Icon as={TimeIcon} mr={1} />
                  {new Date(dream.dreamDate).toLocaleDateString()}
                </Tag>
                
                {dream.isRecurring && (
                  <Tag size="md" colorScheme="purple" variant="subtle">
                    Sueño Recurrente
                  </Tag>
                )}
                
                {dream.isNightmare && (
                  <Tag size="md" colorScheme="red" variant="subtle">
                    <Icon as={FaMoon} mr={1} />
                    Pesadilla
                  </Tag>
                )}
                
                <Tag size="md" colorScheme="green" variant="subtle">
                  <Icon as={StarIcon} mr={1} />
                  Calidad: {dream.sleepQuality}/10
                </Tag>
                
                <Tag size="md" colorScheme="purple" variant="subtle">
                  <Icon as={FaEye} mr={1} />
                  Lucidez: {dream.lucidity}/5
                </Tag>
              </HStack>
              
              <Box>
                <Heading size="sm" mb={2}>Descripción</Heading>
                <Text whiteSpace="pre-wrap">{dream.content}</Text>
              </Box>
              
              {dream.emotions && dream.emotions.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>Emociones</Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    {dream.emotions.map((emotion, index) => (
                      <Tag
                        key={index}
                        size="md"
                        colorScheme={
                          emotion.intensity > 7 ? 'red' :
                          emotion.intensity > 4 ? 'yellow' : 'green'
                        }
                      >
                        {emotion.name} ({emotion.intensity})
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              )}
              
              {dream.settings && dream.settings.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    Escenarios
                  </Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    {dream.settings.map((setting, index) => (
                      <Tag key={index} size="md" colorScheme="purple">
                        {setting}
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              )}
              
              {dream.characters && dream.characters.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    <Icon as={FaUsers} mr={2} />
                    Personajes
                  </Heading>
                  <List spacing={2}>
                    {dream.characters.map((character, index) => (
                      <ListItem key={index}>
                        <Text fontWeight="bold">{character.name}</Text>
                        {character.relation && (
                          <Text fontSize="sm" color="gray.600">
                            Relación: {character.relation}
                          </Text>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {dream.tags && dream.tags.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    <Icon as={FaTag} mr={2} />
                    Etiquetas
                  </Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    {dream.tags.map((tag, index) => (
                      <Tag key={index} size="md" colorScheme="teal">
                        {tag}
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              )}
              
              {dream.lifeSituation && (
                <Box>
                  <Heading size="sm" mb={2}>Situación de vida</Heading>
                  <Text>{dream.lifeSituation}</Text>
                </Box>
              )}
            </Stack>
          </CardBody>
        </Card>
        
        {!dream.analysis && (
          <Card p={4} bg="yellow.50" borderColor="yellow.300" borderWidth={1}>
            <HStack spacing={3}>
              <Icon as={FaRegLightbulb} boxSize="24px" color="yellow.500" />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">
                  El análisis de tu sueño está en proceso
                </Text>
                <Text fontSize="sm">
                  Te notificaremos cuando esté listo para consultar.
                  Generalmente toma unos minutos, actualiza la página para verificar.
                </Text>
              </VStack>
            </HStack>
          </Card>
        )}
      </Stack>
      
      {/* Modal de confirmación para eliminar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar Sueño</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que quieres eliminar este sueño? Esta acción no se puede deshacer.
            Se eliminará el sueño y su análisis asociado.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DreamDetail;