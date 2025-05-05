// src/styles/globalStyles.js

import { extendTheme } from '@chakra-ui/react';

// Establece la estructura del tema global
const globalStyles = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        color: '#333',
        margin: 0,
        padding: 0,
      },
      a: {
        textDecoration: 'none',
        color: 'teal',
      },
    },
  },
});

export default globalStyles;
