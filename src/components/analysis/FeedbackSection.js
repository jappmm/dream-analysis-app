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
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
  Icon,
  HStack,
  Badge
} from '@chakra-ui/react';
import { CheckCircleIcon, StarIcon } from '@chakra-ui/icons';
import { useDreams } from '../../hooks/useDreams';

// Componente de estrella para las calificaciones
const RatingStars = ({ value, onChange, max = 5, size = "md", readOnly = false }) => {
  const handleClick = (rating) => {
    if (!readOnly) {
      onChange(rating);
    }
  };

  const starColor = (index) => {
    if (readOnly) {
      return index < value ? "yellow.400" : "gray.300";
    } else {
      return index < value ? "yellow.400" : "gray.300";
    }
  };

  return (
    <HStack spacing={1}>
      {[...Array(max)].map((_, index) => (
        <Icon
          key={index}
          as={StarIcon}
          boxSize={size === "sm" ? 4 : size === "md" ? 6 : 8}
          color={starColor(index)}
          cursor={readOnly ? "default" : "pointer"}
          onClick={() => handleClick(index + 1)}
          _hover={readOnly ? {} : { color: "yellow.300" }}
        />
      ))}
    </HStack>
  );
};

const FeedbackSection = ({ dreamId, analysis, onFeedbackSubmitted, existingFeedback = null }) => {
  const [accuracy, setAccuracy] = useState(existingFeedback?.accuracy || 3);
  const [helpfulness, setHelpfulness] = useState(existingFeedback?.helpfulness || 3);
  const [insightfulness, setInsightfulness] = useState(existingFeedback?.insightfulness || 3);
  const [comments, setComments] = useState(existingFeedback?.comments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(!!existingFeedback);
  
  const { saveFeedback } = useDreams();
  const toast = useToast();
  
  useEffect(() => {
    // Actualizar estado si llega existingFeedback como prop
    if (existingFeedback) {
      setAccuracy(existingFeedback.accuracy);
      setHelpfulness(existingFeedback.helpfulness);
      setInsightfulness(existingFeedback.insightfulness);
      setComments(existingFeedback.comments || '');
      setHasFeedback(true);
    }
  }, [existingFeedback]);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await saveFeedback(dreamId, {
        accuracy: accuracy,
        helpfulness: helpfulness,
        insightfulness: insightfulness,
        comments
      });
      
      toast({
        title: 'Feedback enviado',
        description: 'Gracias por compartir tu opinión sobre este análisis',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setHasFeedback(true);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el feedback',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!analysis) {
    return null;
  }
  
  // Si ya se ha enviado feedback, mostrar vista de solo lectura
  if (hasFeedback) {
    return (
      <Card variant="outline" mt={6}>
        <CardHeader>
          <Flex alignItems="center">
            <Heading size="md">Tu feedback</Heading>
            <Badge colorScheme="green" ml={2}>
              <Icon as={CheckCircleIcon} mr={1} />
              Enviado
            </Badge>
          </Flex>
        </CardHeader>
        
        <Divider />
        
        <CardBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel fontWeight="medium">Precisión</FormLabel>
              <RatingStars value={accuracy} max={5} readOnly={true} />
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="medium">Utilidad</FormLabel>
              <RatingStars value={helpfulness} max={5} readOnly={true} />
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="medium">Profundidad</FormLabel>
              <RatingStars value={insightfulness} max={5} readOnly={true} />
            </FormControl>
            
            {comments && (
              <FormControl>
                <FormLabel fontWeight="medium">Comentarios</FormLabel>
                <Text>{comments}</Text>
              </FormControl>
            )}
            
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Gracias por tu feedback. Esto nos ayuda a mejorar los análisis.
            </Text>
          </Stack>
        </CardBody>
      </Card>
    );
  }
  
  // Vista para enviar feedback
  return (
    <Card variant="outline" mt={6}>
      <CardHeader>
        <Heading size="md">¿Qué te pareció este análisis?</Heading>
      </CardHeader>
      
      <Divider />
      
      <CardBody>
        <Stack spacing={4}>
          <Text>
            Tu feedback nos ayuda a mejorar la calidad de los análisis de sueños.
            Por favor, evalúa este análisis:
          </Text>
          
          <FormControl>
            <FormLabel fontWeight="normal">Precisión:</FormLabel>
            <Box>
              <RatingStars value={accuracy} onChange={setAccuracy} />
            </Box>
            <Flex justifyContent="space-between" mt={1}>
              <Text fontSize="xs">Poco preciso</Text>
              <Text fontSize="xs">Muy preciso</Text>
            </Flex>
          </FormControl>
          
          <FormControl>
            <FormLabel fontWeight="normal">Utilidad:</FormLabel>
            <Box>
              <RatingStars value={helpfulness} onChange={setHelpfulness} />
            </Box>
            <Flex justifyContent="space-between" mt={1}>
              <Text fontSize="xs">Poco útil</Text>
              <Text fontSize="xs">Muy útil</Text>
            </Flex>
          </FormControl>
          
          <FormControl>
            <FormLabel fontWeight="normal">Profundidad:</FormLabel>
            <Box>
              <RatingStars value={insightfulness} onChange={setInsightfulness} />
            </Box>
            <Flex justifyContent="space-between" mt={1}>
              <Text fontSize="xs">Superficial</Text>
              <Text fontSize="xs">Muy profundo</Text>
            </Flex>
          </FormControl>
          
          <FormControl>
            <FormLabel fontWeight="normal">Comentarios adicionales:</FormLabel>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="¿Qué te gustó o no te gustó? ¿Qué podría mejorar?"
              rows={3}
            />
          </FormControl>
          
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            mt={2}
          >
            Enviar Feedback
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default FeedbackSection;