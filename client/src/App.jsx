// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/authContext';
import CartSync from './components/common/CartSync';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import './index.css'; 

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <CartSync />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;