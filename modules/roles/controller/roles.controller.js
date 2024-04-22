const { Op, Sequelize } = require("sequelize");
const { catchAsyncError } = require("../../../helpers/catchSync");
const { StatusCodes } = require("http-status-codes");
const Role = require("../model/roles.model");
const createRole =catchAsyncError(async (req, res) => {
 
        var result= await Role.create({desc:req.body.desc ,client_id : req.loginData.id })
        res.status(StatusCodes.CREATED).json({ message: "Role send Successfully ", result: result ,success :true })

})  ;

module.exports ={createRole}  ;