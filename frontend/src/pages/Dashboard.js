// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaCloudMoon, FaUser, FaRegCalendarAlt } from 'react-icons/fa';
import { supabase } from '../services/supabase';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const bg = useColorModeValue('gray.100', 'gray.700');

  const stats = [
    {
      label: 'Sueños Registrados',
      value: 24,
      icon: FaCloudMoon,
    },
    {
      label: 'Días Activo',
      value: 12,
      icon: FaRegCalendarAlt,
    },
    {
      label: 'Perfil Completo',
      value: 'Sí',
      icon: FaUser,
    },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user || error) {
        navigate('/login'); // Si no hay usuario, redirige
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, [navigate]);

  if (!user) {
    return <Text textAlign="center" mt={20}>Cargando...</Text>;
  }

  return (
    <Box p={8}>
      <Heading mb={4}>Bienvenido al Panel</Heading>
      <Text color="gray.500" mb={8}>
        Aquí puedes ver un resumen de tu actividad reciente.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {stats.map((stat, index) => (
          <Stat key={index} p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg={bg}>
            <VStack spacing={3}>
              <Icon as={stat.icon} boxSize={6} color="teal.500" />
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber>{stat.value}</StatNumber>
            </VStack>
          </Stat>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
