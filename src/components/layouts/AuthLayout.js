import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
