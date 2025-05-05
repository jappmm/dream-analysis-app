import { useContext } from 'react';
import DreamContext from '../contexts/DreamContext';

const useDreams = () => {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDreams debe usarse dentro de un DreamProvider');
  }
  return context;
};

export default useDreams;