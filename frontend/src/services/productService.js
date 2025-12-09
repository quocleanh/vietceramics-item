import axios from 'axios';
import fieldDefinitions from '@/assets/product_field_definitions.json';

const apiBaseUrl = 'https://api.vietceramics.com/api';
const rawCdnBaseUrl = (import.meta.env.VITE_CDN_BASE_URL || 'https://static.superstone.com.vn/products-test/').trim();
const cdnBaseUrl = rawCdnBaseUrl.endsWith('/') ? rawCdnBaseUrl : `${rawCdnBaseUrl}/`;
const maxImageVariants = 10;
const fieldRows = fieldDefinitions?.rows || [];
const priceApiToken = (import.meta.env.VITE_PRICE_API_TOKEN || '').trim() ||
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlQWNjZXNzVG9rZW4iLCJpYXQiOiI3LzI1LzIwMjQgNzoxODoyNiBBTSIsIkRpc3BsYXlOYW1lIjoiTMOqIEFuaCBRdeG7kWMiLCJVc2VyTmFtZSI6InF1b2NsYSIsIkVtYWlsIjoiIiwiZXhwIjoxODA4MjkxOTA2LCJpc3MiOiJKV1RBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkpXVFNlcnZpY2VQb3N0bWFuQ2xpZW50In0.3G0rhhEoCLx6a8hur1OFSP0F6SkS3xvMVy9jfh0kbP8';
const DEFAULT_SPEC_PLACEHOLDER = 'Đang cập nhật';
const fieldLabelMap = fieldRows.reduce((acc, row) => {
  const key = row['Tên MISA'];
  const label = row['Tên Trường MISA'] || key;
  if (key && !acc[key]) acc[key] = label;
  return acc;
}, {});

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'Liên hệ';
  const number = Number(value);
  if (Number.isNaN(number) || number <= 0) return 'Liên hệ';
  return number.toLocaleString('vi-VN') + 'đ';
};
const normalizePrice = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
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
    if (!key || !label) return;
    const value = valueToDisplay(item[key]);
    specs[label] = value !== null ? value : DEFAULT_SPEC_PLACEHOLDER;
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
const normalizeLotStatus = (lot) => {
  const statusFields = [
    lot?.status,
    lot?.Status,
    lot?.status_text,
    lot?.statusText,
    lot?.StatusText
  ].filter(Boolean);

  const statusStr = statusFields
    .map(val => String(val).toLowerCase())
    .join(' ');

  const isSoldFlag = lot?.isSold === true || lot?.is_sold === true || statusStr.includes('sold');
  if (isSoldFlag || statusStr.includes('hết') || statusStr.includes('het') || statusStr.includes('out')) {
    return 'sold';
  }
  return 'available';
};
const mapLotPrices = (rawLots = []) => {
  if (!Array.isArray(rawLots)) return [];
  return rawLots.map((lot, idx) => {
    const code = lot.lotCode || lot.code || lot.LotCode || lot.Code || lot.lot_code || `Lô ${idx + 1}`;
    const priceValue = lot.price ?? lot.Price ?? lot.unit_price ?? lot.UnitPrice ?? null;
    return {
      code,
      price: formatCurrency(priceValue),
      status: normalizeLotStatus(lot)
    };
  });
};

export const productService = {
  /**
   * Lấy giá theo lô của sản phẩm
   * @param {string} itemCode
   * @returns {Promise<Array>}
   */
  async getLotPrices(itemCode) {
    if (!itemCode) return [];
    try {
      const headers = priceApiToken ? { Authorization: priceApiToken } : {};
      const response = await axios.get(`${apiBaseUrl}/Products/PricesByCode`, {
        params: { itemNo: itemCode },
        headers
      });
      const rawLots = Array.isArray(response.data?.data)
        ? response.data.data
        : (Array.isArray(response.data) ? response.data : []);
      return mapLotPrices(rawLots);
    } catch (error) {
      console.warn('Error fetching lot prices:', error);
      return [];
    }
  },
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
      let fallbackPrice = normalizePrice(item.unit_price);
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
        const normalizedExtracted = normalizePrice(extracted);
        if (normalizedExtracted !== null) {
          fallbackPrice = normalizedExtracted;
        }
      } catch (err) {
        console.warn('PricesByCode fetch failed, fallback to search price', err);
      }
      const apiBasePrice = normalizePrice(item.price_base ?? item.priceBase);
      const apiSalePrice = normalizePrice(item.price_sale ?? item.priceSale);
      let priceBaseValue = apiBasePrice ?? fallbackPrice ?? null;
      const priceSaleValue = apiSalePrice;
      const apiSaleFlag = item.is_sale === true || item.is_sale === '1' || item.is_sale === 1 || item.is_sale === 'true';
      const hasSalePricing = apiSaleFlag || (priceSaleValue !== null && priceBaseValue !== null && priceSaleValue < priceBaseValue);
      const displayPriceValue = hasSalePricing && priceSaleValue !== null
        ? priceSaleValue
        : (priceBaseValue ?? priceSaleValue ?? fallbackPrice ?? 0);
      if (priceBaseValue === null) {
        priceBaseValue = displayPriceValue;
      }
      const currentPriceFormatted = formatCurrency(displayPriceValue);
      const originalPriceFormatted = hasSalePricing && priceBaseValue !== null ? formatCurrency(priceBaseValue) : '';
      const specs = buildSpecsFromDefinitions(item);

      // Lấy giá theo lô
      let lotPrices = [];
      try {
        lotPrices = await this.getLotPrices(code);
      } catch (err) {
        console.warn('getLotPrices failed, continue without lot data', err);
      }

      // Map API fields to UI model
      return {
        id: code,
        No_: code,
        itemCode: code,
        productType: item.product_category || 'product',
        name: item.product_name || code,
        price: currentPriceFormatted,
        originalPrice: originalPriceFormatted || currentPriceFormatted,
        priceBaseValue,
        priceSaleValue,
        displayPriceValue,
        isSale: Boolean(hasSalePricing && priceSaleValue !== null && priceBaseValue !== null && priceSaleValue !== priceBaseValue),
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
        lotPrices,
        /// giảm định data comboItems
        comboItems: [ 
        ]
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
