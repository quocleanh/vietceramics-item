module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vietceramics-item/' // Thêm dấu / ở cuối
    : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
} 