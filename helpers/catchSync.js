module.exports.catchAsyncError=(fun)=>{
    return (req,res,next)=>{
        fun(req,res,next).catch(err=>{
            console.log("##################################", err);
            next(err)
            // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : 'server error' , err,stack:err.stack})
        })
    }
}