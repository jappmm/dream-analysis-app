// src/components/analysis/InsightFeedback.js
import React, { useState } from 'react';
import {
  Box,
  Text,
  Textarea,
  Button,
  useToast,
  VStack,
} from '@chakra-ui/react';

const InsightFeedback = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: 'Por favor escribe un comentario.',
        status: 'warning',
        isClosable: true,
      });
      return;
    }

    onSubmit?.(feedback);
    toast({
      title: 'Gracias por tu feedback.',
      status: 'success',
      isClosable: true,
    });
    setFeedback('');
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="sm" bg="white">
      <VStack align="stretch" spacing={3}>
        <Text fontWeight="medium">¿Qué opinas de estos insights?</Text>
        <Textarea
          placeholder="Escribe tu comentario aquí..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button onClick={handleSubmit} colorScheme="blue">
          Enviar feedback
        </Button>
      </VStack>
    </Box>
  );
};

export default InsightFeedback;
