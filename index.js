const http = require('http');

const server = http.createServer((req, res) => {
  res.write('hello world');
  res.end();
});

server.listen(8888, () => console.log('listen 8888'));
