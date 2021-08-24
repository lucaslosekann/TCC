const Joi = require('joi');


exports.signup = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .max(45)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,100}$/)
    .required(),
  firstName: Joi.string()
    .max(20)
    .required(),
  lastName: Joi.string()
    .max(50)
    .required(),
  phoneNumber: Joi.string()
    .max(20)
    .pattern(/^\(\d{2,}\) 9\d{4}\-\d{4}$/)
    .required(),
  gender: Joi.string()
    .valid('Masculino', 'Feminino', 'Outro')
    .required(),
  address: Joi.object({
    street: Joi.string()
      .max(255)
      .required(),
    postalCode: Joi.string()
      .max(11)
      .pattern(/^\d{5}-\d{3}$/)
      .required(),
    city: Joi.string()
      .max(255)
      .required(),
    uf: Joi.string()
      .max(255)
      .required(),
    country: Joi.string()
      .max(255)
      .required(),
    number: Joi.string()
      .max(6)
  })

}).options({
  abortEarly: true,
  stripUnknown: true,
})