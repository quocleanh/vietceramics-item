import axios from 'axios';

// Tạo instance axios với config mặc định
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Thêm interceptor để xử lý token
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data cho development
const mockProductData = {
  id: "UBQ194AVE9PDV-01",
  No_: "UBQ194AVE9PDV-01",
  Class: "AVEO",
  productType: "bath",
  name: "Bồn tắm AVEO UBQ194AVE9PDV-01",
  itemCode: "UBQ194AVE9PDV-01",
  price: "350,044,000đ",
  originalPrice: "350,044,000đ",
  discount: "12%",
  shortDescription: "",
  longDescription: "Bồn tắm cao cấp nhập khẩu, chất liệu bền đẹp, thiết kế hiện đại, phù hợp nhiều không gian phòng tắm.\n\nBảo hành: 5 năm.",
  specifications: {
    'Mã sản phẩm': 'UBQ194AVE9PDV-01',
    'Loại sản phẩm': 'Bồn Tắm',
    'Chi tiết loại sản phẩm': 'Bồn Tắm Thường - Tự Đứng',
    'Thương hiệu': 'VB(Netherland)',
    'Xuất xứ': 'Hà Lan - Châu Âu',
    'Bộ sưu tập': 'AVEO',
    'Lỗ xả tràn': 'Có',
    'Lỗ bắt vòi (Tap hole)': 'Không',
    'Có kèm bộ xả (Waste included)': 'Không',
    'Thông minh': 'Chưa Phân Loại',
    'Thoát tường': 'Chưa Phân Loại',
    'Thoát sàn': 'Chưa Phân Loại',
    'Chất liệu': 'Hỗn Hợp Bột Đá Ép Và Nhựa',
    'Phong cách': 'Hiện Đại',
    'Màu sắc': 'Sứ Màu Trắng',
    'Bề mặt': 'Bóng',
    'Lắp đặt': 'Tự Đứng',
    'Dài': '0',
    'Rộng (mm)': '0',
    'Cao (mm)': '0',
    'Sâu (mm)': '0',
    'Thể tích': '0',
    'Chân bồn tắm': 'Không',
    'Hình dáng': 'Chưa Phân Loại'
  },
  lotPrices: [
    {
      code: 'LOT-2024-001',
      price: '18.900.000đ',
      status: 'available'
    },
    {
      code: 'LOT-2024-002',
      price: '18.500.000đ',
      status: 'available'
    },
    {
      code: 'LOT-2024-003',
      price: '19.000.000đ',
      status: 'sold'
    }
  ]
};

export const productService = {
  /**
   * Lấy thông tin chi tiết sản phẩm
   * @param {string} productId - ID của sản phẩm
   * @returns {Promise} Promise chứa thông tin sản phẩm
   */
  async getProductDetail(productId) {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await apiClient.get(`/products/${productId}`);
      // return response.data;

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300)); // Giả lập delay
      return mockProductData;
    } catch (error) {
      console.error('Error fetching product detail:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách hình ảnh của sản phẩm
   * @param {string} productId - ID của sản phẩm
   * @param {string} imageType - Loại hình ảnh (product/perspective/real)
   * @returns {Promise} Promise chứa danh sách URL hình ảnh
   */
  async getProductImages(productId, imageType = 'product') {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await apiClient.get(`/products/${productId}/images?type=${imageType}`);
      // return response.data;

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 200)); // Giả lập delay
      
      const baseUrl = import.meta.env.VITE_CDN_BASE_URL;
      const images = [];
      
      // Giả lập logic lấy hình ảnh
      switch (imageType) {
        case 'product':
          images.push(`${baseUrl}hinh-gach/${productId}.jpg`);
          break;
        case 'perspective':
          for (let i = 1; i <= 5; i++) {
            const suffix = i === 1 ? '' : ` (${i})`;
            images.push(`${baseUrl}hinh-phoi/AVEO_${productId}${suffix}.jpg`);
          }
          break;
        case 'real':
          images.push(`${baseUrl}hinh-thuc-te/${productId}.jpg`);
          break;
      }
      
      return images;
    } catch (error) {
      console.error('Error fetching product images:', error);
      throw error;
    }
  }
}; 