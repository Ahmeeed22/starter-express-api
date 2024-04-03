class AppError extends Error{
    constructor(message,statusCode,error='server error'){
        super(message) ;
        this.statusCode = statusCode ;
        this.stack =error
    }
}
module.exports = AppError ;