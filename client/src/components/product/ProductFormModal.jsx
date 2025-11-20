import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import useCategories from '../../hooks/useCategories';

function ProductFormModal({ isOpen, onClose, productToEdit, onSave, isLoading }) {
    const { categories } = useCategories();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        size: '',
        color: '',
        status: 'Active',
        image: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                description: productToEdit.description || '',
                price: productToEdit.price || '',
                stock: productToEdit.stock || '',
                category: productToEdit.category ? productToEdit.category.id : '',
                size: productToEdit.size || '',
                color: productToEdit.color || '',
                status: productToEdit.status || 'Active',
                image: null, // Reset image input
            });
            setPreviewImage(productToEdit.image || null); // Sử dụng trực tiếp URL Cloudinary
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: '',
                size: '',
                color: '',
                status: 'Active',
                image: null,
            });
            setPreviewImage(null);
        }
        setErrors({});
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            setFormData({ ...formData, image: files[0] });
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors({ ...errors, [name]: null });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Product name is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
        if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock must be a non-negative integer';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!productToEdit && !formData.image) newErrors.image = 'Product image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
            size: formData.size,
            color: formData.color,
            categoryId: parseInt(formData.category, 10),
        };
        data.append('productData', JSON.stringify(productData));

        if (formData.image) {
            data.append('image', formData.image);
        }

        console.log("ProductFormModal - productToEdit before onSave:", productToEdit);
        await onSave(productToEdit ? productToEdit.id : null, data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                    {productToEdit ? '✏️ Edit Product' : '➕ Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600">Size</label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600">Product Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {previewImage && (
                                <div className="mt-4">
                                    <img
                                        src={previewImage}
                                        alt="Product Preview"
                                        className="h-48 w-48 object-cover rounded-xl border shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {productToEdit ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductFormModal;