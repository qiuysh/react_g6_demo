const path = require('path');
const apiMocker = require('mocker-api');
const { fixBabelImports, override, addLessLoader, addDecoratorsLegacy, addWebpackAlias, overrideDevServer } = require('customize-cra');  

module.exports = {

  webpack: override(

    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
  
  
    addLessLoader({
      javascriptEnabled: true,
    }),
  
    // 装饰器
    addDecoratorsLegacy(),
  
  
    addWebpackAlias({
      '@components': path.resolve('src/components'),
      '@pages': path.resolve('src/pages'),
      '@utils': path.resolve('src/utils'),
    }),
  
  ),

  devServer: overrideDevServer(
    (config) => {
      return {
        ...config,
        before: function (app) {
          apiMocker(app, path.resolve('./mock/index.js'), {
            proxy: {
              '/api/(.*)': 'http://127.0.0.1:3000',
            },
            changeHost: true,
          })
        },
        proxy: [
          {
            path: '/api/v1/**',
            target: 'http://127.0.0.1:3000',
            changeOrigin: true,
          }
        ]
      }
    }
  )
}
