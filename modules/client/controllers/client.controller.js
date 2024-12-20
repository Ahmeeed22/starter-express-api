const Client = require("../model/client.model");
const {Op, where}=require("sequelize");
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
        where: {...searchCriteria},
        limit: perPage,
        offset: offset,
        order: [['createdAt', 'DESC']], // Order by createdAt in descending order
        include : [ {model: Client}]

    });

    // Map through the items and replace 'id' with 'client.id'
    const updatedClients = clients.map(client => {
        return {
            ...client.toJSON(),
            id: client.client.id
        };
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
            items: updatedClients
        }
    });
});

// toggleActivation
const toggleActivation=catchAsyncError( async (req , res , next)=>{
    let id =req.query.client_id ; 
    const userBased = await Client.findOne({where : {id : id}})
        let client=await User.findOne({
            where:{id:userBased.user_id}  } );
        if (!client) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await User.update({active : !client.active},{where:{id:client.id}})
        res.status(StatusCodes.OK).json({success:true, message : `Client ${!client.active? 'Activated':'Disactived'}`})
})

// deleteClient
// const deleteClient=catchAsyncError( async (req , res , next)=>{
//     let id =req.query.id ; 
//     const userBased = await Client.findOne({where : {id : id}})
//         let client=await User.findOne({
//             where:{id:userBased.user_id}  } );
//         if (!client) {
//             res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
//         }      
//         await User.update({isDeleted : !client.isDeleted},{where:{id:client.id}});
//         await Client.update({isDeleted : !userBased.isDeleted},{where:{id:id}});
//         console.log("###########################################");
        
//        res.status(StatusCodes.OK).json({ success : true , message:" Deleted Client success"})
// });
const deleteClient = catchAsyncError(async (req, res, next) => {
    let id = req.query.id;
    // Find the client record using the Client model
    const userBased = await Client.findOne({ where: { id: id } });
    
    if (!userBased) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            success: false, 
            message: "Client with this ID does not exist" 
        });
    }

    // Find the associated user record using the User model
    let client = await User.findOne({ where: { id: userBased.user_id } });
    
    if (!client) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            success: false, 
            message: "Associated user does not exist" 
        });
    }

    // Perform hard delete: destroy the User record and Client record
    await User.destroy({ where: { id: client.id } });
    await Client.destroy({ where: { id: id } });

    console.log("###########################################");

    res.status(StatusCodes.OK).json({ 
        success: true, 
        message: "Deleted Client successfully" 
    });
});


// update client
const updateClient=catchAsyncError(async(req,res,next)=>{

        let id=req.params.id;
        let clientBase = await Client.findOne({where :{id}})
        let client=await User.findOne({
            where:{id:clientBase.user_id}  } );
        if (!client) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await User.update({...req.body , admin_id : req.loginData.id},{where:{id:clientBase.user_id}})
        res.status(StatusCodes.OK).json({success:true, message : "Updated Client Successfully"})

}) 

// get single client
const getSingleClient=catchAsyncError(async(req,res,next)=>{
        let id=req.params.id;
        let clientBase = await Client.findOne({where :{id}})
        let client=await User.findOne({
                                            where:{id:clientBase.user_id} ,
                                            include: [
                                                {
                                                    model: Client,
                                                    include: [ClientHistory] // Include the nested association ClientHistory
                                                }
                                            ]
                                        } , );
                                        
        res.status(StatusCodes.OK).json({success:true,result:{...client.toJSON(),id:clientBase.id,user_id:client.id}});
    
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
    const password = req.body.name.replace(/\s/g, '')+137
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
             res.status(StatusCodes.OK).json({success:true,result:{email:req.body.email,phoneNumber:req.body.phoneNumber,identity:req.body.identity}, message : "Created Client Successfully"}) 
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
    const existingClient = await User.findOne({ where: { phoneNumber : phoneNumber } });
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

module.exports={getAllClients,addClient,updateClient,getSingleClient,search , login ,isEmailAvailable ,isPhoneNumberAvailable , isIdentityAvailable , toggleActivation, deleteClient}