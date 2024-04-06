const User = require("../model/user.model");
const {Op}=require("sequelize");
const bcrypt = require('bcrypt')
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const AppError = require("../../../helpers/AppError");
const { catchAsyncError } = require("../../../helpers/catchSync");
const LoggerService = require("../../../services/logger.service");
const Client = require("../../client/model/client.model");
const logger=new LoggerService('user.controller')



// get all users
const getAllUsers=catchAsyncError(async(req,res,next)=>{
        const users=await  User.findAndCountAll({
            include:Client,
            attributes : {exclude : ['password']}
        });
        res.status(StatusCodes.OK).json({message:"succes",users})

}) 

// delete  user
const deleteUser=catchAsyncError(async(req,res,next)=>{
        let id=req.params.id
        var userX=await User.findOne({where:{id}})
        if (userX)
            next(new AppError('this id not exist ',400))
        await User.destroy({
            where :{
                id
            },
        })
        res.status(StatusCodes.OK).json({message:"success"})
})



// update user
const updateUser=catchAsyncError(async(req,res,next)=>{
        let id=req.params.id;
        await User.update(req.body,{where:{id}})
        res.status(StatusCodes.OK).json({success: true})
})

// get single user
const getCurrentLoginInformations=catchAsyncError(async(req,res,next)=>{
        let id=req.loginData.id;
        console.log(id); 
        let user=await User.findOne({where:{id}});
        res.status(StatusCodes.OK).json({success: true ,result : {...user?.dataValues , permissions : JSON.parse(user.permissions)},message : "Current User information got successfully"}); 
   
})

// search
const search=catchAsyncError(async(req,res,next)=>{
        let {searchKey}=req.query;
        if(searchKey){
          let users= await User.findAll({where:{name:{[Op.like]: `%${searchKey}%`,company_id:req.loginData.company_id}}});
            res.status(StatusCodes.OK).json({message:"success",users})
        }else{
           let users= await User.findAll({});
           res.status(StatusCodes.OK).json({message:"success",users})
        }

})
// add user
const addUser=catchAsyncError(async(req,res,next)=>{
    const {password} = req.body
    console.log("###############################################################",req.body);
        const user= await  User.findOne({where:{email:req.body.email}});
        if (user) {
            res.status(StatusCodes.BAD_REQUEST).json({message:"email is exit"})
        } else {
            bcrypt.hash(password,7, async (err,hash)=>{
                if(err) throw err
                var result= await User.create({...req.body, permissions: JSON.stringify(req.body.permissions) , password:hash})
                 res.status(StatusCodes.CREATED).json({message:"success",result})
            })
        }
})

// login
const login =catchAsyncError(async(req,res,next)=>{
    const {email , password} = req.body ;
        console.log(email);
        const user= await User.findOne({where:{email : email}})
        if (user) {
           const match= await bcrypt.compare(password ,user.password);
            
           if (match) {
            var token =jwt.sign({email,id:user.id,name:user.name , role:user.role , company_id:user.company_id},'jusuraltamayuz2332',{expiresIn:'8h'}) ;
            var decode=jwt.decode(token ,'jusuraltamayuz2332') ;
 
            res.status(StatusCodes.OK).json({success: true,token,data:{id:user.id ,name : user.name},message : "Logged in successfully"})

           } else {
            next(new AppError('password wrong',403))
           }

        } else {
            next(new AppError('email not found',400))
        }
})

module.exports={getAllUsers,deleteUser,addUser,updateUser,getCurrentLoginInformations,search , login}