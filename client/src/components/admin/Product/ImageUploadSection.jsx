import { Upload, X } from 'lucide-react';

const ImageUploadSection = ({ 
  product, 
  images, 
  uploading, 
  onImageUpload, 
  onRemoveImage 
}) => {
  return (
    <div className="border-t pt-6">
      <label className="text-lg font-semibold text-gray-900 mb-4 block">
        Hình Ảnh Sản Phẩm
      </label>
      
      {!product?.id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            ℹ️ Vui lòng <strong>lưu sản phẩm trước</strong> để có thể upload ảnh
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={onImageUpload}
          disabled={!product?.id || uploading}
          className="hidden"
        />
        <label 
          htmlFor="image-upload" 
          className={`cursor-pointer ${(!product?.id || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-2">
            {uploading ? 'Đang upload...' : 'Click để chọn ảnh hoặc kéo thả vào đây'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF, WEBP (tối đa 5MB mỗi file)
          </p>
        </label>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">
            {images.length} ảnh
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={img.id || index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {img.isThumbnail && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Thumbnail
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={() => onRemoveImage(img, index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X size={16} />
                </button>
                
                <p className="mt-2 text-xs text-gray-600 truncate">
                  {img.altText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;