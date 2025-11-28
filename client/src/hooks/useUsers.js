// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import userService from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    limit: 10 
  });

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers({ 
        ...pagination, 
        ...params 
      });
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  return {
    users,
    loading,
    error,
    pagination,
    setPagination,
    refetch: fetchUsers,
  };
};