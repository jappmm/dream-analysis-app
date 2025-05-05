import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import AnalysisResults from '../components/analysis/AnalysisResults';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AnalysisDetail = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" py={8} flex="1">
        <AnalysisResults />
      </Container>
      <Footer />
    </Box>
  );
};

export default AnalysisDetail;