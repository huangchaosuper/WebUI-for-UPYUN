var http = require('http');

var proxy = http.createServer(function(request, response) {
    request.headers.host = 'v0.api.upyun.com';
    request.headers['Content-Length'] = request.headers.FileLength || 0;
    var options = {
        host: 'v0.api.upyun.com', // 这里是代理服务器       
        port: 80,             // 这里是代理服务器端口 
        path: request.url,       
        method: request.method,
        headers: request.headers
    };

    var req = http.request(options, function(res) {
        res.headers['access-control-allow-origin'] = '*';
        response.writeHead(res.statusCode, res.headers);
        res.pipe(response);    // 这个pipe很喜欢
        
    }).end();

}).listen(10080);