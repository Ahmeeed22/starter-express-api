const Joi = require("joi");

module.exports = {
    addCompanySchema:{
        body:Joi.object().required().keys({
            name : Joi.string().min(3).required()
        })
    },
    updateCompanySchema:{
        body:Joi.object().required().keys({
            name : Joi.string().min(3).required()
        })
    }
}