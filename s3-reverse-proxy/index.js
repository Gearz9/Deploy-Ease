const express = require("express");
const httpProxy = require("http-proxy");

const app = express();

const PORT = 8000;
const BASE_PATH =
  "https://deploy-ease-outputs.s3.ap-south-1.amazonaws.com/__outputs";

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostName = req.hostname;

  const subdomain = hostName.split(".")[0];

  const resolveTo = `${BASE_PATH}/${subdomain}`;

  proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") {
    proxyReq.path += "index.html";
  }
  return proxyReq;
});

app.listen(PORT, () => {
  console.log(`Reverse Proxy  Running... ${PORT}`);
});
