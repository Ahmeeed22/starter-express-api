const Company = require("../model/company.model");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../../../helpers/AppError");
const { catchAsyncError } = require("../../../helpers/catchSync");

const getAllcompanys=catchAsyncError(async(req,res,next)=>{
    // try {
        var companys=await Company.findAndCountAll()
        res.status(StatusCodes.OK).json({message:"success",result:companys})
        
    // } catch (error) {
    //    next( new AppError('server Error',500,error))
    //     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : 'error' , error})
    // }
})

const addcompany=catchAsyncError(async (req,res,next)=>{
    // try {
        var x=await Company.findOne({where:{name:req.body.name}})
        if (x)
            next(new AppError('this name exist',400) )

        var company = await Company.create(req.body);
        res.status(StatusCodes.CREATED).json({message:"success",result:company})
    // } catch (error) {
    //    next( new AppError('server Error',500))
    //     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : 'error' , error})
    // }
})

const updatecompany=catchAsyncError( async (req,res,next)=>{
    // try {
        const id =req.params.id
        var x=await Company.findOne({where:{id}})
        if (x)
            next(new AppError('this id not exist',400) )

        var company =await Company.update(req.body,{where:{id}})
        res.status(StatusCodes.OK).json({message:"success",result:company})
    // } catch (error) {
    //    next( new AppError('server Error',500))
    //     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : 'error' , error})
    // }
    
})

const deletecompany= catchAsyncError(async (req,res,next)=>{
//    try {
        const id=req.params.id ;
        if (x)
        next(new AppError('this id not exist',400) )

        var company =await Company.destroy({
            where :{
                id
            },
        })
        res.status(StatusCodes.OK).json({message:"success",result:company})
//    } catch (error) {
//     next( new AppError('server Error',500))   
//     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : 'error' , error})
//    }
})

// search
const searchcompanys=catchAsyncError(async(req,res,next)=>{
    // try {
            let {searchKey}=req.query;
            if(searchKey){
            let companys= await Company.findAll({where:{name:{[Op.like]: `%${searchKey}%`}}});
                res.status(StatusCodes.OK).json({message:"success",companys})
            }else{
            let companys= await Customer.findAll({});
            res.status(StatusCodes.OK).json({message:"success",companys})
            }
    // } catch (error) {
    //     next( new AppError('server Error',500))   
    //     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : 'error' , error})
    // }
})



module.exports={getAllcompanys , addcompany , deletecompany ,searchcompanys , updatecompany}