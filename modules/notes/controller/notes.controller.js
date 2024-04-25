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
        res.status(StatusCodes.OK).json({ message: "Your Note send Successfully ", result: result ,success :true })

})  ;

// get single client notes
const getClientNote=catchAsyncError(async(req,res,next)=>{
    var clientId = req.query.client_id ;
    // if (req.query.client_id) {
    //     let client= await  Client.findOne({where:{user_id:req.query.client_id}});
    //     clientId = client.id
    // }else{
        // let client= await  Client.findOne({where:{user_id:req.loginData.id}});
        // clientId = client.id
    // }

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

const getClientNotes = catchAsyncError(async (req, res, next) => {
    var clientId = req.query.client_id;
    // if (req.query.client_id) {
    //     let client = await Client.findOne({ where: { user_id: req.query.client_id } });
    //     clientId = client.id;
    // } else {
    //     let client = await Client.findOne({ where: { user_id: req.loginData.id } });
    //     clientId = client.id;
    // }

    const page = req.query.page || 1;
    const per_page = parseInt(req.query.per_page) || 10; // Default per_page to 10 if not provided
    const offset = (page - 1) * per_page;

    let notes = await Note.findAndCountAll({
        where: { client_id: clientId },
        order: [['createdAt', 'DESC']], // Order by createdAt in descending order
        limit: per_page,
        offset: offset
    });

    const totalPages = Math.ceil(notes.count / per_page);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Getting Notes Successfully",
        result: {
            totalCount: notes.count,
            totalPages: totalPages,
            currentPage: page,
            per_page: per_page,
            items: notes.rows
        },
    });
});


module.exports ={createNote , getClientNotes}  ; 