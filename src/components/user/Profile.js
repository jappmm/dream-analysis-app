import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  Avatar,
  AvatarBadge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  HStack,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const Profile = () => {
  const { user, updateProfile, updatePassword, deleteAccount, loading, error, clearError } = useAuth();
  const toast = useToast();
  
  // Modal para cambio de contraseña
  const { isOpen: isPasswordModalOpen, onOpen: onOpenPasswordModal, onClose: onClosePasswordModal } = useDisclosure();
  // Modal para eliminación de cuenta
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  
  // Estados para el formulario de perfil
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    demographics: {
      age: '',
      gender: '',
      occupation: ''
    },
    preferences: {
      dataSharing: false
    }
  });
  
  // Estados para formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado para eliminación de cuenta
  const [confirmDelete, setConfirmDelete] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  
  // Estados para manejo de errores
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [deleteErrors, setDeleteErrors] = useState({});
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        demographics: {
          age: user.demographics?.age || '',
          gender: user.demographics?.gender || '',
          occupation: user.demographics?.occupation || ''
        },
        preferences: {
          dataSharing: user.preferences?.dataSharing || false
        }
      });
    }
  }, [user]);
  
  // Manejar cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfileData({
        ...profileData,
        [section]: {
          ...profileData[section],
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Limpiar errores
    if (profileErrors[name]) {
      setProfileErrors({
        ...profileErrors,
        [name]: null
      });
    }
  };
  
  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Limpiar errores
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };
  
  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    // Validación básica
    const errors = {};
    
    if (!profileData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    }
    
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    
    try {
      await updateProfile(profileData);
      
      toast({
        title: 'Perfil actualizado',
        description: 'Tu perfil ha sido actualizado exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'No se pudo actualizar el perfil',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Cambiar contraseña
  const handleChangePassword = async () => {
    // Validación
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Ingresa tu contraseña actual';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Ingresa una nueva contraseña';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido actualizada exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Limpiar formulario y cerrar modal
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      onClosePasswordModal();
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'No se pudo actualizar la contraseña',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    // Validación
    const errors = {};
    
    if (confirmDelete !== 'ELIMINAR') {
      errors.confirmDelete = 'Escribe ELIMINAR para confirmar';
    }
    
    if (!deletePassword) {
      errors.deletePassword = 'Ingresa tu contraseña para confirmar';
    }
    
    if (Object.keys(errors).length > 0) {
      setDeleteErrors(errors);
      return;
    }
    
    try {
      await deleteAccount(deletePassword);
      
      toast({
        title: 'Cuenta eliminada',
        description: 'Tu cuenta ha sido eliminada exitosamente',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      
      // La redirección debería ocurrir automáticamente por el hook de autenticación
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'No se pudo eliminar la cuenta',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  if (loading && !user) {
    return <Loader text="Cargando perfil..." />;
  }
  
  return (
    <Box>
      <Card mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="lg">Mi Perfil</Heading>
            
            <Button
              colorScheme="blue"
              onClick={handleSaveProfile}
              isLoading={loading}
            >
              Guardar Cambios
            </Button>
          </Flex>
        </CardHeader>
        
        <Divider />
        
        <CardBody>
          <Stack spacing={8}>
            {/* Información básica */}
            <Stack spacing={6}>
              <Heading size="md">Información Básica</Heading>
              
              <Flex 
                direction={{ base: 'column', md: 'row' }} 
                gap={6}
                alignItems="flex-start"
              >
                <Avatar 
                  size="xl" 
                  name={profileData.username} 
                  bg="blue.500"
                >
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="blue"
                    aria-label="edit avatar"
                    icon={<EditIcon />}
                  />
                </Avatar>
                
                <Stack spacing={4} flex="1">
                  <FormControl isRequired isInvalid={profileErrors.username}>
                    <FormLabel>Nombre de Usuario</FormLabel>
                    <Input
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <Input
                      name="email"
                      value={profileData.email}
                      isReadOnly
                      bg={useColorModeValue('gray.100', 'gray.700')}
                    />
                    <Badge mt={1} colorScheme={user?.isEmailConfirmed ? 'green' : 'yellow'}>
                      {user?.isEmailConfirmed ? (
                        <HStack spacing={1}>
                          <CheckIcon boxSize={3} />
                          <Text fontSize="xs">Verificado</Text>
                        </HStack>
                      ) : (
                        <Text fontSize="xs">No verificado</Text>
                      )}
                    </Badge>
                  </FormControl>
                  
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={onOpenPasswordModal}
                  >
                    Cambiar Contraseña
                  </Button>
                </Stack>
              </Flex>
            </Stack>
            
            <Divider />
            
            {/* Datos demográficos */}
            <Stack spacing={6}>
              <Heading size="md">Datos Demográficos</Heading>
              <Text color="gray.500" fontSize="sm">
                Esta información es opcional y nos ayuda a personalizar mejor tu experiencia y 
                a mejorar nuestros algoritmos de análisis de sueños.
              </Text>
              
              <Flex 
                direction={{ base: 'column', md: 'row' }} 
                gap={6}
              >
                <FormControl>
                  <FormLabel>Edad</FormLabel>
                  <Input
                    name="demographics.age"
                    type="number"
                    value={profileData.demographics.age}
                    onChange={handleProfileChange}
                    min={13}
                    max={120}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Género</FormLabel>
                  <Select
                    name="demographics.gender"
                    value={profileData.demographics.gender}
                    onChange={handleProfileChange}
                  >
                    <option value="">Prefiero no decir</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="no binario">No binario</option>
                    <option value="otro">Otro</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Ocupación</FormLabel>
                  <Input
                    name="demographics.occupation"
                    value={profileData.demographics.occupation}
                    onChange={handleProfileChange}
                  />
                </FormControl>
              </Flex>
            </Stack>
            
            <Divider />
            
            {/* Preferencias */}
            <Stack spacing={6}>
              <Heading size="md">Preferencias y Privacidad</Heading>
              
              <FormControl>
                <Flex alignItems="flex-start">
                  <Box mt={1}>
                    <input
                      type="checkbox"
                      id="dataSharing"
                      name="preferences.dataSharing"
                      checked={profileData.preferences.dataSharing}
                      onChange={handleProfileChange}
                    />
                  </Box>
                  <Box ml={2}>
                    <FormLabel htmlFor="dataSharing" mb={0}>
                      Compartir datos para investigación
                    </FormLabel>
                    <Text fontSize="sm" color="gray.500">
                      Permite que tus datos de sueños sean utilizados de forma anónima para mejorar
                      nuestros algoritmos y contribuir a la investigación académica sobre patrones
                      de sueños.
                    </Text>
                  </Box>
                </Flex>
              </FormControl>
            </Stack>
            
            <Divider />
            
            {/* Eliminación de cuenta */}
            <Stack spacing={4}>
              <Heading size="md" color="red.500">Zona de Peligro</Heading>
              
              <Text>
                Al eliminar tu cuenta, todos tus datos serán eliminados permanentemente
                y no podrán ser recuperados.
              </Text>
              
              <Button
                colorScheme="red"
                variant="outline"
                onClick={onOpenDeleteModal}
                maxW="200px"
              >
                Eliminar mi cuenta
              </Button>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
      
      {/* Modal de cambio de contraseña */}
      <Modal isOpen={isPasswordModalOpen} onClose={onClosePasswordModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cambiar Contraseña</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={passwordErrors.currentPassword}>
                <FormLabel>Contraseña Actual</FormLabel>
                <Input
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={passwordErrors.newPassword}>
                <FormLabel>Nueva Contraseña</FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={passwordErrors.confirmPassword}>
                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClosePasswordModal}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleChangePassword} isLoading={loading}>
              Cambiar Contraseña
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Modal de eliminación de cuenta */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar Cuenta</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Stack spacing={4}>
              <Alert status="error">
                <AlertIcon />
                Esta acción no se puede deshacer. Una vez eliminada, tu cuenta y todos tus datos
                serán borrados permanentemente.
              </Alert>
              
              <FormControl isRequired isInvalid={deleteErrors.confirmDelete}>
                <FormLabel>
                  Escribe "ELIMINAR" para confirmar
                </FormLabel>
                <Input
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={deleteErrors.deletePassword}>
                <FormLabel>
                  Ingresa tu contraseña para confirmar
                </FormLabel>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseDeleteModal}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAccount} isLoading={loading}>
              Eliminar Cuenta Permanentemente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile;