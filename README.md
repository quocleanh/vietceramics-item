# Vietceramics Item Website – E-commerce Product Showcase

Website giới thiệu sản phẩm thương mại điện tử, với giao diện hiện đại, hỗ trợ tìm kiếm, lọc và hiển thị thông tin sản phẩm chi tiết.

## 🔧 Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend   | Vue.js 3, BootstrapVue, JavaScript |
| Backend    | Golang (Gin Framework) |
| Database   | MongoDB |
| Đồng bộ    | Golang (sync từ MSSQL → MongoDB định kỳ) |
| SEO        | Có sitemap, meta tags, structured data (schema.org) |

---

## 🌐 Các trang chính

### 1. Trang chủ
- Ô tìm kiếm **autocomplete**: gợi ý mã hàng hoặc tên bộ sưu tập từ keyword.
- Click gợi ý → điều hướng đến trang chi tiết sản phẩm.

### 2. Trang chi tiết sản phẩm
- Hiển thị:
  - Tên, mã sản phẩm, mô tả ngắn.
  - **Slider ảnh**: ảnh sản phẩm, ảnh phối cảnh, ảnh thực tế.
  - **Thông tin kỹ thuật**: bảng key-value, hiển thị theo loại sản phẩm.
- Có tính năng zoom ảnh và tải ảnh.
- Ví dụ: `http://item.vietceramics.vn/vi/tim-kiem-san-pham/45925_521`

### 3. Trang danh mục sản phẩm (Catalog)
- Có **bộ lọc** theo:
  - Loại sản phẩm
  - Không gian sử dụng
  - Kích thước
  - Màu sắc
- Cho phép chọn nhiều tiêu chí lọc đồng thời.
- Kết quả có **phân trang**.
- Ví dụ: `http://item.vietceramics.vn/vi/loc-san-pham?space=TBVS`

---

## 📁 Cấu trúc thư mục (dự kiến)
item/
├── backend/               # Go backend (Gin)
│   ├── main.go
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── sync/              # MSSQL → MongoDB sync logic
├── frontend/              # Vue 3 frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   └── assets/
├── mongo/                 # MongoDB docker volume (nếu dùng)
├── mssql/                 # MSSQL docker config hoặc dump
├── docker-compose.yml
├── .env
└── README.md

---

## 🔄 Đồng bộ dữ liệu

- Sử dụng Golang script kết nối MSSQL → truy vấn toàn bộ bảng sản phẩm → lưu về MongoDB.
- Lên lịch đồng bộ định kỳ (cronjob hoặc scheduler).
- MSSQL driver: `github.com/denisenkom/go-mssqldb`

---

## 🔍 Autocomplete

- Trường gợi ý: `itemCode`, `CollectionName`
- Endpoint `/api/suggest?q=...` (backend trả JSON)
- Frontend dùng debounce và hiển thị gợi ý dạng dropdown.

---

## 🖼 Ảnh sản phẩm

- Ảnh theo định dạng URL: http://toppstiles.com.vn//products-test/hinh-gach/{ma-ap} {stt}.jpg

- Ví dụ: `46438 1.jpg`, `46438 2.jpg`, `46438 3.jpg`...

---

## 📦 SEO & Cấu trúc

- Mỗi trang có:
- Meta title, description
- Canonical URL
- Structured data (schema.org)
- Có sitemap.xml tự sinh từ danh sách sản phẩm

---

## 🚧 Ghi chú phát triển

- Không cần trang quản trị (admin).
- Không cần đa ngôn ngữ.
- Ưu tiên đơn giản, dễ mở rộng.
- Sử dụng mã nguồn mở miễn phí, dễ bảo trì.

---

## 🧪 TODO (dành cho AI IDE Agent hoặc dev mới)

- [ ] Khởi tạo project Golang (Gin)
- [ ] Tạo mô hình sản phẩm trong MongoDB
- [ ] Viết logic sync dữ liệu từ MSSQL
- [ ] Tạo các API chính: search, detail, filter
- [ ] Khởi tạo Vue 3 project, tạo layout
- [ ] Tạo trang tìm kiếm, chi tiết, catalog
- [ ] Tối ưu SEO và structured data

