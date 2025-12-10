import axios from "axios";
const rows = [{ "Tên MISA": "owner_name", "Loại Trường": "Danh sách", "Tên Trường MISA": "Chủ sở hữu" }, { "Tên MISA": "product_code", "Loại Trường": "Số tự tăng", "Tên Trường MISA": "Mã hàng hóa" }, { "Tên MISA": "product_code", "Loại Trường": "Số tự tăng", "Tên Trường MISA": "Mã hàng hóa" }, { "Tên MISA": "product_category", "Loại Trường": "Tìm kiếm", "Tên Trường MISA": "Tên Nhóm VTHH" }, { "Tên MISA": "usage_unit", "Loại Trường": "Danh sách", "Tên Trường MISA": "Đơn vị tính chính" }, { "Tên MISA": "custom_field142", "Loại Trường": "Danh sách", "Tên Trường MISA": "Đơn Vị Tính Cơ Bản" }, { "Tên MISA": "product_name", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên hàng hóa" }, { "Tên MISA": "inactive", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Ngừng theo dõi" }, { "Tên MISA": "unit_price", "Loại Trường": "Đơn giá", "Tên Trường MISA": "Đơn giá bán" }, { "Tên MISA": "tax", "Loại Trường": "Danh sách", "Tên Trường MISA": "Thuế GTGT" }, { "Tên MISA": "tax", "Loại Trường": "Danh sách", "Tên Trường MISA": "Thuế GTGT" }, { "Tên MISA": "description", "Loại Trường": "Nhiều dòng", "Tên Trường MISA": "Mô tả" }, { "Tên MISA": "created_date", "Loại Trường": "Ngày/Giờ", "Tên Trường MISA": "Ngày tạo" }, { "Tên MISA": "created_by", "Loại Trường": "Một dòng", "Tên Trường MISA": "Người tạo" }, { "Tên MISA": "modified_date", "Loại Trường": "Ngày/Giờ", "Tên Trường MISA": "Ngày sửa" }, { "Tên MISA": "modified_by", "Loại Trường": "Một dòng", "Tên Trường MISA": "Người sửa" }, { "Tên MISA": "purchased_price", "Loại Trường": "Đơn giá", "Tên Trường MISA": "Đơn giá mua" }, { "Tên MISA": "price_after_tax", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Giá bán là đơn giá sau thuế" }, { "Tên MISA": "is_public", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Dùng chung" }, { "Tên MISA": "form_layout", "Loại Trường": "Danh sách", "Tên Trường MISA": "Bố cục" }, { "Tên MISA": "organization_unit_name", "Loại Trường": "Tree", "Tên Trường MISA": "Đơn vị" }, { "Tên MISA": "is_follow_serial_number", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Theo dõi theo mã quy cách" }, { "Tên MISA": "unit_price1", "Loại Trường": "Đơn giá", "Tên Trường MISA": "Đơn giá bán 1" }, { "Tên MISA": "unit_price2", "Loại Trường": "Đơn giá", "Tên Trường MISA": "Đơn giá bán 2" }, { "Tên MISA": "unit_price_fixed", "Loại Trường": "Đơn giá", "Tên Trường MISA": "Đơn giá bán cố định" }, { "Tên MISA": "is_use_tax", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Ngầm định ghi nhận DS trước thuế" }, { "Tên MISA": "unit_cost", "Loại Trường": "Đơn giá", "Tên Trường MISA": "Đơn giá chi phí" }, { "Tên MISA": "sale_description", "Loại Trường": "Một dòng", "Tên Trường MISA": "Diễn giải khi bán" }, { "Tên MISA": "product_properties", "Loại Trường": "Danh sách", "Tên Trường MISA": "Tính chất" }, { "Tên MISA": "source", "Loại Trường": "Một dòng", "Tên Trường MISA": "Nguồn gốc" }, { "Tên MISA": "custom_field22", "Loại Trường": "Thập phân", "Tên Trường MISA": "Dài (cm)" }, { "Tên MISA": "custom_field23", "Loại Trường": "Thập phân", "Tên Trường MISA": "Rộng (cm)" }, { "Tên MISA": "custom_field24", "Loại Trường": "Thập phân", "Tên Trường MISA": "Cao (cm)" }, { "Tên MISA": "custom_field25", "Loại Trường": "Thập phân", "Tên Trường MISA": "Sâu (cm)" }, { "Tên MISA": "custom_field123", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Hình Dáng" }, { "Tên MISA": "custom_field125", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Phong Cách" }, { "Tên MISA": "custom_field124", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên vị trí lắp đặt" }, { "Tên MISA": "custom_field130", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có lỗ xả tràn" }, { "Tên MISA": "custom_field134", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có kèm bộ xả" }, { "Tên MISA": "custom_field133", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có lổ bắt vòi" }, { "Tên MISA": "custom_field135", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có xả vô tường" }, { "Tên MISA": "custom_field138", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có chân bồn tắm" }, { "Tên MISA": "custom_field139", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có Tính Năng Thông Minh" }, { "Tên MISA": "custom_field136", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Có xả xuống sàn" }, { "Tên MISA": "custom_field51", "Loại Trường": "Một dòng", "Tên Trường MISA": "Hướng Dẫn Sử Dụng" }, { "Tên MISA": "custom_field52", "Loại Trường": "Một dòng", "Tên Trường MISA": "Hướng Dẫn Bảo Quản" }, { "Tên MISA": "custom_field54", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên In Tem" }, { "Tên MISA": "custom_field58", "Loại Trường": "Một dòng", "Tên Trường MISA": "Hướng Dẫn Vận Chuyển" }, { "Tên MISA": "custom_field68", "Loại Trường": "Danh sách", "Tên Trường MISA": "Loại sản phẩm" }, { "Tên MISA": "custom_field68", "Loại Trường": "Danh sách", "Tên Trường MISA": "Loại sản phẩm" }, { "Tên MISA": "custom_field69", "Loại Trường": "Một dòng", "Tên Trường MISA": "Nhà Cung Cấp" }, { "Tên MISA": "custom_field70", "Loại Trường": "Một dòng", "Tên Trường MISA": "Mã Hàng NCU" }, { "Tên MISA": "custom_field73", "Loại Trường": "Một dòng", "Tên Trường MISA": "Diễn giải khi mua" }, { "Tên MISA": "custom_field74", "Loại Trường": "Một dòng", "Tên Trường MISA": "Độ Khác Biệt Màu Sắc" }, { "Tên MISA": "custom_field82", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Dễ Dàng Vệ Sinh" }, { "Tên MISA": "custom_field85", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Độ Chịu Lực Cao" }, { "Tên MISA": "custom_field86", "Loại Trường": "Một dòng", "Tên Trường MISA": "Nhà Sản Xuất" }, { "Tên MISA": "custom_field89", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Bề Mặt" }, { "Tên MISA": "custom_field90", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Màu Sắc" }, { "Tên MISA": "custom_field93", "Loại Trường": "Một dòng", "Tên Trường MISA": "Xuất Xứ" }, { "Tên MISA": "custom_field94", "Loại Trường": "Một dòng", "Tên Trường MISA": "Châu Lục" }, { "Tên MISA": "custom_field95", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Quốc Gia" }, { "Tên MISA": "custom_field96", "Loại Trường": "Một dòng", "Tên Trường MISA": "Loại Chất Liệu In Tem" }, { "Tên MISA": "custom_field97", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Không Tính Tồn Kho" }, { "Tên MISA": "custom_field97", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Không Tính Tồn Kho" }, { "Tên MISA": "custom_field98", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Tặng Chốt Cân Bằng" }, { "Tên MISA": "custom_field99", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Tặng Ke" }, { "Tên MISA": "custom_field141", "Loại Trường": "Một dòng", "Tên Trường MISA": "Quy Cách" }, { "Tên MISA": "custom_field140", "Loại Trường": "Chọn nhiều", "Tên Trường MISA": "Loại Bán Hàng" }, { "Tên MISA": "custom_field106", "Loại Trường": "Một dòng", "Tên Trường MISA": "Diễn giải sản phẩm" }, { "Tên MISA": "custom_field107", "Loại Trường": "Một dòng", "Tên Trường MISA": "Mã hàng trước gia công" }, { "Tên MISA": "custom_field108", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Trong nhà" }, { "Tên MISA": "custom_field109", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Ngoài trời" }, { "Tên MISA": "custom_field110", "Loại Trường": "Một dòng", "Tên Trường MISA": "Vị trí ốp lát" }, { "Tên MISA": "custom_field111", "Loại Trường": "Một dòng", "Tên Trường MISA": "Kháng Khuẩn" }, { "Tên MISA": "custom_field112", "Loại Trường": "Một dòng", "Tên Trường MISA": "Chống Trượt" }, { "Tên MISA": "custom_field114", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Gạch Cắt Cạnh" }, { "Tên MISA": "custom_field115", "Loại Trường": "Một dòng", "Tên Trường MISA": "Công Nghệ Bề Mặt" }, { "Tên MISA": "custom_field120", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Thiết Kế" }, { "Tên MISA": "custom_field121", "Loại Trường": "Một dòng", "Tên Trường MISA": "Dòng Sản Phẩm" }, { "Tên MISA": "custom_field121", "Loại Trường": "Một dòng", "Tên Trường MISA": "Dòng Sản Phẩm" }, { "Tên MISA": "custom_field122", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tên Nhóm Chất Liệu" }, { "Tên MISA": "custom_field143", "Loại Trường": "Một dòng", "Tên Trường MISA": "Link Website" }, { "Tên MISA": "custom_field144", "Loại Trường": "Chọn nhiều", "Tên Trường MISA": "Hiển Thị Công Năng In Tem" }, { "Tên MISA": "custom_field146", "Loại Trường": "Một dòng", "Tên Trường MISA": "Công Nghệ In" }, { "Tên MISA": "custom_field147", "Loại Trường": "Một dòng", "Tên Trường MISA": "Chứng chỉ môi trường" }, { "Tên MISA": "custom_field166", "Loại Trường": "Thập phân", "Tên Trường MISA": "Trọng Lượng/DVT Chính" }, { "Tên MISA": "custom_field113", "Loại Trường": "Một dòng", "Tên Trường MISA": "Số Lượng Vân" }, { "Tên MISA": "custom_field168", "Loại Trường": "Một dòng", "Tên Trường MISA": "Công nghệ chống trượt" }, { "Tên MISA": "custom_field148", "Loại Trường": "Một dòng", "Tên Trường MISA": "Kích Thước Mô Phỏng" }, { "Tên MISA": "custom_field171", "Loại Trường": "Một dòng", "Tên Trường MISA": "Nhóm sản phẩm" }, { "Tên MISA": "custom_field172", "Loại Trường": "Một dòng", "Tên Trường MISA": "Mô tả chi tiết sản phẩm" }, { "Tên MISA": "custom_field173", "Loại Trường": "Một dòng", "Tên Trường MISA": "Mã màu sắc" }, { "Tên MISA": "custom_field174", "Loại Trường": "Một dòng", "Tên Trường MISA": "Các mã trong set" }, { "Tên MISA": "custom_field175", "Loại Trường": "Một dòng", "Tên Trường MISA": "Công nghệ nổi bật" }, { "Tên MISA": "custom_field176", "Loại Trường": "Một dòng", "Tên Trường MISA": "Giải thưởng" }, { "Tên MISA": "custom_field177", "Loại Trường": "Tích chọn", "Tên Trường MISA": "Lên Website" }, { "Tên MISA": "custom_field149", "Loại Trường": "Một dòng", "Tên Trường MISA": "Colour" }, { "Tên MISA": "custom_field150", "Loại Trường": "Một dòng", "Tên Trường MISA": "Finish" }, { "Tên MISA": "custom_field151", "Loại Trường": "Một dòng", "Tên Trường MISA": "Tiling Location" }, { "Tên MISA": "custom_field152", "Loại Trường": "Một dòng", "Tên Trường MISA": "Origin" }, { "Tên MISA": "custom_field155", "Loại Trường": "Một dòng", "Tên Trường MISA": "Anti Bacteria" }, { "Tên MISA": "custom_field156", "Loại Trường": "Một dòng", "Tên Trường MISA": "Anti-slip Technology" }, { "Tên MISA": "custom_field157", "Loại Trường": "Một dòng", "Tên Trường MISA": "Surface Technology" }, { "Tên MISA": "custom_field158", "Loại Trường": "Một dòng", "Tên Trường MISA": "Printing Technology" }, { "Tên MISA": "custom_field164", "Loại Trường": "Một dòng", "Tên Trường MISA": "Unit Measurement" }, { "Tên MISA": "custom_field165", "Loại Trường": "Một dòng", "Tên Trường MISA": "Design" }, { "Tên MISA": "custom_field169", "Loại Trường": "Một dòng", "Tên Trường MISA": "Product Description" }, { "Tên MISA": "custom_field178", "Loại Trường": "Một dòng", "Tên Trường MISA": "Prize" }];
const fieldDefinitions = {
  rows
};
const apiBaseUrl = "https://api.vietceramics.com/api";
const rawCdnBaseUrl = "https://static.superstone.com.vn/products-test/".trim();
const cdnBaseUrl = rawCdnBaseUrl.endsWith("/") ? rawCdnBaseUrl : `${rawCdnBaseUrl}/`;
const maxImageVariants = 10;
const fieldRows = (fieldDefinitions == null ? void 0 : fieldDefinitions.rows) || [];
const priceApiToken = "".trim() || "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlQWNjZXNzVG9rZW4iLCJpYXQiOiI3LzI1LzIwMjQgNzoxODoyNiBBTSIsIkRpc3BsYXlOYW1lIjoiTMOqIEFuaCBRdeG7kWMiLCJVc2VyTmFtZSI6InF1b2NsYSIsIkVtYWlsIjoiIiwiZXhwIjoxODA4MjkxOTA2LCJpc3MiOiJKV1RBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkpXVFNlcnZpY2VQb3N0bWFuQ2xpZW50In0.3G0rhhEoCLx6a8hur1OFSP0F6SkS3xvMVy9jfh0kbP8";
const DEFAULT_SPEC_PLACEHOLDER = "Đang cập nhật";
const fieldLabelMap = fieldRows.reduce((acc, row) => {
  const key = row["Tên MISA"];
  const label = row["Tên Trường MISA"] || key;
  if (key && !acc[key]) acc[key] = label;
  return acc;
}, {});
const formatCurrency = (value) => {
  if (value === null || value === void 0 || value === "") return "Liên hệ";
  const number = Number(value);
  if (Number.isNaN(number) || number <= 0) return "Liên hệ";
  return number.toLocaleString("vi-VN") + "đ";
};
const normalizePrice = (value) => {
  if (value === null || value === void 0 || value === "") return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};
const buildCollectionPrefix = (collectionName) => {
  if (!collectionName) return "";
  return `${encodeURIComponent(collectionName)}_`;
};
const valueToDisplay = (val) => {
  if (val === null || val === void 0) return null;
  if (typeof val === "boolean") return val ? "Có" : "Không";
  const str = String(val).trim();
  return str.length ? str : null;
};
const buildSpecsFromDefinitions = (item) => {
  const specs = {};
  fieldRows.forEach((row) => {
    const key = row["Tên MISA"];
    const label = fieldLabelMap[key] || key;
    if (!key || !label) return;
    const value = valueToDisplay(item[key]);
    specs[label] = value !== null ? value : DEFAULT_SPEC_PLACEHOLDER;
  });
  return specs;
};
const buildNumberedUrls = (basePath, code, prefix = "") => {
  const urls = [];
  urls.push(`${cdnBaseUrl}${basePath}/${prefix}${code}.jpg`);
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
    img.src = url;
  });
};
const filterExistingImages = async (urls) => {
  const results = await Promise.all(urls.map(async (url) => await imageExists(url) ? url : null));
  return results.filter(Boolean);
};
const normalizeLotStatus = (lot) => {
  const statusFields = [
    lot == null ? void 0 : lot.status,
    lot == null ? void 0 : lot.Status,
    lot == null ? void 0 : lot.status_text,
    lot == null ? void 0 : lot.statusText,
    lot == null ? void 0 : lot.StatusText
  ].filter(Boolean);
  const statusStr = statusFields.map((val) => String(val).toLowerCase()).join(" ");
  const isSoldFlag = (lot == null ? void 0 : lot.isSold) === true || (lot == null ? void 0 : lot.is_sold) === true || statusStr.includes("sold");
  if (isSoldFlag || statusStr.includes("hết") || statusStr.includes("het") || statusStr.includes("out")) {
    return "sold";
  }
  return "available";
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
const productService = {
  /**
   * Lấy giá theo lô của sản phẩm
   * @param {string} itemCode
   * @returns {Promise<Array>}
   */
  async getLotPrices(itemCode) {
    var _a;
    if (!itemCode) return [];
    try {
      const headers = priceApiToken ? { Authorization: priceApiToken } : {};
      const response = await axios.get(`${apiBaseUrl}/Products/PricesByCode`, {
        params: { itemNo: itemCode },
        headers
      });
      const rawLots = Array.isArray((_a = response.data) == null ? void 0 : _a.data) ? response.data.data : Array.isArray(response.data) ? response.data : [];
      return mapLotPrices(rawLots);
    } catch (error) {
      console.warn("Error fetching lot prices:", error);
      return [];
    }
  },
  /**
   * Lấy thông tin chi tiết sản phẩm
   * @param {string} productId - ID của sản phẩm
   * @returns {Promise} Promise chứa thông tin sản phẩm
   */
  async getProductDetail(productId) {
    var _a;
    try {
      const response = await axios.get(`${apiBaseUrl}/Products/Search`, {
        params: {
          keyword: productId,
          pageIndex: 1,
          pageSize: 1
        }
      });
      const item = Array.isArray((_a = response.data) == null ? void 0 : _a.data) ? response.data.data[0] : null;
      if (!item) {
        throw new Error("Product not found");
      }
      const code = item.product_code || item.id || productId;
      let fallbackPrice = normalizePrice(item.unit_price);
      try {
        const priceRes = await axios.get(`${apiBaseUrl}/Products/PricesByCode`, {
          params: { itemNo: code }
        });
        console.log("PricesByCode response:", priceRes.data);
        const priceData = priceRes.data;
        let extracted = null;
        if (Array.isArray(priceData == null ? void 0 : priceData.data) && priceData.data.length) {
          const p = priceData.data[0];
          extracted = (p == null ? void 0 : p.price) ?? (p == null ? void 0 : p.Price) ?? (p == null ? void 0 : p.unit_price) ?? (p == null ? void 0 : p.UnitPrice) ?? null;
        } else if ((priceData == null ? void 0 : priceData.price) !== void 0) {
          extracted = priceData.price;
        } else if (typeof priceData === "number" || typeof priceData === "string") {
          extracted = priceData;
        }
        const normalizedExtracted = normalizePrice(extracted);
        if (normalizedExtracted !== null) {
          fallbackPrice = normalizedExtracted;
        }
      } catch (err) {
        console.warn("PricesByCode fetch failed, fallback to search price", err);
      }
      const apiBasePrice = normalizePrice(item.price_base ?? item.priceBase);
      const apiSalePrice = normalizePrice(item.price_sale ?? item.priceSale);
      let priceBaseValue = apiBasePrice ?? fallbackPrice ?? null;
      const priceSaleValue = apiSalePrice;
      const apiSaleFlag = item.is_sale === true || item.is_sale === "1" || item.is_sale === 1 || item.is_sale === "true";
      const hasSalePricing = apiSaleFlag || priceSaleValue !== null && priceBaseValue !== null && priceSaleValue < priceBaseValue;
      const displayPriceValue = hasSalePricing && priceSaleValue !== null ? priceSaleValue : priceBaseValue ?? priceSaleValue ?? fallbackPrice ?? 0;
      if (priceBaseValue === null) {
        priceBaseValue = displayPriceValue;
      }
      const currentPriceFormatted = formatCurrency(displayPriceValue);
      const originalPriceFormatted = hasSalePricing && priceBaseValue !== null ? formatCurrency(priceBaseValue) : "";
      const specs = buildSpecsFromDefinitions(item);
      let lotPrices = [];
      try {
        lotPrices = await this.getLotPrices(code);
      } catch (err) {
        console.warn("getLotPrices failed, continue without lot data", err);
      }
      return {
        id: code,
        No_: code,
        itemCode: code,
        productType: item.product_category || "product",
        name: item.product_name || code,
        price: currentPriceFormatted,
        originalPrice: originalPriceFormatted || currentPriceFormatted,
        priceBaseValue,
        priceSaleValue,
        displayPriceValue,
        isSale: Boolean(hasSalePricing && priceSaleValue !== null && priceBaseValue !== null && priceSaleValue !== priceBaseValue),
        discount: item.discount ? `${item.discount}%` : "",
        shortDescription: item.description || "",
        longDescription: item.description || item.custom_field51 || "",
        collectionName: item.custom_field121 || item.product_category || "Chưa phân loại",
        specifications: Object.keys(specs).length ? specs : {
          "Mã sản phẩm": code,
          "Danh mục": item.product_category || "Đang cập nhật",
          "Đơn vị": item.usage_unit || "Đang cập nhật",
          "Bề mặt": item.custom_field89 || "Đang cập nhật",
          "Màu sắc": item.custom_field90 || "Đang cập nhật",
          "Kích thước": item.custom_field104 || item.custom_field141 || "Đang cập nhật",
          "Thương hiệu": item.custom_field140 || "Đang cập nhật",
          "Xuất xứ": item.custom_field93 || "Đang cập nhật",
          "Bảo hành": item.warranty_period || "Liên hệ"
        },
        images: [],
        images_real: [],
        lotPrices,
        /// giảm định data comboItems
        comboItems: []
      };
    } catch (error) {
      console.error("Error fetching product detail:", error);
      throw error;
    }
  },
  /**
   * Lấy danh sách hình ảnh của sản phẩm
   * @param {string} productId - ID của sản phẩm
   * @param {string} imageType - Loại hình ảnh (product/perspective/real)
   * @returns {Promise} Promise chứa danh sách URL hình ảnh
   */
  async getProductImages(productId, imageType = "product", collectionName = "") {
    try {
      let candidates = [];
      switch (imageType) {
        case "product":
          candidates = buildNumberedUrls("hinh-gach", productId);
          break;
        case "perspective":
          candidates = buildNumberedUrls("hinh-phoi", productId, buildCollectionPrefix(collectionName));
          break;
        case "real":
          candidates = buildNumberedUrls("hinh-thuc-te", productId);
          break;
        default:
          candidates = [];
      }
      return await filterExistingImages(candidates);
    } catch (error) {
      console.error("Error fetching product images:", error);
      throw error;
    }
  }
};
export {
  productService as p
};
