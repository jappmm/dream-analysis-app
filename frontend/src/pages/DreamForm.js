import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import DreamFormComponent from '../components/dream/DreamForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const DreamForm = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" py={8} flex="1">
        <DreamFormComponent />
      </Container>
      <Footer />
    </Box>
  );
};

export default DreamForm;