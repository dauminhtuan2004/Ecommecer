// src/App.jsx (Cập nhật để wrap routes với AuthProvider)
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import  AuthProvider from './contexts/AuthContext';
import  AppRoutes  from './routes/AppRoutes';
import  Layout  from './components/layouts/Layout'; // Giả sử có Layout chung
import './index.css'; // Tailwind

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;