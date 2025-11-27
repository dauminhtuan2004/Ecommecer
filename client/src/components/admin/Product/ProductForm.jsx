import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import productService from "../../../services/productService";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import BasicInfoSection from "./BasicInfoSection";
import VariantSection from "./VariantSection";
import ImageUploadSection from "./ImageUploadSection";

const ProductForm = ({
  product,
  categories = [],
  brands = [],
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
    stock: "",
    description: "",
    categoryId: "",
    brandId: "",
  });

  const [variants, setVariants] = useState([
    { size: "", color: "", price: "", stock: "", sku: "" },
  ]);

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        basePrice: product.basePrice,
        stock: product.stock,
        description: product.description,
        categoryId: product.categoryId,
        brandId: product.brandId,
      });
      setVariants(
        product.variants?.length > 0
          ? product.variants
          : [{ size: "", color: "", price: "", stock: "", sku: "" }]
      );
      setImages(product.images || []);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format data đúng với DTO validation
      const data = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice), // Chuyển thành number
        categoryId: parseInt(formData.categoryId), // Chuyển thành number
        brandId: formData.brandId ? parseInt(formData.brandId) : null, // Chuyển thành number hoặc null
        // THÊM VARIANTS VÀO ĐÂY
        variants: variants
          .filter(
            (variant) =>
              variant.size || variant.color || variant.stock || variant.sku
          ) // Chỉ lấy variants có dữ liệu
          .map((variant) => ({
            size: variant.size || undefined,
            color: variant.color || undefined,
            price: variant.price
              ? parseFloat(variant.price)
              : parseFloat(formData.basePrice),
            stock: parseInt(variant.stock) || 0,
            sku: variant.sku || undefined,
          })),
      };

      console.log("📦 Data to save:", data);
      console.log("🔄 Variants to save:", data.variants);

      await onSave(data);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Lưu sản phẩm thất bại");
    }
  };
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", color: "", price: "", stock: "", sku: "" },
    ]);
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index][field] = value;
      return newVariants;
    });
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = files.filter((f) => !validTypes.includes(f.type));

    if (invalidFiles.length > 0) {
      toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)");
      return;
    }

    const oversizedFiles = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    if (!product?.id) {
      toast.info("Vui lòng lưu sản phẩm trước khi upload ảnh");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Đang upload ảnh...", { id: "upload" });

      const response = await productService.uploadImages(product.id, files, {
        altText: formData.name,
        isThumbnail: images.length === 0,
      });

      setImages((prev) => [...prev, ...response.images]);
      toast.success(`Upload thành công ${response.images.length} ảnh`, {
        id: "upload",
      });
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload ảnh thất bại", {
        id: "upload",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (image, index) => {
    if (!product?.id) {
      setImages((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!confirm(`Xóa ảnh "${image.altText}"?`)) return;

    try {
      await productService.deleteImage(image.id);
      setImages((prev) => prev.filter((_, i) => i !== index));
      toast.success("Xóa ảnh thành công");
    } catch (error) {
      // console.error("Delete image error:", error);
      toast.error("Xóa ảnh thất bại");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {product ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <BasicInfoSection
            formData={formData}
            categories={categories}
            brands={brands}
            onFormChange={handleFormChange}
          />

          <VariantSection
            variants={variants}
            onVariantChange={handleVariantChange}
            onAddVariant={addVariant}
            onRemoveVariant={removeVariant}
          />

          <ImageUploadSection
            product={product}
            images={images}
            uploading={uploading}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
          />

          <div className="border-t pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={uploading}>
              {product ? "Cập Nhật" : "Tạo Mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
