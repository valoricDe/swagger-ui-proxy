#!/usr/bin/env node

const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(process.argv[2]);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
