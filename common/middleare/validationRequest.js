const { StatusCodes } = require("http-status-codes");
const { getReasonPhrase } = require("http-status-codes/build/cjs/utils-functions");


module.exports = (schema)=>{
    return (req,res,next)=>{
        var validation = [];
        const validateRequest=schema.body.validate(req.body);
        if (validateRequest.error) {
            validation.push(validateRequest.error.details[0].message)
        }
        if (validation.length) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message : validation.join(),
                // to send state code to user as message
                error : getReasonPhrase(StatusCodes.BAD_REQUEST)
            })
            return ;
        }else{
            next()
        }
    }
} 