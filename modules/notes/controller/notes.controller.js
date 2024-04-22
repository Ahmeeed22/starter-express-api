const { Op, Sequelize } = require("sequelize");
const { catchAsyncError } = require("../../../helpers/catchSync");
const { StatusCodes } = require("http-status-codes");
const Note = require("../model/notes.model");
const User = require("../../users/model/user.model");
const Client = require("../../client/model/client.model");
Note

const createNote =catchAsyncError(async (req, res) => {
    let user= await  User.findOne({where:{id:req.loginData.id}});
    console.log("#####################", user , req.loginData.id); 
    let client = await Client.findOne({where:{user_id:user.id}})

        var result= await Note.create({desc:req.body.desc ,client_id : client.id })
        res.status(StatusCodes.CREATED).json({ message: "Your Note send Successfully ", result: result ,success :true })

})  ;

// get single client notes
const getClientNotes=catchAsyncError(async(req,res,next)=>{
    var clientId ;
    if (req.query.client_id) {
        let client= await  Client.findOne({where:{user_id:req.query.client_id}});
        clientId = client.id
    }else{
        let client= await  Client.findOne({where:{user_id:req.loginData.id}});
        clientId = client.id
    }

    let notes=await Note.findAndCountAll({
                                        where:{client_id:clientId} ,
                                        order: [['createdAt', 'DESC']] // Order by createdAt in descending order
                                    } , );
    res.status(StatusCodes.OK).json({success: true,
        message : "Getting Notes Successfully",
        result: {
            items: notes.rows
        },
    });

})

module.exports ={createNote , getClientNotes}  ;