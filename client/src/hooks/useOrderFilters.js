import { useMemo } from 'react';

export const useOrderFilters = (orders, searchQuery, sortBy, sortDir) => {
  return useMemo(() => {
    let filtered = orders.filter((order) => {
      const searchMatch = 
        order.id.toString().includes(searchQuery) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch;
    });

    filtered.sort((a, b) => {
      let va, vb;
      if (sortBy === 'total') {
        va = a.total || 0;
        vb = b.total || 0;
      } else if (sortBy === 'createdAt') {
        va = new Date(a.createdAt).getTime();
        vb = new Date(b.createdAt).getTime();
      } else {
        va = a[sortBy] || '';
        vb = b[sortBy] || '';
      }
      
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, searchQuery, sortBy, sortDir]);
};

export const useOrderStats = (orders) => {
  return useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const delivered = orders.filter(o => o.status === 'DELIVERED').length;
    const revenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    return { total, pending, delivered, revenue };
  }, [orders]);
};
