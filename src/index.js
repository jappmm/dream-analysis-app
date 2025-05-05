import React from 'react';
import ReactDOM from 'react-dom/client';
// Eliminar o comentar la línea: import './index.css';
import App from './App';

console.log("Iniciando aplicación React");

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log("Root element found:", document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Render completado");
} catch (error) {
  console.error("Error al renderizar la aplicación:", error);
}