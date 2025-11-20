import { Heart, Code } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left Side - Copyright */}
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>&copy; 2024 AdminPanel.</span>
            <span>Tất cả quyền được bảo lưu.</span>
          </div>

          {/* Center - Made with love */}
          <div className="flex items-center space-x-1 text-sm text-slate-500">
            <span>Được tạo với</span>
            <Heart className="text-red-500" size={14} fill="currentColor" />
            <span>và</span>
            <Code className="text-blue-500" size={14} />
            <span>tại Việt Nam</span>
          </div>

          {/* Right Side - Version & Links */}
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span className="bg-slate-100 px-2 py-1 rounded-full text-xs font-medium">
              v1.0.0
            </span>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Hỗ trợ
            </a>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Tài liệu
            </a>
          </div>
        </div>

        {/* Bottom Section - Additional Info */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Phiên bản cuối: 22/09/2024</span>
              <span>•</span>
              <span>Trạng thái: Hoạt động</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Server Online</span>
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Được xây dựng với React & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;