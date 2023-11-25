const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

module.exports = function(app) {
  // Read the target from tmp_tunnel_urls.json
  const tunnelUrls = JSON.parse(fs.readFileSync('tmp_tunnel_urls.json', 'utf-8'));
  const backendUrl = tunnelUrls.backend_url;

  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );
};