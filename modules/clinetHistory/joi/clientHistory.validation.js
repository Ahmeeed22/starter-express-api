const Joi = require("joi");

module.exports = {
     addClientHistorySchema:{
            body: Joi.object().required().keys({
                name: Joi.string().min(3).required().messages({
                    "string.empty": "Name is required"
                }),
                number: Joi.string().required().unique().messages({
                    "string.empty": "Number is required" ,
                    "any.unique": "Number already exists"
                }),
                expireDate: Joi.date().iso().required().messages({
                    "date.iso": "Expire date must be in ISO date format"
                }),
                licenseNumber: Joi.string().allow(null),
                licenseDate: Joi.date().allow(null),
                certificateNumber: Joi.string().allow(null),
                certificateDate: Joi.date().allow(null),
                medicalInsuranceNumber: Joi.string().allow(null),
                medicalInsuranceDate: Joi.date().allow(null),
                businessLicenseNumber: Joi.string().allow(null),
                businessLicense: Joi.string().allow(null),
                registrationFile: Joi.string().allow(null),
                licenseFile: Joi.string().allow(null),
                certificateFile: Joi.string().allow(null)
            })
        },
    updateClientHistorySchema:{
        params: Joi.object().required().keys({
            id : Joi.number().required()
        }),
        body: Joi.object().required().keys({
            name: Joi.string().min(3).required().messages({
                "string.empty": "Name is required"
            }),
            number: Joi.string().required().messages({
                "string.empty": "Number is required"
            }),
            expireDate: Joi.date().iso().required().messages({
                "date.iso": "Expire date must be in ISO date format"
            }),
            licenseNumber: Joi.string().allow(null),
            licenseDate: Joi.date().allow(null),
            certificateNumber: Joi.string().allow(null),
            certificateDate: Joi.date().allow(null),
            medicalInsuranceNumber: Joi.string().allow(null),
            medicalInsuranceDate: Joi.date().allow(null),
            businessLicenseNumber: Joi.string().allow(null),
            businessLicense: Joi.string().allow(null),
            registrationFile: Joi.string().allow(null),
            licenseFile: Joi.string().allow(null),
            certificateFile: Joi.string().allow(null)
        }).min(1)
    }
}