const Joi = require("joi");

module.exports = {
    addUserSchema:{
        body:Joi.object().required().keys({
            name : Joi.string().min(3).required().messages({
                "string.empty":"sorry ...name is required"
            }),
            email : Joi.string().email().required().messages({
                "string.email":"sorry ...please enter valid email"
            }),
            password :Joi.string().min(6).required(),
            role_id : Joi.number().default(1),
            
            permissions: Joi.array().items(Joi.string()).default(['Pages.Client.List','Pages.Client.Edit','Pages.Statistics','Pages.Client.Add','Pages.ClientHistory.List','Pages.ClientHistory.Add','Pages.ClientHistory.Edit','Pages.Employee.List','Pages.Employee.Edit','Pages.Employee.Delete','Pages.Employee.Add','Pages.Car.Add','Pages.Car.Edit','Pages.Car.List','Pages.Car.Delete']),
        })
    },
    loginSchema : {
        body:Joi.object().required().keys({
            email : Joi.string().email().required(),
            password :Joi.string().required()
        })
    },
    updateUserSchema:{
        params: Joi.object().required().keys({
            id : Joi.number().required()
        }),
        body:Joi.object().required().keys({
            name: Joi.string().min(3).messages({
                "string.empty": "Sorry, name is required"
            }),
            identity: Joi.string().pattern(new RegExp('^\\d{10}$')).messages({
                "string.pattern.base": "Sorry, identity must be 10 digits"
            }),
            phoneNumber: Joi.string().pattern(new RegExp('^\\d{9,}$')).messages({
                "string.pattern.base": "Sorry, phone number must be at least 9 digits"
            }).messages({
            "object.base": "Sorry, phone number must be an correct"
            }) ,
            countryCode: Joi.string().pattern(new RegExp('^\\+\\d{1,3}$')).messages({
                "string.pattern.base": "Sorry, country code must be in the format +xxx"
            }),
            birthDate: Joi.date().iso().messages({
                "date.base": "Sorry, birth date must be in a valid ISO format"
            })
        }).min(1)
    }
}