// src/components/admin/ProductManagement/ProductForm.jsx (cập nhật)
import React, { useState, useEffect } from "react";
import Button from "../../common/Button"; // Fix import: default
import Input from "../../common/Input"; // Fix import: default
import productService from "../../../services/productService"; // Default import

const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    basePrice: "", // Match backend 'basePrice'
    stock: "",
    description: "",
    categoryId: "",
    brandId: "",
    variants: [],
    images: [],
  });
  const [variants, setVariants] = useState([
    { size: "", color: "", price: "", stock: "", sku: "" },
  ]); // Thêm stock, sku từ JSON
  const [images, setImages] = useState([]); // { url, alt }

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        basePrice: product.basePrice, // Match field
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
        brandId: product.brandId,
        variants: product.variants || [],
        images: product.images || [],
      });
      setVariants(
        product.variants || [
          { size: "", color: "", price: "", stock: "", sku: "" },
        ]
      );
      setImages(product.images || []);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, variants };
      await onSave(data);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", color: "", price: "", stock: "", sku: "" },
    ]);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files); // Multiple files
    if (files.length === 0) return;

    if (product?.id) {
      // Edit mode, upload thật
      const uploadedImages = [];
      for (const file of files) {
        const formDataImage = new FormData();
        formDataImage.append("image", file); // Backend expect 'image' field
        try {
          const newImage = await productService.addImage(
            product.id,
            formDataImage
          ); // Gọi POST /products/:id/image với FormData
          uploadedImages.push(newImage);
        } catch (error) {
          console.error("Upload image error:", error);
          toast.error("Upload hình ảnh thất bại");
        }
      }
      setImages([...images, ...uploadedImages]);
    } else {
      // Preview tạm (create mode)
      const previewImages = files.map((file) => ({
        url: URL.createObjectURL(file),
        alt: file.name,
      }));
      setImages([...images, ...previewImages]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Tên Sản Phẩm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="number"
            name="basePrice"
            label="Giá Cơ Bản (VND)"
            value={formData.basePrice}
            onChange={(e) =>
              setFormData({ ...formData, basePrice: e.target.value })
            }
            required
          />
          <Input
            type="number"
            name="stock"
            label="Hàng Tồn"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
          <Input
            type="number"
            name="categoryId"
            label="Category ID"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            required
          />
          <Input
            type="number"
            name="brandId"
            label="Brand ID"
            value={formData.brandId}
            onChange={(e) =>
              setFormData({ ...formData, brandId: e.target.value })
            }
          />
          <Input
            type="textarea"
            name="description"
            label="Mô Tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />

          {/* Variants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variants
            </label>
            {variants.map((variant, index) => (
              <div key={index} className="border p-3 rounded mb-2 space-y-2">
                <Input
                  type="text"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                />
                <Input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Price Override"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Stock Variant"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                />
                <Input
                  type="text"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) =>
                    handleVariantChange(index, "sku", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  Xóa Variant
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addVariant}>
              Thêm Variant
            </Button>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình Ảnh
            </label>
            <Input
              type="file"
              name="image"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
            />
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="absolute top-0 right-0 w-5 h-5 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
