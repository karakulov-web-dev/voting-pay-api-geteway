const express = require("express");
const proxy = require("http-proxy-middleware");
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = express();

//app.use("/nodejsapp/it-works", (req, res) => {
//  res.send("it works!");
//});

app.use(
  "/mail",
  proxy({
    target: "http://localhost:8002/",
    changeOrigin: true,
    pathRewrite: path => path.replace(/^\/mail/, "")
  })
);

app.use(
  "/auth",
  proxy({
    target: "http://localhost:8001/",
    changeOrigin: true,
    pathRewrite: path => path.replace(/^\/auth/, "")
  })
);

app.use(
  "/",
  proxy({
    target: "http://localhost:8081/",
    changeOrigin: true
  })
);

const httpServer = http.createServer(app);
httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

let prodaction = false;

if (prodaction) {
  let privateKey, certificate, ca;
  privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/votingpay.com-0001/privkey.pem",
    "utf8"
  );
  certificate = fs.readFileSync(
    "/etc/letsencrypt/live/votingpay.com-0001/cert.pem",
    "utf8"
  );
  ca = fs.readFileSync(
    "/etc/letsencrypt/live/votingpay.com-0001/chain.pem",
    "utf8"
  );
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });
}
