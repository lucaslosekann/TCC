const Joi = require('joi');

//getById data model
exports.getById = Joi.object({
  id: Joi.number()
  .integer()
  .positive()
  .max(4294967295)
  .required()
}).options({
  abortEarly:true,
  stripUnknown: true
})