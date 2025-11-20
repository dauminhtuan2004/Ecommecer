import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the E-commerce Store!</h1>
        {user ? (
          <p className="text-gray-600">You are logged in as {user.name || user.email}.</p>
        ) : (
          <p className="text-gray-600">Please log in or register to continue shopping.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
