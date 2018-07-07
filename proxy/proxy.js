const https = require('https');
const fs = require('fs');

const ocsServerKey = fs.readFileSync('./ssl/ocs-server-key.pem');
const ocsServerCert = fs.readFileSync('./ssl/ocs-server-cert.pem');
const certSettings = {
  key: ocsServerKey,
  cert: ocsServerCert,
  rejectUnauthorized: false,
  requestCert: false,
  ca: [ocsServerCert],
};

const PORT = 3000;
const PROTOCOL = 'https:';

https.createServer({ ...certSettings }, onRequest).listen(PORT, () => {
  console.log(`Proxy server is started on ${PROTOCOL}//localhost:${PORT}`);
});

function onRequest(clientReq, clientRes) {
  console.log('serve: ' + clientReq.url);

  const options = {
    ...certSettings,
    protocol: PROTOCOL, //default 'http:'
    hostname: 'ecsa00400b20.epam.com',
    port: 443, // default 80
    path: clientReq.url,
    method: clientReq.method,
  };

  const proxy = https.request(options, res => {


    res.pipe(clientRes, {
      end: true // default
    });
  });

  clientReq.pipe(proxy, {
    end: true // default
  });
}
