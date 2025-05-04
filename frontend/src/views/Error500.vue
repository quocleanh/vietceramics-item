<template>
  <div class="error-page">
    <div class="error-emoji">(╥﹏╥)</div>
    <div class="error-code">500</div>
    <div class="error-title">Lỗi hệ thống</div>
    <div class="error-desc">Ôi không! Đã xảy ra lỗi không mong muốn.<br>Vui lòng thử lại sau hoặc về trang chủ để tiếp tục khám phá nhé!</div>
    <router-link to="/" class="error-btn">Về trang chủ</router-link>
  </div>
</template>
<style scoped>
.error-page {
  min-height: 60vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  background: #fff6f8;
}
.error-emoji {
  font-size: 3.2rem;
  margin-bottom: 8px;
  color: #ff7fa1;
  animation: shake 1.2s infinite alternate;
}
@keyframes shake {
  0% { transform: rotate(-5deg); }
  100% { transform: rotate(5deg); }
}
.error-code { font-size: 4.5rem; font-weight: 900; color: #ff7fa1; letter-spacing: 2px; }
.error-title { font-size: 1.5rem; font-weight: 700; margin: 10px 0; color: #971b1e; }
.error-desc { color: #666; margin-bottom: 22px; font-size: 1.08rem; }
.error-btn { background: linear-gradient(90deg,#ff7fa1,#971b1e); color: #fff; padding: 10px 28px; border-radius: 24px; text-decoration: none; font-weight: 600; font-size: 1.08rem; box-shadow: 0 2px 8px #ff7fa133; transition: background 0.2s; }
.error-btn:hover { background: linear-gradient(90deg,#971b1e,#ff7fa1); }
</style> 