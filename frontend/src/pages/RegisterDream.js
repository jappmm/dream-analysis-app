// src/pages/RegisterDream.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Heading,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDreams } from '../contexts/DreamContext';

const RegisterDream = () => {
  const { createDream } = useDreams();
  const [dreamData, setDreamData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    narrative: '',
    mood: 'neutral'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDreamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!dreamData.title || !dreamData.narrative) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Obtener el ID de usuario del localStorage
      const userData = JSON.parse(localStorage.getItem('dream_analysis_user'));
      if (!userData) {
        throw new Error('Usuario no autenticado');
      }
      
      // Crear sueño con ID de usuario
      const newDream = await createDream({
        ...dreamData,
        userId: userData.id
      });
      
      toast({
        title: 'Sueño registrado',
        description: 'Tu sueño ha sido guardado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirigir a la página principal
      navigate('/');
      
    } catch (error) {
      console.error('Error al guardar sueño:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un problema al guardar tu sueño',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg">
      <Heading mb={6}>Registrar Nuevo Sueño</Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Título del sueño</FormLabel>
            <Input 
              name="title"
              value={dreamData.title}
              onChange={handleChange}
              placeholder="Ej: Volando sobre montañas"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Fecha del sueño</FormLabel>
            <Input 
              type="date"
              name="date"
              value={dreamData.date}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Descripción del sueño</FormLabel>
            <Textarea
              name="narrative"
              value={dreamData.narrative}
              onChange={handleChange}
              placeholder="Describe tu sueño con el mayor detalle posible..."
              rows={6}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Estado de ánimo predominante</FormLabel>
            <Select 
              name="mood"
              value={dreamData.mood}
              onChange={handleChange}
            >
              <option value="joy">Alegría</option>
              <option value="fear">Miedo</option>
              <option value="sadness">Tristeza</option>
              <option value="confusion">Confusión</option>
              <option value="neutral">Neutral</option>
            </Select>
          </FormControl>
          
          <Button
            mt={4}
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            Guardar Sueño
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterDream;