const User = require("../../users/model/user.model");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../../../helpers/AppError");
const { catchAsyncError } = require("../../../helpers/catchSync");
const { Op, Sequelize } = require("sequelize");
const { log } = require("console");
const ClientHistory = require("../model/clientHistory.model");
const Client = require("../../client/model/client.model");

const getClientHistorys = catchAsyncError(async (req, res, next) => {
    const searchCriteria = {
        client_id: req.query.client_id  ,
        active: true  
    };
    if (req.query.clientHistory_id) {
        searchCriteria.id = req.query.clientHistory_id ;
    }
    var clientHistorys = await ClientHistory.findAndCountAll({
        where: searchCriteria
        , order: [
            ['createdAt', 'DESC'],
        ],
        //  include: Client
    })
    res.status(StatusCodes.OK).json({ success: true, result:{totalCount:clientHistorys.count , items : clientHistorys.rows }})

})

const addClientHistory = catchAsyncError(async (req, res, next) => {

        var clientHistory = await ClientHistory.create({...req.body, client_id : req.query.client_id});
        res.status(StatusCodes.CREATED).json({success:true, message: "client history added successfully", result: clientHistory })

})



const updateClientHistory = catchAsyncError(async (req, res, next) => {
    const id = req.query.id
    var clientHistoryOld = await ClientHistory.findOne({ where: { id } })
    if (!clientHistoryOld)
        next(new AppError('invalid id ClientHistory', 400))

        var updateData={} ;
        updateData={...req.body} ;

        var clientHistory = await ClientHistory.update(updateData, { where: { id } }) ; 
        res.status(StatusCodes.OK).json({ message: "success", result: clientHistory  })
})

// search
const searchClientHistorys = catchAsyncError(async (req, res, next) => {
    let indexInputs = req.query;
    const filterObj = {
        where: {},
    }
    filterObj['order'] = [
        ['createdAt', 'DESC'],
    ];
    if (indexInputs.number) {
        filterObj.where["number"] = {
            [Op.like]: `%${indexInputs.number}%`
        }
    }
    if (indexInputs.name) {
        filterObj.where["name"] = {
            [Op.like]: `%${indexInputs.name}%`
        }
    }
    filterObj.where['company_id'] =req.loginData.company_id
    if (indexInputs.active == 0 || indexInputs.active == 1) {
        filterObj.where["active"] = indexInputs.active
    }

    if (filterObj.where.name ||filterObj.where.number || filterObj.where.active == 0 || filterObj.where.active == 1 ) {
        let clientHistory = await ClientHistory.findAll({ ...filterObj   
            // ,include:[
            //  {model:,attributes: []},
            //  { model:  ,order: [['createdAt', 'DESC']]}
            
            // ]
            ,});
        res.status(StatusCodes.OK).json({ message: "success", result: clientHistory })
    } else {
        let clientHistory = await ClientHistory.findAll({
            where: {
                company_id: req.loginData.company_id ,
                
              },
            order: [
                ['createdAt', 'DESC']
            ],include:[
                {model:Transaction,attributes: ['paymentAmount','balanceDue', "id"]},
                { model: DepositHistory ,order: [['createdAt', 'DESC']] }
               
               ]
        });
        res.status(StatusCodes.OK).json({ message: "success", result: customers })
    }

})




module.exports = { addClientHistory , getClientHistorys ,updateClientHistory , searchClientHistorys }