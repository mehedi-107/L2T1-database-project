const cors = require('cors');
const express = require('express');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

const corsOptions =
  env.corsOrigin === '*'
    ? {}
    : {
        origin: env.corsOrigin.split(',').map((origin) => origin.trim()),
        credentials: true,
      };

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
