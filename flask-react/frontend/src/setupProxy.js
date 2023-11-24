const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/videos-in-dataset',
    createProxyMiddleware({
      target: 'http://localhost:5000/videos-in-dataset',
      changeOrigin: true,
    })
  );
};