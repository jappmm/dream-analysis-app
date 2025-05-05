import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  fonts: {
    heading: `'Segoe UI', sans-serif`,
    body: `'Segoe UI', sans-serif`,
  },
  colors: {
    brand: {
      50: '#e3f9f5',
      100: '#c1eede',
      200: '#9ee3c7',
      300: '#7bd8af',
      400: '#58cd98',
      500: '#3eb37e',
      600: '#2f8b61',
      700: '#206344',
      800: '#103b26',
      900: '#001309',
    },
  },
});

export default theme;
