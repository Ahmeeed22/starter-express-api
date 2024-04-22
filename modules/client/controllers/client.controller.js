const Client = require("../model/client.model");
const {Op}=require("sequelize");
const bcrypt = require('bcrypt')
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const AppError = require("../../../helpers/AppError");
const { catchAsyncError } = require("../../../helpers/catchSync");
const LoggerService = require("../../../services/logger.service");
const ClientHistory = require("../../clinetHistory/model/clientHistory.model");
const { log } = require("console");
const User = require("../../users/model/user.model");

const logger=new LoggerService('user.controller')

// get all clients
const getAllClients = catchAsyncError(async(req, res, next) => {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 12;
    const offset = (page - 1) * perPage;
    const search = req.query.search;

    let searchCriteria = {
        admin_id: req.loginData.id ,
    };

    if (req.query.search) {
        searchCriteria = {
            ...searchCriteria,
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { identity: { [Op.like]: `%${search}%` } },
                { phoneNumber: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    // Count total clients without pagination
    const totalCount = await User.count({ where: searchCriteria });

    // Fetch clients with pagination
    const clients = await User.findAll({
        where: searchCriteria,
        limit: perPage,
        offset: offset,
        order: [['createdAt', 'DESC']] // Order by createdAt in descending order

    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / perPage);

    res.status(StatusCodes.OK).json({
        success: true,
        result: {
            totalCount: totalCount,
            totalPages: totalPages,
            currentPage: page,
            perPage: perPage,
            items: clients
        }
    });
});

// toggleActivation
const toggleActivation=catchAsyncError( async (req , res , next)=>{
    let id =req.query.client_id ; 
    let {active}=req.body ;
        let client=await User.findOne({
            where:{id}  } );
        if (!client) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await User.update({active},{where:{id}})
        res.status(StatusCodes.OK).json({success:true, message : `Client ${active? 'Activated':'Disactived'}`})
})

// update client
const updateClient=catchAsyncError(async(req,res,next)=>{

        let id=req.params.id;
        let client=await User.findOne({
            where:{id}  } );
        if (!client) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await User.update({...req.body , admin_id : req.loginData.id},{where:{id}})
        res.status(StatusCodes.OK).json({success:true, message : "Updated Client Successfully"})

}) 

// get single client
const getSingleClient=catchAsyncError(async(req,res,next)=>{
        let id=req.params.id;
        let client=await User.findOne({
                                            where:{id} ,
                                            include: [
                                                {
                                                    model: Client,
                                                    include: [ClientHistory] // Include the nested association ClientHistory
                                                }
                                            ]
                                        } , );
                                        
        res.status(StatusCodes.OK).json({success:true,result:client});
    
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
        let client= await  User.findOne({where:{email:req.body.email}});
        if (client) {
            res.status(StatusCodes.BAD_REQUEST).json({message:"email is exit"})
        } 
        // Check if the phoneNumber already exists
        client = await User.findOne({ where: { phoneNumber : req.body.phoneNumber} });
        if (client) {
             res.status(StatusCodes.BAD_REQUEST).json({suucess : false, message: "Phone number already exists" });
        }

        // Check if the identity already exists
        client = await User.findOne({ where: { identity : req.body.identity} });
        if (client) {
             res.status(StatusCodes.BAD_REQUEST).json({suucess : false, message: "Identity already exists" });
        }


        bcrypt.hash(password,7, async (err,hash)=>{
            if(err) throw err
            let data  = {...req.body , password:hash , admin_id : req.loginData?.id};
            var result= await User.create({...data, role_id:2}) ;
            var client = await Client.create({company_id:1,user_id:result.id})
             res.status(StatusCodes.CREATED).json({success:true,result, message : "Created Client Successfully"}) 
        })
        
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
    const existingClient = await User.findOne({ where: { email } });
        if (existingClient) {
            return res.status(200).json({ success : true ,result: false });
        }else{
            return res.status(200).json({ success : true ,result: true });
        }
    
}) 

// check unique phone Number 
const isPhoneNumberAvailable =catchAsyncError(async(req,res,next)=>{
    const { phoneNumber , countryCode} = req.body;
    const existingClient = await User.findOne({ where: { phoneNumber : phoneNumber , countryCode} });
        if (existingClient) {
            return res.status(200).json({ success : true ,result: false });
        }else{
            return res.status(200).json({ success : true ,result: true });
        }
})

// check unique phone Number 
const isIdentityAvailable =catchAsyncError(async(req,res,next)=>{
    const { identity } = req.body;
    const existingClient = await User.findOne({ where: { identity } });
        if (existingClient) {
            return res.status(200).json({ success : true ,result: false });
        }else{
            return res.status(200).json({ success : true ,result: true });
        }
})

module.exports={getAllClients,addClient,updateClient,getSingleClient,search , login ,isEmailAvailable ,isPhoneNumberAvailable , isIdentityAvailable , toggleActivation}