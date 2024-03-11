const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, editUserInfo } = require('../controllers/users');
const { emailRegex } = require('../utils/constants');

router.get('/me', getUserInfo);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email().pattern(emailRegex),
    }),
  }),
  editUserInfo,
);

module.exports = router;
