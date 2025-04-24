// src/components/layouts/MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
