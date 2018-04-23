const express = require('express');
const http = require('http');

const app = express();

app.use(express.static('dist'));
app.use(express.static('public'));

app.get('/proxyimage', (req, res, next) => {
  const { url } = req.query;
  if (!url) {
    res.sendStatus(400);
  };

  const preq = http.request(`http://${url}`, request => {
    request.on('data', chunk => {
      res.write(chunk);
    });

    request.on('close', () => {
      console.log('CLOSED')
    });

    request.on('end', () => {
      res.end();
    });

  }).on('error', e => {
    console.log(e);
    res.end();
  });

  preq.end();
});

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.listen(3001, () => console.log('Listening on port 3001'));