import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import ProductGrid from '../../../components/customer/products/ProductGrid';
import ProductFilter from '../../../components/customer/products/ProductFilter';
import Pagination from '../../../components/common/Pagination';
import { productService } from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Get filters from URL
  const getFiltersFromURL = () => ({
    brandId: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    inStock: searchParams.get('inStock') === 'true',
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Load category info
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categories = await categoryService.getAll();
        const found = categories.find(cat => cat.id === parseInt(id));
        setCategory(found);
      } catch (error) {
        console.error('Error loading category:', error);
        toast.error('Không tìm thấy danh mục');
      }
    };
    loadCategory();
  }, [id]);

  // Load brands
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsRes = await productService.getBrands();
        setBrands(brandsRes?.data || []);
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    };
    loadBrands();
  }, []);

  // Load products
  useEffect(() => {
    if (category) {
      loadProducts();
    }
  }, [category, searchParams]);

  const loadProducts = async () => {
    if (!category) return;

    try {
      setLoading(true);
      const filters = getFiltersFromURL();
      
      const response = await productService.getAll({
        page: filters.page,
        limit: pagination.limit,
        categoryId: category.id,
        brandId: filters.brandId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
        inStock: filters.inStock,
      });

      // Fix: axios response có cấu trúc { data: { data: [], page, total, totalPages } }
      const productsData = response.data?.data || response.data || [];
      const pageInfo = response.data;

      setProducts(productsData);
      setPagination({
        ...pagination,
        page: pageInfo?.page || 1,
        total: pageInfo?.total || 0,
        totalPages: pageInfo?.totalPages || 1,
      });
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    
    if (filters.brandId) params.set('brand', filters.brandId);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.set('sort', filters.sortBy);
    if (filters.inStock) params.set('inStock', 'true');
    
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!category && !loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy danh mục
          </h1>
          <a href="/products" className="text-blue-600 hover:underline">
            Xem tất cả sản phẩm
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900">Trang chủ</a>
              <span>/</span>
              <a href="/products" className="hover:text-gray-900">Sản phẩm</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{category?.name}</span>
            </nav>
          </div>

          {/* Category Header */}
          {category && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mb-4">{category.description}</p>
              )}
              <p className="text-gray-600">
                Tìm thấy {pagination.total} sản phẩm
              </p>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filter */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>
                <ProductFilter
                  brands={brands}
                  currentFilters={getFiltersFromURL()}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <ProductGrid products={products} loading={loading} />

              {/* Pagination */}
              {!loading && products.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
