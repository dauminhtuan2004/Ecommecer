import Button from '../../common/Button';

const PromoBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Large Promo */}
          <div className="relative overflow-hidden rounded-3xl h-[500px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
              alt="Summer Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-block w-fit px-4 py-1 bg-white text-gray-900 text-sm font-bold rounded-full mb-4">
                NEW COLLECTION
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Bộ Sưu Tập<br />Mùa Hè 2024
              </h2>
              <p className="text-lg text-gray-200 mb-6 max-w-md">
                Khám phá những thiết kế thời trang mới nhất, phong cách và năng động
              </p>
              <Button className="w-fit px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-semibold shadow-xl">
                Khám Phá Ngay
              </Button>
            </div>
          </div>

          {/* Two Small Promos */}
          <div className="space-y-6">
            {/* Promo 1 */}
            <div className="relative overflow-hidden rounded-3xl h-[238px] group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
                alt="Accessories"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Phụ Kiện Cao Cấp
                </h3>
                <p className="text-white/90 mb-4">
                  Giảm giá lên đến 40%
                </p>
                <Button className="w-fit px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-semibold text-sm">
                  Mua Ngay
                </Button>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="relative overflow-hidden rounded-3xl h-[238px] group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2"
                alt="Shoes"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Giày Thể Thao
                </h3>
                <p className="text-white/90 mb-4">
                  Xu hướng 2024
                </p>
                <Button className="w-fit px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-semibold text-sm">
                  Xem Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
