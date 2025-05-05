import React from 'react';
import { 
  Flex, 
  Spinner, 
  Text, 
  VStack, 
  useColorModeValue
} from '@chakra-ui/react';

const Loader = ({ text = 'Cargando...', fullPage = false, size = 'xl' }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  
  if (fullPage) {
    return (
      <Flex 
        height="100vh" 
        width="100%" 
        position="fixed" 
        top="0" 
        left="0" 
        zIndex="9999" 
        bg={bgColor} 
        opacity="0.9"
        alignItems="center" 
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size={size}
          />
          <Text color={textColor} fontWeight="medium" fontSize="lg">
            {text}
          </Text>
        </VStack>
      </Flex>
    );
  }
  
  return (
    <Flex alignItems="center" justifyContent="center" p={8} direction="column">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size={size}
        mb={4}
      />
      <Text color={textColor} fontWeight="medium">
        {text}
      </Text>
    </Flex>
  );
};

export default Loader;