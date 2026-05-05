const http = require('http');
const httpProxy = require('http-proxy');

// إعداد البروكسي وتوجيهه لسيرفرك الأساسي
const proxy = httpProxy.createProxyServer({
    target: 'https://wathfor.alwaysdata.net',
    changeOrigin: true,
    ws: true, // تفعيل الـ WebSocket للـ V2Ray
    secure: false // حتى ما يرفض الاتصال بسبب شهادات الحماية
});

const server = http.createServer(function(req, res) {
    proxy.web(req, res);
});

// ترقية الاتصال للـ WebSocket
server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

// تشغيل السيرفر
server.listen(process.env.PORT || 10000, () => {
    console.log("Proxy is running...");
});
