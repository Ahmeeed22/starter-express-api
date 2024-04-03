const Joi = require("joi");

module.exports = {
    addClientHistorySchema:{
        body:Joi.object().required().keys({
            name : Joi.string().min(3).required().messages({
                "string.empty":"sorry ...name is required"
            }),
            number : Joi.string(),
            expireDate: Joi.date().iso().required(),
            client_id : Joi.number().min() ,
        })
    },
    updateClientHistorySchema:{
        params: Joi.object().required().keys({
            id : Joi.number().required()
        }),
        body:Joi.object().required().keys({
            name : Joi.string().min(3).required().messages({
                "string.empty":"sorry ...name is required"
            }),
            number : Joi.string(),
            expireDate: Joi.date().iso().required(),
            client_id : Joi.number().min() ,
        }).min(1)
    }
}