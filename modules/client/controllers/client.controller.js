const Client = require("../model/client.model");
const {Op}=require("sequelize");
const bcrypt = require('bcrypt')
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const AppError = require("../../../helpers/AppError");
const { catchAsyncError } = require("../../../helpers/catchSync");
const LoggerService = require("../../../services/logger.service");
const ClientHistory = require("../../clinetHistory/model/clientHistory.model");

const logger=new LoggerService('user.controller')

// get all clients
const getAllClients=catchAsyncError(async(req,res,next)=>{
    console.log("Sssssssssssssssssssssssssssssssssssssss",req.loginData.id);
        const clients=await  Client.findAndCountAll({
            where:{admin_id:req.loginData.id} ,
            include :  [{ model: ClientHistory , } ]
        });
        res.status(StatusCodes.OK).json({message:"succes",clients})
}) 


// update client
const updateClient=catchAsyncError(async(req,res,next)=>{

        let id=req.params.id;
        await Client.update(req.body,{where:{id}})
        res.status(StatusCodes.OK).json({message:"success"})

})

// get single client
const getSingleClient=catchAsyncError(async(req,res,next)=>{
        let id=req.params.id;
        let client=await Client.findOne({
                                            where:{id} ,
                                            include :  [{ model: ClientHistory , } ]
                                        } , );
        res.status(StatusCodes.OK).json({message:"success",client});
   
})
// search
const search=catchAsyncError(async(req,res,next)=>{
        let {searchKey}=req.query;
        if(searchKey){
          let clients= await Client.findAll({
            where:{name:{[Op.like]: `%${searchKey}%` , admin_id:req.loginData.admin_id} ,
            include :  [{ model: ClientHistory , } ]
        }});
            res.status(StatusCodes.OK).json({message:"success",clients})
        }else{
           let clients= await Client.findAll( {
                                                where :{admin_id:req.loginData.admin_id},
                                                include :  [{ model: ClientHistory , } ]
                                            });
           res.status(StatusCodes.OK).json({message:"success",clients})
        }

})
// add client
const addClient=catchAsyncError(async(req,res,next)=>{
    const password = req.body.name + 137
        const client= await  Client.findOne({where:{email:req.body.email}});
        if (client) {
            res.status(StatusCodes.BAD_REQUEST).json({message:"email is exit"})
        } else {
            bcrypt.hash(password,7, async (err,hash)=>{
                if(err) throw err
                var result= await Client.create({...req.body,phoneNumber:JSON.stringify(req.body.phoneNumber) , password:hash})
                 res.status(StatusCodes.CREATED).json({message:"success",result})
            })
        }
})
// login
const login =catchAsyncError(async(req,res,next)=>{
    const {email , password} = req.body ;
        const user= await Client.findOne({where:{email : email}})
        if (user) {
           const match= await bcrypt.compare(password ,user.password);
           
           if (match) {
            var token =jwt.sign({email,id:user.id,name:user.name , role:user.role },'jusuraltamayuz2332',{expiresIn:'8h'}) ;
            var decode=jwt.decode(token ,'jusuraltamayuz2332')
            res.status(StatusCodes.OK).json({match,token,decode})

           } else {
            next(new AppError('password wrong',403))
           }

        } else {
            next(new AppError('email not found',400))
        }
})

// check unique email 
const isEmailAvailable =catchAsyncError(async(req,res,next)=>{
    const { email } = req.body;
    const existingClient = await Client.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ result: false });
        }else{
            return res.status(200).json({ result: true });
        }
    
}) 

// check unique phone Number 
const isPhoneNumberAvailable =catchAsyncError(async(req,res,next)=>{
    const { phoneNumber } = req.body;
    const existingClient = await Client.findOne({ where: { phoneNumber : JSON.stringify(phoneNumber) } });
        if (existingClient) {
            return res.status(400).json({ result: false });
        }else{
            return res.status(200).json({ result: true });
        }
})

// check unique phone Number 
const isIdentityAvailable =catchAsyncError(async(req,res,next)=>{
    const { identity } = req.body;
    const existingClient = await Client.findOne({ where: { identity } });
        if (existingClient) {
            return res.status(400).json({ result: false });
        }else{
            return res.status(200).json({ result: true });
        }
})

module.exports={getAllClients,addClient,updateClient,getSingleClient,search , login ,isEmailAvailable ,isPhoneNumberAvailable , isIdentityAvailable}