const express = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
const { registerUser } = require('../controllers/userController')

const router = express.Router()

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string()
        .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
        .message(
          'Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long'
        )
        .required(),
      full_name: Joi.string().required(),
      dob: Joi.date().required(),
      address: Joi.string().required(),
      country: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    }),
  }),
  registerUser
)

module.exports = router
