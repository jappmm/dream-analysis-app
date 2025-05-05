// src/styles/theme.js

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#006400',
    secondary: '#32CD32',
  },
  fonts: {
    heading: 'Georgia, serif',
    body: 'Arial, sans-serif',
  },
});

export default theme;
