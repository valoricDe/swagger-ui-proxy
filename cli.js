#!/usr/bin/env node

const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const corsAnywhere = require('cors-anywhere')

const swaggerDocument = YAML.load(process.argv[2]);
const PORT = process.env.PORT || 3001;
const origin = `http://localhost:${PORT}`

let proxy = corsAnywhere.createServer({
  originWhitelist: [origin], // Allow all origins
  requireHeaders: [], // Do not require any headers.
  removeHeaders: [] // Do not remove any headers.
});

/* Attach our cors proxy to the existing API on the /proxy endpoint. */
app.get('/proxy/:proxyUrl*', (req, res) => {
  req.url = req.url.replace('/proxy/', '/'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
  proxy.emit('request', req, res);
});

app.use(swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)

  if(process.argv.indexOf('--open')) {
    const { exec } = require("child_process");
    exec(`open ${origin}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
});
