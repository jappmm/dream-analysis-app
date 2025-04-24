import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Switch,
  Button,
  useToast,
  Flex,
} from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setNotificationsEnabled(user.settings.notificationsEnabled);
      setDarkModeEnabled(user.settings.darkModeEnabled);
    }
  }, [user]);

  const handleSave = () => {
    // Aquí podrías hacer un PATCH o PUT a /users/settings
    toast({
      title: 'Preferencias guardadas',
      description: 'Tus ajustes han sido actualizados',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} bg="white" boxShadow="md" borderRadius="lg">
      <Heading as="h2" size="lg" mb={6}>
        Configuración
      </Heading>
      <Stack spacing={5}>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="notifications" mb="0">
            Notificaciones
          </FormLabel>
          <Switch
            id="notifications"
            isChecked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Modo oscuro
          </FormLabel>
          <Switch
            id="dark-mode"
            isChecked={darkModeEnabled}
            onChange={() => setDarkModeEnabled(!darkModeEnabled)}
          />
        </FormControl>
        <Flex justify="flex-end">
          <Button colorScheme="blue" onClick={handleSave}>
            Guardar cambios
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default Settings;