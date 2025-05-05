import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Registrarse</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            style={{ padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            style={{ padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirma tu contraseña"
            style={{ padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Volver a inicio
        </Link>
      </div>
    </div>
  );
};

export default Register;