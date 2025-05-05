import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dream Analysis App</h1>
      <p>Bienvenido a la aplicación de análisis de sueños.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ marginRight: '10px', color: 'blue', textDecoration: 'underline' }}>
          Iniciar sesión
        </Link>
        <Link to="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
          Registrarse
        </Link>
      </div>
    </div>
  );
};

export default Home;