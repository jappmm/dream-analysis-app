import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Stack,
  Checkbox,
  Flex,
  Select,
  Heading,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  Card,
  CardBody,
  CardHeader,
  Divider
} from '@chakra-ui/react';
import { useDreams } from '../../hooks/useDreams';
import Loader from '../common/Loader';

const DreamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { createDream, updateDream, getDream, loading, error } = useDreams();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    dreamDate: new Date().toISOString().split('T')[0],
    emotions: [],
    settings: [],
    characters: [],
    lucidity: 0,
    tags: [],
    isRecurring: false,
    isNightmare: false,
    sleepQuality: 5,
    lifeSituation: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [emotion, setEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [character, setCharacter] = useState('');
  const [relation, setRelation] = useState('');
  const [setting, setSetting] = useState('');
  const [tag, setTag] = useState('');
  
  // Cargar datos existentes si estamos editando
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      
      const fetchDream = async () => {
        try {
          const dream = await getDream(id);
          
          if (dream) {
            setFormData({
              title: dream.title || '',
              content: dream.content || '',
              dreamDate: dream.dreamDate ? new Date(dream.dreamDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              emotions: dream.emotions || [],
              settings: dream.settings || [],
              characters: dream.characters || [],
              lucidity: dream.lucidity || 0,
              tags: dream.tags || [],
              isRecurring: dream.isRecurring || false,
              isNightmare: dream.isNightmare || false,
              sleepQuality: dream.sleepQuality || 5,
              lifeSituation: dream.lifeSituation || ''
            });
          }
        } catch (err) {
          toast({
            title: 'Error',
            description: 'No se pudo cargar el sueño para editar',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/dreams');
        }
      };
      
      fetchDream();
    }
  }, [id, getDream, navigate, toast]);
  
  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar error cuando el usuario corrige
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'El título es requerido';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'La descripción del sueño es requerida';
    } else if (formData.content.trim().length < 10) {
      errors.content = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      if (isEditing) {
        await updateDream(id, formData);
        toast({
          title: 'Sueño actualizado',
          description: 'Tu sueño ha sido actualizado exitosamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await createDream(formData);
        toast({
          title: 'Sueño guardado',
          description: 'Tu sueño ha sido registrado exitosamente y será analizado en breve',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
      navigate('/dreams');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al guardar el sueño',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Funciones para manejar emociones
  const addEmotion = () => {
    if (!emotion) return;
    
    const newEmotion = {
      name: emotion,
      intensity: emotionIntensity
    };
    
    setFormData({
      ...formData,
      emotions: [...formData.emotions, newEmotion]
    });
    
    setEmotion('');
    setEmotionIntensity(5);
  };
  
  const removeEmotion = (index) => {
    const newEmotions = [...formData.emotions];
    newEmotions.splice(index, 1);
    
    setFormData({
      ...formData,
      emotions: newEmotions
    });
  };
  
  // Funciones para manejar personajes
  const addCharacter = () => {
    if (!character) return;
    
    const newCharacter = {
      name: character,
      relation: relation
    };
    
    setFormData({
      ...formData,
      characters: [...formData.characters, newCharacter]
    });
    
    setCharacter('');
    setRelation('');
  };
  
  const removeCharacter = (index) => {
    const newCharacters = [...formData.characters];
    newCharacters.splice(index, 1);
    
    setFormData({
      ...formData,
      characters: newCharacters
    });
  };
  
  // Funciones para manejar escenarios
  const addSetting = () => {
    if (!setting) return;
    
    setFormData({
      ...formData,
      settings: [...formData.settings, setting]
    });
    
    setSetting('');
  };
  
  const removeSetting = (index) => {
    const newSettings = [...formData.settings];
    newSettings.splice(index, 1);
    
    setFormData({
      ...formData,
      settings: newSettings
    });
  };
  
  // Funciones para manejar etiquetas
  const addTag = () => {
    if (!tag) return;
    
    setFormData({
      ...formData,
      tags: [...formData.tags, tag.toLowerCase()]
    });
    
    setTag('');
  };
  
  const removeTag = (index) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    
    setFormData({
      ...formData,
      tags: newTags
    });
  };
  
  // Lista de emociones comunes para sugerir
  const commonEmotions = [
    'Alegría', 'Tristeza', 'Miedo', 'Ansiedad', 'Confusión',
    'Sorpresa', 'Amor', 'Nostalgia', 'Enojo', 'Soledad',
    'Paz', 'Felicidad', 'Nerviosismo', 'Curiosidad', 'Esperanza'
  ];
  
  // Lista de etiquetas comunes para sugerir
  const commonTags = [
    'recurrente', 'vuelo', 'caída', 'persecución', 'agua', 
    'animales', 'familia', 'pasado', 'futuro', 'trabajo',
    'escuela', 'casa', 'naturaleza', 'ciudad', 'viaje'
  ];
  
  if (loading) {
    return <Loader text={isEditing ? "Cargando sueño..." : "Preparando formulario..."} />;
  }
  
  return (
    <Card>
      <CardHeader>
        <Heading size="lg">{isEditing ? 'Editar Sueño' : 'Registrar Nuevo Sueño'}</Heading>
      </CardHeader>
      
      <Divider />
      
      <CardBody>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={formErrors.title}>
              <FormLabel>Título</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Un título para tu sueño"
              />
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            </FormControl>
            
            <FormControl isRequired isInvalid={formErrors.content}>
              <FormLabel>Descripción del sueño</FormLabel>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Describe tu sueño con tanto detalle como recuerdes..."
                minHeight="200px"
              />
              <FormErrorMessage>{formErrors.content}</FormErrorMessage>
            </FormControl>
            
            <FormControl>
              <FormLabel>Fecha del sueño</FormLabel>
              <Input
                name="dreamDate"
                type="date"
                value={formData.dreamDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormControl>
            
            {/* Emociones */}
            <FormControl>
              <FormLabel>Emociones en el sueño</FormLabel>
              <Flex direction={{ base: 'column', md: 'row' }} gap={3}>
                <Select 
                  placeholder="Selecciona o ingresa una emoción"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                >
                  {commonEmotions.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
                
                <Box minW="200px">
                  <Text mb={1}>Intensidad: {emotionIntensity}</Text>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={emotionIntensity}
                    onChange={(val) => setEmotionIntensity(val)}
                    colorScheme="blue"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
                
                <Button onClick={addEmotion} colorScheme="blue">
                  Añadir
                </Button>
              </Flex>
              
              <HStack spacing={2} mt={3} flexWrap="wrap">
                {formData.emotions.map((emotion, index) => (
                  <Tag
                    size="md"
                    key={`${emotion.name}-${index}`}
                    borderRadius="full"
                    variant="solid"
                    colorScheme={
                      emotion.intensity > 7 ? 'red' :
                      emotion.intensity > 4 ? 'yellow' : 'green'
                    }
                    mb={2}
                  >
                    <TagLabel>{emotion.name} ({emotion.intensity})</TagLabel>
                    <TagCloseButton onClick={() => removeEmotion(index)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            
            {/* Personajes */}
            <FormControl>
              <FormLabel>Personajes en el sueño</FormLabel>
              <Flex direction={{ base: 'column', md: 'row' }} gap={3}>
                <Input
                  placeholder="Nombre del personaje"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                />
                
                <Input
                  placeholder="Relación (familiar, amigo, desconocido, etc.)"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                />
                
                <Button onClick={addCharacter} colorScheme="blue">
                  Añadir
                </Button>
              </Flex>
              
              <Stack spacing={2} mt={3}>
                {formData.characters.map((char, index) => (
                  <Flex 
                    key={`${char.name}-${index}`}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Text fontWeight="bold">{char.name}</Text>
                      {char.relation && (
                        <Text fontSize="sm" color="gray.600">{char.relation}</Text>
                      )}
                    </Box>
                    <Button 
                      size="xs" 
                      colorScheme="red" 
                      onClick={() => removeCharacter(index)}
                    >
                      Eliminar
                    </Button>
                  </Flex>
                ))}
              </Stack>
            </FormControl>
            
            {/* Escenarios */}
            <FormControl>
              <FormLabel>Escenarios/Ubicaciones</FormLabel>
              <Flex gap={3}>
                <Input
                  placeholder="Añadir escenario (ej: casa, playa, bosque...)"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                />
                
                <Button onClick={addSetting} colorScheme="blue">
                  Añadir
                </Button>
              </Flex>
              
              <HStack spacing={2} mt={3} flexWrap="wrap">
                {formData.settings.map((setting, index) => (
                  <Tag
                    size="md"
                    key={`${setting}-${index}`}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="purple"
                    mb={2}
                  >
                    <TagLabel>{setting}</TagLabel>
                    <TagCloseButton onClick={() => removeSetting(index)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            
            {/* Nivel de lucidez */}
            <FormControl>
              <FormLabel>Nivel de lucidez</FormLabel>
              <Slider
                min={0}
                max={5}
                step={1}
                value={formData.lucidity}
                onChange={(val) => setFormData({ ...formData, lucidity: val })}
                colorScheme="purple"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
                <SliderMark value={0} mt={2} ml={-2} fontSize="sm">0</SliderMark>
                <SliderMark value={1} mt={2} ml={-2} fontSize="sm">1</SliderMark>
                <SliderMark value={2} mt={2} ml={-2} fontSize="sm">2</SliderMark>
                <SliderMark value={3} mt={2} ml={-2} fontSize="sm">3</SliderMark>
                <SliderMark value={4} mt={2} ml={-2} fontSize="sm">4</SliderMark>
                <SliderMark value={5} mt={2} ml={-2} fontSize="sm">5</SliderMark>
              </Slider>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm">Sin lucidez (no sabía que soñaba)</Text>
                <Text fontSize="sm">Completamente lúcido (control total)</Text>
              </Flex>
            </FormControl>
            
            {/* Etiquetas */}
            <FormControl>
              <FormLabel>Etiquetas</FormLabel>
              <Flex gap={3}>
                <Input
                  placeholder="Añade etiquetas para clasificar tu sueño"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                
                <Button onClick={addTag} colorScheme="blue">
                  Añadir
                </Button>
              </Flex>
              
              <HStack spacing={2} mt={3} flexWrap="wrap">
                {formData.tags.map((tag, index) => (
                  <Tag
                    size="md"
                    key={`${tag}-${index}`}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="teal"
                    mb={2}
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(index)} />
                  </Tag>
                ))}
              </HStack>
              
              <Text fontSize="sm" color="gray.600" mt={2}>
                Etiquetas sugeridas:
              </Text>
              
              <HStack spacing={2} mt={1} flexWrap="wrap">
                {commonTags.map((tag) => (
                  !formData.tags.includes(tag) && (
                    <Tag
                      size="sm"
                      key={tag}
                      borderRadius="full"
                      variant="outline"
                      colorScheme="teal"
                      cursor="pointer"
                      onClick={() => {
                        setTag(tag);
                      }}
                      mb={2}
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  )
                ))}
              </HStack>
            </FormControl>
            
            <Flex direction={{ base: 'column', md: 'row' }} gap={5}>
              <FormControl>
                <Checkbox
                  name="isRecurring"
                  isChecked={formData.isRecurring}
                  onChange={handleChange}
                >
                  Es un sueño recurrente
                </Checkbox>
              </FormControl>
              
              <FormControl>
                <Checkbox
                  name="isNightmare"
                  isChecked={formData.isNightmare}
                  onChange={handleChange}
                >
                  Es una pesadilla
                </Checkbox>
              </FormControl>
            </Flex>
            
            <FormControl>
              <FormLabel>Calidad del sueño (1-10)</FormLabel>
              <Slider
                min={1}
                max={10}
                step={1}
                value={formData.sleepQuality}
                onChange={(val) => setFormData({ ...formData, sleepQuality: val })}
                colorScheme="blue"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm">Terrible</Text>
                <Text fontSize="sm">Excelente</Text>
              </Flex>
            </FormControl>
            
            <FormControl>
              <FormLabel>Situación de vida actual</FormLabel>
              <Textarea
                name="lifeSituation"
                value={formData.lifeSituation}
                onChange={handleChange}
                placeholder="Describe brevemente tu situación actual (trabajo, relaciones, preocupaciones, etc.)"
                rows={3}
              />
              <Text fontSize="sm" color="gray.600" mt={1}>
                Esta información ayuda a contextualizar el análisis del sueño
              </Text>
            </FormControl>
            
            <Flex justify="space-between" mt={6}>
              <Button
                variant="outline"
                onClick={() => navigate('/dreams')}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
              >
                {isEditing ? 'Actualizar Sueño' : 'Guardar Sueño'}
              </Button>
            </Flex>
          </Stack>
        </form>
      </CardBody>
    </Card>
  );
};

export default DreamForm;