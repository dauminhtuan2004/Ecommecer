import { Bell } from 'lucide-react';

function NotificationDropdown({ showNotifications, setShowNotifications }) {
  const notifications = [
    { id: 1, title: 'Đơn hàng mới', message: 'Có đơn hàng mới từ khách hàng', time: '5 phút trước' },
    { id: 2, title: 'Sản phẩm hết hàng', message: 'Áo Việt Nam sắp hết hàng', time: '10 phút trước' },
    { id: 3, title: 'Khuyến mãi kết thúc', message: 'Chương trình khuyến mãi sắp kết thúc', time: '30 phút trước' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200 relative"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notifications.length}
        </span>
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
          </div>
          
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              Không có thông báo mới
            </div>
          )}
          
          <div className="px-4 py-2 border-t border-gray-200">
            <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;