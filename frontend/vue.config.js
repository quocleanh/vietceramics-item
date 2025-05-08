module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vietceramics-item/frontend/' // Tên repository của bạn
    : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
} 