import React from 'react';
import { Box, Container, Heading, Stack, Card, CardBody, Grid, GridItem } from '@chakra-ui/react';
import PatternVisualization from '../components/analysis/PatternVisualization';
import SymbolsExplorer from '../components/dream/SymbolsExplorer';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import useAuth from '../hooks/useAuth';

const Insights = () => {
  const { user } = useAuth();
  
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" py={8} flex="1">
        <Stack spacing={8}>
          <Heading size="lg">Insights y Patrones</Heading>
          
          <Card>
            <CardBody>
              <PatternVisualization userId={user?.id} />
            </CardBody>
          </Card>
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr" }} gap={6}>
            <GridItem>
              <SymbolsExplorer />
            </GridItem>
          </Grid>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
};

export default Insights;