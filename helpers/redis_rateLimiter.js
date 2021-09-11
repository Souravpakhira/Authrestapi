const redisClient = require('../helpers/init_redis');
const createError = require('http-errors');

module.exports = {
  rateLimiter: async (req, res, next) => {
    console.log('Redis rate likinter');
    console.log(req.payload.aud);
    redisClient.INCRBY(req.payload.aud, 1, (err, reply) => {
      if (err) {
        console.log(err);
        return next(createError.InternalServerError());
      }
      if (reply > 10) {
        return next(createError.BandwidthLimitExceeded());
      }
      if (reply === 1) {
        redisClient.EXPIRE(req.payload.aud, 60);
      }
      redisClient.TTL(req.payload.aud, (err, cd) => {
        req.ttl = cd;
        req.reply = reply;
        next();
      });
    });
  },
};
