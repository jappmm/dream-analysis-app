// src/pages/Landing.js

import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido a Dream App</h1>
      <p>Analiza tus sueños y descubre su significado.</p>
      <Link to="/register">Comenzar</Link>
    </div>
  );
};

export default Landing;
