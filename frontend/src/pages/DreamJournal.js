// src/pages/DreamJournal.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Select,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import useAuth from '../hooks/useAuth';
import DreamCard from '../components/DreamCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DreamJournal = () => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [filteredDreams, setFilteredDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Cargar sueños del localStorage
  useEffect(() => {
    const loadDreams = () => {
      if (user?.id) {
        setLoading(true);
        try {
          // Obtener sueños del localStorage
          const storedDreams = localStorage.getItem('dreams');
          if (storedDreams) {
            const allDreams = JSON.parse(storedDreams);
            // Filtrar por usuario actual
            const userDreams = allDreams
              .filter(dream => dream.userId === user.id)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setDreams(userDreams);
            setFilteredDreams(userDreams);
          } else {
            setDreams([]);
            setFilteredDreams([]);
          }
        } catch (error) {
          console.error('Error al cargar los sueños:', error);
        }
        setLoading(false);
      }
    };

    loadDreams();
    
    // Temporizador de seguridad para evitar carga infinita
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [user]);

  // Filtrar sueños cuando cambian los criterios
  useEffect(() => {
    if (dreams.length === 0) return;

    let filtered = [...dreams];

    // Aplicar filtro por estado
    if (filterBy !== 'all') {
      filtered = filtered.filter(dream => dream.status === filterBy);
    }

    // Aplicar búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(dream => 
        dream.title.toLowerCase().includes(term) || 
        dream.narrative.toLowerCase().includes(term)
      );
    }

    setFilteredDreams(filtered);
  }, [searchTerm, filterBy, dreams]);

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio de filtro
  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>Historial de Sueños</Heading>
      
      {/* Filtros y búsqueda */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        mb={8} 
        gap={4}
        align={{ md: 'center' }}
      >
        <InputGroup maxW={{ md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar en mis sueños..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
        
        <Select 
          value={filterBy} 
          onChange={handleFilterChange}
          maxW={{ md: '200px' }}
        >
          <option value="all">Todos los sueños</option>
          <option value="analyzed">Analizados</option>
          <option value="pending">Pendientes</option>
          <option value="processing">En proceso</option>
        </Select>
      </Flex>
      
      {/* Lista de sueños */}
      {loading ? (
        <LoadingSpinner message="Cargando tus sueños..." />
      ) : filteredDreams.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredDreams.map(dream => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Heading size="md" mb={3} color="gray.500">
            No se encontraron sueños
          </Heading>
          <Text>
            {dreams.length > 0 
              ? 'Ajusta los filtros para ver más resultados' 
              : 'Comienza a registrar tus sueños para ver tu historial'}
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default DreamJournal;