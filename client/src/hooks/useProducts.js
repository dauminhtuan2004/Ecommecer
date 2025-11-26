import { useState, useEffect } from 'react';
import productService from '../services/productService';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(filters);
      console.log('📦 Products response:', response);
      
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else {
        productsData = [];
      }
      
      setProducts(productsData);
      
      if (response.total) {
        setTotalPages(Math.ceil(response.total / filters.limit));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('🔄 Starting to load categories...');
      const response = await productService.getCategories();
      console.log('📂 Raw categories response:', response);
      
      let categoriesData = [];
      
      // Debug chi tiết response structure
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      console.log('Has data property:', 'data' in response);
      console.log('Response.data:', response.data);
      
      if (response && Array.isArray(response.data)) {
        categoriesData = response.data;
        console.log('✅ Using response.data');
      } else if (Array.isArray(response)) {
        categoriesData = response;
        console.log('✅ Using direct response array');
      } else {
        console.warn('⚠️ No categories data found');
        categoriesData = [];
      }
      
      console.log('✅ Final categories data:', categoriesData);
      console.log('✅ Number of categories:', categoriesData.length);
      
      setCategories(categoriesData);
      
      if (categoriesData.length === 0) {
        console.warn('⚠️ Categories array is empty');
        toast.error('Không có danh mục nào được tìm thấy');
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      toast.error('Không thể tải danh mục: ' + error.message);
      setCategories([]);
    }
  };

  const loadBrands = async () => {
    try {
      console.log('🔄 Starting to load brands...');
      const response = await productService.getBrands();
      console.log('🏷️ Raw brands response:', response);
      
      let brandsData = [];
      
      if (response && Array.isArray(response.data)) {
        brandsData = response.data;
      } else if (Array.isArray(response)) {
        brandsData = response;
      } else {
        brandsData = [];
      }
      
      console.log('✅ Final brands data:', brandsData);
      console.log('✅ Number of brands:', brandsData.length);
      
      setBrands(brandsData);
      
      if (brandsData.length === 0) {
        console.warn('⚠️ Brands array is empty');
      }
    } catch (error) {
      console.error('❌ Error loading brands:', error);
      toast.error('Không thể tải thương hiệu: ' + error.message);
      setBrands([]);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    console.log('🚀 useProducts hook mounted');
    
    const initializeData = async () => {
      console.log('🔄 Initializing all data...');
      await loadCategories();
      await loadBrands();
      await loadProducts();
      console.log('✅ All data initialized');
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  return {
    products,
    categories,
    brands,
    loading,
    filters,
    totalPages,
    loadProducts,
    updateFilters
  };
};