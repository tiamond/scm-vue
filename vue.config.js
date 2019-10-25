module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.254:9000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
