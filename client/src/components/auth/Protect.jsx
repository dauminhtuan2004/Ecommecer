import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../config/api';

function ProtectedRoute({ children, requiredRole }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthorized(false);
        return;
      }
      try {
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const role = response.data.user?.role ;
        console.log('ProtectedRoute Role:', role);
        setIsAuthorized(role === requiredRole);
      } catch (error) {
        console.log('ProtectedRoute Error:', error);
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, [requiredRole]);

  if (isAuthorized === null) {
    return <div>Đang kiểm tra...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;