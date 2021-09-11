const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken } = require('../helpers/jwt_helper');

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const duplicatEmail = await User.findOne({ email: result.email });
      if (duplicatEmail) {
        throw createError.Conflict(`${result.email} is already registered`);
      }

      const user = new User({ email: result.email, password: result.password });
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      res.send({ message: 'Successfully registered' });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });

      if (!user) throw createError.NotFound('User not registered');

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized('Username or password is wrong');

      const accessToken = await signAccessToken(user.id);

      User.findByIdAndUpdate(
        user.id,
        { accessToken: accessToken },
        (err, data) => {
          if (err) {
            createError.InternalServerError();
            console.log(err);
          }
          console.log(data);
        }
      );

      res.send({
        message: 'Login',
        accessToken,
      });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid email or password'));
      next(error);
    }
  },
};
