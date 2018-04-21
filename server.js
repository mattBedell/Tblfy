const express = require('express');
const http = require('http');

const app = express();

app.use(express.static('dist'));

app.get('/proxyimage', (req, res, next) => {
  const { url } = req.query;
  if (!url) {
    res.sendStatus(400);
  };

  const preq = http.request(url, client => {

    client.on('data', chunk => {
      res.write(chunk);
    });

    client.on('close', () => {
      res.writeHead(client.statusCode);
      res.end();
    });

    client.on('end', () => {
      res.writeHead(client.statusCode);
      res.end();
    });

  }).on('error', e => {
    res.writeHead(500);
    res.end();
  });
});

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.listen(3001, () => console.log('Listening on port 3001'));