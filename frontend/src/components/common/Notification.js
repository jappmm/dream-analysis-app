// src/components/common/Notification.js
import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const Notification = ({ status = 'info', title, description }) => {
  return (
    <Alert status={status} borderRadius="md" shadow="md">
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription ml={2}>{description}</AlertDescription>}
    </Alert>
  );
};

export default Notification;
