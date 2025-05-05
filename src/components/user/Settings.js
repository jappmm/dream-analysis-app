import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Badge,
  Flex,
  Text,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'es',
    privacyLevel: 'medio',
    twoFactorAuth: true,
  });

  useEffect(() => {
    // Simulación de carga inicial desde un servicio
    const fetchSettings = async () => {
      // Aquí puedes reemplazarlo por una llamada real con axios/api
      const savedSettings = {
        darkMode: true,
        language: 'es',
        privacyLevel: 'máximo',
        twoFactorAuth: true,
      };
      setSettings(savedSettings);
    };

    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading size="lg" mb={6}>Configuraciones</Heading>
      <VStack spacing={5} align="stretch">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Modo oscuro
          </FormLabel>
          <Switch
            id="dark-mode"
            isChecked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="language">Idioma</FormLabel>
          <Select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleChange}
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="privacy">Nivel de privacidad</FormLabel>
          <Select
            id="privacy"
            name="privacyLevel"
            value={settings.privacyLevel}
            onChange={handleChange}
          >
            <option value="bajo">Bajo</option>
            <option value="medio">Medio</option>
            <option value="máximo">Máximo</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="twofa">Autenticación de dos factores</FormLabel>
          <Flex align="center">
            <CheckIcon color="green.500" mr={2} />
            <Text fontSize="sm">
              Autenticación de dos factores{' '}
              {settings.privacyLevel === 'máximo' ? (
                <Badge colorScheme="green" ml={1}>Activado</Badge>
              ) : (
                <Badge colorScheme="yellow" ml={1}>Opcional</Badge>
              )}
            </Text>
          </Flex>
        </FormControl>
      </VStack>
    </Box>
  );
};

export default Settings;
