// src/pages/RegistrationSuccess.js

import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>¡Registro exitoso!</h2>
      <p>Tu cuenta ha sido creada correctamente.</p>
      <Link to="/login">Ir al inicio de sesión</Link>
    </div>
  );
};

export default RegistrationSuccess;
