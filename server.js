const http = require('http');
const httpProxy = require('http-proxy');

// إعداد البروكسي
const proxy = httpProxy.createProxyServer({
    target: 'https://wathfor.alwaysdata.net',
    changeOrigin: true,
    ws: true, 
    secure: false 
});

const server = http.createServer(function(req, res) {
    // فحص الصحة (Health Check) حتى منصة Back4app تشوف السيرفر شغال
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
    }
    // توجيه باقي الطلبات (مثل اتصال V2Ray) للسيرفر الأساسي
    proxy.web(req, res);
});

// ترقية الاتصال للـ WebSocket
server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

// التشغيل على 0.0.0.0 حتى يقبل الاتصال الخارجي من المنصة
const port = process.env.PORT || 10000;
server.listen(port, '0.0.0.0', () => {
    console.log("Proxy is running on port " + port);
});
