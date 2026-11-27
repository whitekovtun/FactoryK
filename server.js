const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const files = { '/': 'index.html', '/admin': 'index.html', '/admin/': 'index.html', '/styles.css': 'styles.css', '/app.js': 'app.js' };
http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = files[pathname];
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html';
  fs.readFile(path.join(root, file), (err, data) => {
    if (err) { res.writeHead(500); return res.end('Server error'); }
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(process.env.PORT || 3000, () => console.log(`Content Factory: http://localhost:${process.env.PORT || 3000}/admin`));
