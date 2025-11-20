import { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productServices';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts(page); // { success, message, data: [...], pagination: {...} }

      // Xử lý đúng cấu trúc response từ API
      if (response.success) {
        setProducts(response.data || []); // Gán mảng sản phẩm từ data
        setTotalPages(response.pagination?.pages || 1); // Lấy tổng số trang từ pagination
        setCurrentPage(response.pagination?.page || page); // Cập nhật trang hiện tại
      } else {
        throw new Error(response.message || 'Lấy sản phẩm thất bại!');
      }
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  const addProduct = async (productData, imageFile) => {
    try {
      const response = await createProduct(productData, imageFile);
      if (response.success) {
        fetchProducts(currentPage); // Tải lại trang hiện tại
        return response.data; // Trả về sản phẩm mới
      }
      throw new Error(response.message || 'Tạo sản phẩm thất bại!');
    } catch (err) {
      setError(err.message || err);
      throw err;
    }
  };

  const handleSaveProduct = async (id, data) => {
    setIsSaving(true);
    try {
      if (id) {
        await editProduct(id, data); // data là FormData
      } else {
        await addProduct(data); // data là FormData
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Trong editProduct
  const editProduct = async (id, data) => {
    try {
      const response = await updateProduct(id, data); // data là FormData
      if (response.success) {
        // Cập nhật state với dữ liệu từ response
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? response.data : p))
        );
        return response.data;
      }
      throw new Error(response.message || 'Cập nhật thất bại');
    } catch (err) {
      setError(err.message || err);
      throw err;
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        fetchProducts(currentPage); // Tải lại dữ liệu
      } else {
        throw new Error(response.message || 'Xóa sản phẩm thất bại!');
      }
    } catch (err) {
      setError(err.message || err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};

export default useProducts;