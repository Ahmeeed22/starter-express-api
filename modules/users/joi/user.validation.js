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
            name : Joi.string().min(3).messages({
                "string.empty":"sorry ...name is required"
            }),
            email : Joi.string().email().messages({
                "string.email":"sorry ...please enter valid email"
            }),
            password :Joi.string().min(6),
            role : Joi.number().default(1),
            company_id:Joi.number().required().min(0) , 
            permissions: Joi.array().items(Joi.string()).default(['Pages.Client.List']),
        
        }).min(1)
    }
}