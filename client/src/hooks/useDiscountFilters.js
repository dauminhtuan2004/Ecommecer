import { useMemo } from 'react';

export const useDiscountFilters = (discounts, search, statusFilter, sortConfig) => {
  return useMemo(() => {
    let filtered = [...discounts];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (discount) =>
          discount.code.toLowerCase().includes(searchLower) ||
          discount.description?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((discount) => discount.status === statusFilter);
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle nested values
        if (sortConfig.key === 'usageCount') {
          aVal = a.usageCount || 0;
          bVal = b.usageCount || 0;
        }

        // Handle dates
        if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate' || sortConfig.key === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [discounts, search, statusFilter, sortConfig]);
};

export const useDiscountStats = (discounts) => {
  return useMemo(() => {
    const stats = {
      total: discounts.length,
      active: 0,
      expired: 0,
      upcoming: 0,
      totalUsage: 0,
    };

    discounts.forEach((discount) => {
      if (discount.status === 'active') stats.active++;
      else if (discount.status === 'expired') stats.expired++;
      else if (discount.status === 'upcoming') stats.upcoming++;
      
      stats.totalUsage += discount.usageCount || 0;
    });

    return stats;
  }, [discounts]);
};
