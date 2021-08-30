const Joi = require('joi');

//createOne data model
exports.createOne = Joi.object({
  name: Joi.string()
    .max(100)
    .required(),
  inventory: Joi.number()
    .integer()
    .default(0)
    .positive()
    .max(4294967295),
  price: Joi.number()
    .required()
    .positive()
    .max(4294967295),
  description: Joi.string()
    .max(255)
    .default(null),
  gender: Joi.string()
    .valid('Masculino', 'Feminino', 'Unissex')
    .required(),
  age: Joi.string()
    .valid('Adulto', 'Infantil')
    .required(),
  lens: Joi.string()
    .valid('Sol', 'Grau', 'Outro')
    .required(),
  lens_format: Joi.number()
    .integer()
    .positive()
    .max(4294967295)
    .required(),
  color: Joi.number()
    .integer()
    .positive()
    .max(4294967295)
    .required(),
  brand: Joi.number()
    .integer()
    .positive()
    .max(4294967295)
    .required()
}).options({
  abortEarly: true,
  stripUnknown: true,
})

//getMany data model
exports.getMany = Joi.object({
  orderBy: Joi.string()
    .valid('product', 'price', 'discount', 'popularity', 'p.id')
    .default('popularity'),
  order: Joi.string()
    .valid('asc','desc')
    .default('desc'),
  query: Joi.string()
    .default(''),
  page: Joi.number()
    .positive()
    .integer()
    .invalid(0)
    .default(1),
  filters: Joi.array()
    .items(Joi.string().pattern(/^[^;;;]+;;;[^;;;]+$/))


}).options({
  abortEarly: true,
  stripUnknown: true,
})


//getOne data model
exports.getOne = Joi.object({
  id: Joi.number()
  .integer()
  .positive()
  .max(4294967295)
  .required()
}).options({
  abortEarly: true,
  stripUnknown: true,
})