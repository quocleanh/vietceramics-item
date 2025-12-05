import axios from 'axios';
import fieldDefinitions from '@/assets/product_field_definitions.json';

const apiBaseUrl = 'https://api.vietceramics.com/api';
const rawCdnBaseUrl = (import.meta.env.VITE_CDN_BASE_URL || 'https://static.superstone.com.vn/products-test/').trim();
const cdnBaseUrl = rawCdnBaseUrl.endsWith('/') ? rawCdnBaseUrl : `${rawCdnBaseUrl}/`;
const maxImageVariants = 10;
const fieldRows = fieldDefinitions?.rows || [];
const fieldLabelMap = fieldRows.reduce((acc, row) => {
  const key = row['Tên MISA'];
  const label = row['Tên Trường MISA'] || key;
  if (key && !acc[key]) acc[key] = label;
  return acc;
}, {});

const formatCurrency = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString('vi-VN') + 'đ';
};
const buildCollectionPrefix = (collectionName) => {
  if (!collectionName) return '';
  return `${encodeURIComponent(collectionName)}_`;
};
const valueToDisplay = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'boolean') return val ? 'Có' : 'Không';
  const str = String(val).trim();
  return str.length ? str : null;
};
const buildSpecsFromDefinitions = (item) => {
  const specs = {};
  fieldRows.forEach(row => {
    const key = row['Tên MISA'];
    const label = fieldLabelMap[key] || key;
    const value = valueToDisplay(item[key]);
    if (key && value !== null) {
      specs[label] = value;
    }
  });
  return specs;
};
const buildNumberedUrls = (basePath, code, prefix = '') => {
  const urls = [];
  urls.push(`${cdnBaseUrl}${basePath}/${prefix}${code}.jpg`); // first image without suffix
  for (let i = 2; i <= maxImageVariants; i++) {
    const suffix = ` (${i})`;
    urls.push(`${cdnBaseUrl}${basePath}/${prefix}${code}${suffix}.jpg`);
  }
  return urls;
};
const imageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    // Avoid cached 404 by adding cache buster
    img.src = url;
  });
};
const filterExistingImages = async (urls) => {
  const results = await Promise.all(urls.map(async (url) => (await imageExists(url) ? url : null)));
  return results.filter(Boolean);
};

export const productService = {
  /**
   * Lấy thông tin chi tiết sản phẩm
   * @param {string} productId - ID của sản phẩm
   * @returns {Promise} Promise chứa thông tin sản phẩm
   */
  async getProductDetail(productId) {
    try {
      const response = await axios.get(`${apiBaseUrl}/Products/Search`, {
        params: {
          keyword: productId,
          pageIndex: 1,
          pageSize: 1
        }
      });

      const item = Array.isArray(response.data?.data) ? response.data.data[0] : null;
      if (!item) {
        throw new Error('Product not found');
      }

      const code = item.product_code || item.id || productId;
      let priceValue = item.unit_price;
      // Lấy giá từ API PricesByCode nếu có
      try {
        const priceRes = await axios.get(`${apiBaseUrl}/Products/PricesByCode`, {
          params: { itemNo: code }
        });
        console.log('PricesByCode response:', priceRes.data);
        const priceData = priceRes.data;
        let extracted = null;
        if (Array.isArray(priceData?.data) && priceData.data.length) {
          const p = priceData.data[0];
          extracted = p?.price ?? p?.Price ?? p?.unit_price ?? p?.UnitPrice ?? null;
        } else if (priceData?.price !== undefined) {
          extracted = priceData.price;
        } else if (typeof priceData === 'number' || typeof priceData === 'string') {
          extracted = priceData;
        }
        if (extracted !== null && extracted !== undefined && !Number.isNaN(Number(extracted))) {
          priceValue = Number(extracted);
        }
      } catch (err) {
        console.warn('PricesByCode fetch failed, fallback to search price', err);
      }
      const price = formatCurrency(priceValue);
      const specs = buildSpecsFromDefinitions(item);

      // Map API fields to UI model
      return {
        id: code,
        No_: code,
        itemCode: code,
        productType: item.product_category || 'product',
        name: item.product_name || code,
        price,
        originalPrice: price,
        discount: item.discount ? `${item.discount}%` : '',
        shortDescription: item.description || '',
        longDescription: item.description || item.custom_field51 || '',
        collectionName: item.custom_field121 || item.product_category || 'Chưa phân loại',
        specifications: Object.keys(specs).length ? specs : {
          'Mã sản phẩm': code,
          'Danh mục': item.product_category || 'Đang cập nhật',
          'Đơn vị': item.usage_unit || 'Đang cập nhật',
          'Bề mặt': item.custom_field89 || 'Đang cập nhật',
          'Màu sắc': item.custom_field90 || 'Đang cập nhật',
          'Kích thước': item.custom_field104 || item.custom_field141 || 'Đang cập nhật',
          'Thương hiệu': item.custom_field140 || 'Đang cập nhật',
          'Xuất xứ': item.custom_field93 || 'Đang cập nhật',
          'Bảo hành': item.warranty_period || 'Liên hệ'
        },
        images: [],
        images_real: [],
        lotPrices: [],
        comboItems: []
      };
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
  async getProductImages(productId, imageType = 'product', collectionName = '') {
    try {
      let candidates = [];
      switch (imageType) {
        case 'product':
          candidates = buildNumberedUrls('hinh-gach', productId);
          break;
        case 'perspective':
          candidates = buildNumberedUrls('hinh-phoi', productId, buildCollectionPrefix(collectionName));
          break;
        case 'real':
          candidates = buildNumberedUrls('hinh-thuc-te', productId);
          break;
        default:
          candidates = [];
      }
      return await filterExistingImages(candidates);
    } catch (error) {
      console.error('Error fetching product images:', error);
      throw error;
    }
  }
};
