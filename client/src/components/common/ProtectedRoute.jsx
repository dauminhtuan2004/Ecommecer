import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authServices';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        console.log('ProtectedRoute User:', user);
        console.log('ProtectedRoute Required Role:', requiredRole);

        if (!user) {
          setIsAuthorized(false);
          return;
        }

        let authorized = false;
        if (user.role === requiredRole) {
          authorized = true;
        } else if (user.role === 'ADMIN' && requiredRole === 'CUSTOMER') {
          authorized = true;
        }

        setIsAuthorized(authorized);
      } catch (error) {
        console.error('ProtectedRoute Error:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (isAuthorized === null) {
    return <div>Đang kiểm tra quyền...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
