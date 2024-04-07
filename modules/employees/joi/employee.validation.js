const Joi = require("joi");

module.exports = {
    addEmpSchema:{
            body: Joi.object().required().keys({
                name: Joi.string().min(3).required().messages({
                    "string.empty": "Sorry, name is required"
                }),
                identity: Joi.string().pattern(new RegExp('^\\d{10}$')).required().messages({
                    "string.pattern.base": "Sorry, identity must be 10 digits"
                }),
                iqamaImage: Joi.string().required().optional(),
                healthCertificate: Joi.string().required().messages({
                    "string.empty": "Sorry, Health Certificate is required"
                }),
                expiryDate: Joi.date().iso().required().messages({
                    "string.empty": "Sorry, Expiry Date is required"
                }), 
                clientHistory_id:Joi.number().min(0).required().messages({
                    "string.empty": "Sorry, clientHistory_id is required"
                }) ,
            })
    },
    loginSchema : {
        body:Joi.object().required().keys({
            email : Joi.string().email().required(),
            password :Joi.string().required()
        })
    },
    updateEmpSchema:{
        params: Joi.object().required().keys({
            id : Joi.number().required()
        }),
        body: Joi.object().required().keys({
            name: Joi.string().min(3).required().messages({
                "string.empty": "Sorry, name is required"
            }),
            identity: Joi.string().pattern(new RegExp('^\\d{10}$')).required().messages({
                "string.pattern.base": "Sorry, identity must be 10 digits"
            }),
            iqamaImage: Joi.string().required().optional(),
            healthCertificate: Joi.string().required().messages({
                "string.empty": "Sorry, Health Certificate is required"
            }),
            expiryDate: Joi.date().iso().required().messages({
                "string.empty": "Sorry, Expiry Date is required"
            }), 
            clientHistory_id:Joi.number().min(0).required().messages({
                "string.empty": "Sorry, clientHistory_id is required"
            }) ,
        }).min(1)
    }
}