// src/components/common/AlertMessage.js
import React from 'react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';

const AlertMessage = ({ status = 'error', message }) => {
  return (
    <Alert status={status} variant="left-accent" borderRadius="md">
      <AlertIcon />
      <AlertTitle fontSize="sm">{message}</AlertTitle>
    </Alert>
  );
};

export default AlertMessage;
