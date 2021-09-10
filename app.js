const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
require('./helpers/init_mongodb');
const redisClient = require('./helpers/init_redis');

// redisClient.SET('for', 'bar');

redisClient.GET('for', (err, value) => {
  if (err) console.log(err);
  console.log(value);
});
const AuthRoute = require('./routes/api.route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api', require('./routes/api.route'));

app.use('/auth', AuthRoute);

app.use((req, res, next) => {
  next(createError.NotFound());
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
