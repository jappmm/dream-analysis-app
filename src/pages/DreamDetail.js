import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import DreamDetailComponent from '../components/dream/DreamDetail';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const DreamDetail = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" py={8} flex="1">
        <DreamDetailComponent />
      </Container>
      <Footer />
    </Box>
  );
};

export default DreamDetail;