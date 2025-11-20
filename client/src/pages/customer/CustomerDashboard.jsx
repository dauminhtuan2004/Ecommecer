function CustomerDashboard() {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-4">Trang Khách Hàng</h2>
          <p className="text-center text-gray-700">Chào mừng bạn đến với giao diện khách hàng!</p>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Đây là nơi bạn có thể xem sản phẩm, đặt hàng, và quản lý thông tin cá nhân.</p>
          </div>
          <button
            onClick={() => localStorage.removeItem('token') && window.location.assign('/login')}
            className="mt-6 w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }
  
  export default CustomerDashboard;