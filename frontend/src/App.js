import React from 'react';
import { Box } from '@chakra-ui/react';
import AppRouter from './router';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

const App = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" as="main">
        <AppRouter />
      </Box>
      <Footer />
    </Box>
  );
};

export default App;