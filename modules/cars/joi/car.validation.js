const Joi = require("joi");

module.exports = {
    addCarSchema:{
        body: Joi.object().required().keys({
            workPermitCard: Joi.string().required().messages({
                "string.empty": "Sorry, work permit card is required"
            }),
            expiryDate: Joi.date().iso().required().messages({
                "string.empty": "Sorry, expiry date is required"
            }), 
            insuranceExpiryDate: Joi.date().iso().required().messages({
                "string.empty": "Sorry, insurance expiry date is required"
            }), 
            formImage: Joi.string().required().messages({
                "string.empty": "Sorry, form image is required"
            }), 
            clientHistory_id:Joi.number().min(0).required().messages({
                    "string.empty": "Sorry, clientHistory_id is required"
                }) ,
            active:Joi.boolean() 
        })
},
updateCarSchema:{
    params: Joi.object().required().keys({
        id : Joi.number().required()
    }),
    body: Joi.object().required().keys({
        workPermitCard: Joi.string().messages({
            "string.empty": "Sorry, work permit card is required"
        }),
        expiryDate: Joi.date().iso().messages({
            "string.empty": "Sorry, expiry date is required"
        }), 
        insuranceExpiryDate: Joi.date().iso().messages({
            "string.empty": "Sorry, insurance expiry date is required"
        }), 
        formImage: Joi.string().messages({
            "string.empty": "Sorry, form image is required"
        }), 
        clientHistory_id:Joi.number().min(0).messages({
            "string.empty": "Sorry, clientHistory_id is required"
        })
    }).min(1)
}
}