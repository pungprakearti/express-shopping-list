const express = require('express');
const app = express();
const itemRoutes = require('./routes/items');

app.use(express.json());

app.use('/items', itemRoutes);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  return next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  console.log(`Error found: ${err.message}`);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
