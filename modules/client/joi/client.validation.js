const Joi = require("joi");

module.exports = {
    addClientSchema:{
            body: Joi.object().required().keys({
                name: Joi.string().min(3).required().messages({
                    "string.empty": "Sorry, name is required"
                }),
                email: Joi.string().email().required().messages({
                    "string.email": "Sorry, please enter a valid email"
                }),
                role: Joi.number().default(1),
                identity: Joi.string().pattern(new RegExp('^\\d{10}$')).required().messages({
                    "string.pattern.base": "Sorry, identity must be 10 digits"
                }),
                phoneNumber: Joi.string().pattern(new RegExp('^\\d{9,}$')).required().messages({
                    "string.pattern.base": "Sorry, phone number must be at least 9 digits"
                }).messages({
                "object.base": "Sorry, phone number must be an correct"
                }) ,
                countryCode: Joi.string().pattern(new RegExp('^\\+\\d{1,3}$')).required().messages({
                    "string.pattern.base": "Sorry, country code must be in the format +xxx"
                }),
                birthDate: Joi.date().iso().required().messages({
                    "date.base": "Sorry, birth date must be in a valid ISO format"
                }), 
                company_id:Joi.number().min(0) ,
                active:Joi.boolean() ,
            })
    },
    loginSchema : {
        body:Joi.object().required().keys({
            email : Joi.string().email().required(),
            password :Joi.string().required()
        })
    },
    updateClientSchema:{
        params: Joi.object().required().keys({
            id : Joi.number().required()
        }),
        body: Joi.object().required().keys({
            name: Joi.string().min(3).messages({
                "string.empty": "Sorry, name is required"
            }),
            email: Joi.string().email().messages({
                "string.email": "Sorry, please enter a valid email"
            }),
            role: Joi.number().default(1),
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
            }),
            active:Joi.boolean() 
        }).min(1)
    }
}