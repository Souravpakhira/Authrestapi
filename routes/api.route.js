const router = require('express').Router();
const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken, signRefreshToken } = require('../helpers/jwt_helper');
const { verifyAccessToken } = require('../helpers/jwt_helper');

router.get('/', verifyAccessToken, async (req, res, next) => {
  console.log(req.payload);
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const duplicatEmail = await User.findOne({ email: result.email });
    if (duplicatEmail) {
      throw createError.Conflict(`${result.email} is already registered`);
    }

    const user = new User({ email: result.email, password: result.password });
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });

    if (!user) throw createError.NotFound('User not registered');

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createError.Unauthorized('Username or password is wrong');

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({
      message: 'Login',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest('Invalid email or password'));
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/refresh-token', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

module.exports = router;
