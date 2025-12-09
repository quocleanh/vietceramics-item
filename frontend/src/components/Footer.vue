<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Company Info -->
      <div class="footer-section company-info">
        <div class="logo-wrapper">
          <img src="@/assets/images/logo-footer.png" alt="Vet Ceramics Logo" class="footer-logo">
        </div>
        <p class="company-description">
          Công Ty Cổ phần Quốc Tế Gốm Sứ Việt. GPĐKKD: 0311028311 do sở KH & ĐT TP.HCM cấp ngày 30/07/2011. Đăng ký thay đổi lần thứ 12 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh ngày 17/09/2014.
        </p>
        <div class="contact-info">
          <div class="contact-item">
            <i class="fi fi-br-map-marker"></i>
            <span>778K/2 Nguyễn Kiệm, Phường Đức Nhuận, TP.HCM, TP. HCM</span>
          </div>
          <div class="contact-item">
            <i class="fi fi-br-phone-call"></i>
            <span>+0797555299</span>
          </div>
          <div class="contact-item">
            <i class="fi fi-br-envelope"></i>
            <span>vietceramics@vietceramics.com.vn</span>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section quick-links">
        <h3 class="section-title">Liên kết nhanh</h3>
        <ul class="link-list">
          <li><router-link to="/"><i class="fi fi-br-home"></i> Trang chủ</router-link></li>
          <li><router-link to="/products"><i class="fi fi-br-box"></i> Sản phẩm</router-link></li>
          <li><router-link to="/about"><i class="fi fi-br-info"></i> Giới thiệu</router-link></li>
          <li><router-link to="/contact"><i class="fi fi-br-address-book"></i> Liên hệ</router-link></li>
          <li><router-link to="/quote-list"><i class="fi fi-br-file-invoice"></i> Báo giá</router-link></li>
        </ul>
      </div>

      <!-- Product Categories -->
      <div class="footer-section product-categories">
        <h3 class="section-title">Danh mục sản phẩm</h3>
        <ul class="link-list">
          <li><router-link to="/products/bath"><i class="fi fi-br-bath"></i> Thiết bị vệ sinh</router-link></li>
          <li><router-link to="/products/tile"><i class="fi fi-br-cube"></i> Gạch ốp lát</router-link></li>
          <li><router-link to="/products/wood"><i class="fi fi-br-tree"></i> Gỗ công nghiệp</router-link></li>
          <li><router-link to="/products/accessories"><i class="fi fi-br-tools"></i> Phụ kiện</router-link></li>
        </ul>
      </div>

      <!-- Social Links -->
      <div class="footer-section social-links">
        <h3 class="section-title">Kết nối với chúng tôi</h3>
        <div class="social-icons">
          <a href="https://www.facebook.com/vietceramics" target="_blank" class="social-icon facebook">
            <i class="fi fi-brands-facebook"></i>
          </a>
          <a href="https://www.instagram.com/vietceramics.official" target="_blank" class="social-icon instagram">
            <i class="fi fi-brands-instagram"></i>
          </a>
          <a href="https://www.youtube.com/vietceramics" target="_blank" class="social-icon youtube">
            <i class="fi fi-brands-youtube"></i>
          </a>
          <a href="https://www.linkedin.com/company/vietceramics" target="_blank" class="social-icon linkedin">
            <i class="fi fi-brands-linkedin"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} Vet Ceramics. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: #1a1a1a;
  color: #fff;
  padding: 60px 0 0;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-section {
  margin-bottom: 40px;
}

.company-info {
  grid-column: span 2;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.footer-logo {
  max-width: 180px;
  height: auto;
}

.company-description {
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #fff;
  font-size: 0.9rem;
}

.contact-item i {
  color: #971b1e;
  font-size: 1.1rem;
  margin-top: 2px;
}

.section-title {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: #971b1e;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 12px;
}

.link-list a {
  color: #aaa;
  text-decoration: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.link-list a i {
  font-size: 1rem;
  color: #971b1e;
  transition: all 0.3s;
}

.link-list a:hover {
  color: #fff;
}

.link-list a:hover i {
  transform: translateX(3px);
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
  transition: all 0.3s;
  background: #2a2a2a;
}

.social-icon:hover {
  transform: translateY(-3px);
}

.social-icon.facebook:hover {
  background: #1877f2;
}

.social-icon.instagram:hover {
  background: #e4405f;
}

.social-icon.youtube:hover {
  background: #ff0000;
}

.social-icon.linkedin:hover {
  background: #0a66c2;
}

.footer-bottom {
  background: #111;
  padding: 20px 0;
  margin-top: 40px;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.copyright {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .company-info {
    grid-column: span 2;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .company-info {
    grid-column: span 1;
  }

  .social-icons {
    justify-content: center;
  }
}
</style> 