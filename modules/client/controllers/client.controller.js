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

     // Parse query parameters
     const page = parseInt(req.query.page) || 1;
     const perPage = parseInt(req.query.per_page) || 12; // Default per_page to 10 if not provided
     // Calculate offset based on page and perPage
     const offset = (page - 1) * perPage;

     // Define search criteria based on query parameters
    const searchCriteria = {
        admin_id: req.loginData.id
    };

    // Add additional search criteria if provided in query parameters
    if (req.query.name) {
        searchCriteria.name = req.query.name;
    }

    if (req.query.email) {
        searchCriteria.email = req.query.email;
    }

    if (req.query.identity) {
        searchCriteria.identity = req.query.identity;
    }


        const clients=await  Client.findAndCountAll({
            where:searchCriteria ,
            include :  [{ model: ClientHistory , } ] ,
            limit: perPage,
            offset: offset,
        });

        // Calculate total pages
        const totalPages = Math.ceil(clients.count / perPage);

        res.status(StatusCodes.OK).json({success:true,result:{totalCount:clients.count,totalPages: totalPages,
            currentPage: page, perPage: perPage ,items :clients.rows}})
}) 


// update client
const updateClient=catchAsyncError(async(req,res,next)=>{

        let id=req.params.id;
        await Client.update(req.body,{where:{id}})
        res.status(StatusCodes.OK).json({success:true})

})

// get single client
const getSingleClient=catchAsyncError(async(req,res,next)=>{
        let id=req.params.id;
        let client=await Client.findOne({
                                            where:{id} ,
                                            include :  [{ model: ClientHistory , } ]
                                        } , );
        res.status(StatusCodes.OK).json({success:true,client});
   
})
// search
const search=catchAsyncError(async(req,res,next)=>{
        let {searchKey}=req.query;
        if(searchKey){
          let clients= await Client.findAll({
            where:{name:{[Op.like]: `%${searchKey}%` , admin_id:req.loginData.admin_id} ,
            include :  [{ model: ClientHistory , } ]
        }});
            res.status(StatusCodes.OK).json({success:true,clients})
        }else{
           let clients= await Client.findAll( {
                                                where :{admin_id:req.loginData.admin_id},
                                                include :  [{ model: ClientHistory , } ]
                                            });
           res.status(StatusCodes.OK).json({success:true,clients})
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
                 res.status(StatusCodes.CREATED).json({success:true,result, message : "Created Client Successfully"})
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