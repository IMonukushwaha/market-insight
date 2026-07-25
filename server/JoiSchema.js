const Joi = require('joi');

module.exports.userJoiSchema = Joi.object({
    email : Joi.string()
    .lowercase()
    .trim()
    .required(),

    username : Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .trim()
    .required(),

    password: Joi.string()
    .min(6)
    .required()
});

module.exports.userloginJoiSchema = Joi.object({
    username : Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .trim()
    .required(),

    password: Joi.string()
    .min(6)
    .required()
});


