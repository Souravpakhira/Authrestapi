const router = require('express').Router();
const { verifyAccessToken } = require('../helpers/jwt_helper');
const { rateLimiter } = require('../helpers/redis_rateLimiter');
const AuthController = require('../Controllers/auth.controller');

router.get('/check', verifyAccessToken, rateLimiter, async (req, res, next) => {
  const reqLeft = 10 - req.reply;
  console.log(reqLeft);
  res.json({
    message: 'Ok api is working 🚀',
    numberOfRequestLeft: reqLeft,
    coolDown: req.ttl,
  });
});

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/logout', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/refresh-token', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

module.exports = router;
