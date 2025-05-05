import React from 'react';
import ReactDOM from 'react-dom/client';
// Sin importación de CSS que podría causar problemas

const App = () => {
  return (
    <div style={{padding: "20px", fontFamily: "Arial"}}>
      <h1>Dream Analysis App</h1>
      <p>Esta es una versión de prueba para verificar que la aplicación funciona.</p>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
} else {
  console.error("No se encontró el elemento root");
}