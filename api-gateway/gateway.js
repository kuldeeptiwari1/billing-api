const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const apiProxy = httpProxy.createProxyServer();

app.use('/user-service', (req, res) => {
  apiProxy.web(req, res, { target: 'http://localhost:3001' });
});

app.use('/batch-service', (req, res) => {
  apiProxy.web(req, res, { target: 'http://localhost:3002' });
});

app.use('/book-service', (req, res) => {
  apiProxy.web(req, res, { target: 'http://localhost:3003' });
});

app.listen(8000, () => {
  console.log('API Gateway running on port 8000');
});
