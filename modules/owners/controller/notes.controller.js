const { Op, Sequelize } = require("sequelize");
const { catchAsyncError } = require("../../../helpers/catchSync");
const { StatusCodes } = require("http-status-codes");
const Note = require("../model/notes.model");
Note

const createNote =catchAsyncError(async (req, res) => {
 
        var result= await Note.create({desc:req.body.desc ,client_id : req.loginData.id })
        res.status(StatusCodes.CREATED).json({ message: "success", result: result })

})  ;

const getAllOwners = catchAsyncError(async (req, res, next) => {
    const indexInputs = req.body;
    const filterObj = {
        where: {},
        limit: indexInputs.limit || 10,
    }
    if (indexInputs.offset) {
        filterObj['offset'] = indexInputs.offset * filterObj.limit;
    }

    filterObj.where['company_id'] = req.loginData?.company_id || 1;
    console.log("ererererererererererererererererererererererere copany id  erere   ",filterObj.where.company_id);
    filterObj['order'] = [
        [indexInputs?.orderBy?.coulmn || 'createdAt', indexInputs?.orderBy?.type || 'DESC'],
    ];
    if (indexInputs.type != undefined) {
        filterObj.where.type = indexInputs.type;
    }
    if (indexInputs.desc) {
        filterObj.where.desc = indexInputs.desc;
    };

    var startDate = indexInputs.startDate ? new Date(indexInputs.startDate) : new Date("2010-01-01");
    let date = new Date(indexInputs.endDate);
    var endDate = indexInputs.endDate ? date.setHours(date.getHours() + 24) : new Date();

    if (indexInputs.startDate || indexInputs.endDate) {
        filterObj.where.createdAt = {
            [Op.between]: [startDate, endDate]
        }
    };
    if (indexInputs.active === true || indexInputs.active === false) {
        filterObj.where.active = indexInputs.active;
    };

    var ownersTransactions = await Owners.findAndCountAll({ ...filterObj });
    var ownersTransactionSum = await Owners.findAll({  
        ...filterObj,
       
        attributes: [
            [Sequelize.fn('sum',  Sequelize.literal("CASE WHEN type = 'invest' THEN amount ELSE 0 END")), 'investTotalAmount'] ,
            [Sequelize.fn('sum',  Sequelize.literal("CASE WHEN type = 'drowing' THEN amount ELSE 0 END")), 'drowingTotalAmount'] ,

        ]
    });

    // Extract the sum from the result
    const investTotalAmount = ownersTransactionSum[0]?.dataValues?.investTotalAmount || 0;
    const drowingTotalAmount = ownersTransactionSum[0]?.dataValues?.drowingTotalAmount || 0;

    res.status(StatusCodes.OK).json({ message: "success", result: { ownersTransactions, investTotalAmount ,drowingTotalAmount } });
});

const getCapitalAndOwnerDrawing=catchAsyncError(async (req, res, next) => {
    const drowingSum = await Owners.sum("amount", {
        where: {
          type: "drowing",
          active: true, // You can add any additional conditions here
          company_id:req.loginData.company_id
        },
      });
  
      const investSum = await Owners.sum("amount", {
        where: {
          type: "invest",
          active: true, // You can add any additional conditions here
          company_id:req.loginData.company_id
        },
      });

    res.status(StatusCodes.OK).json({ message: "success", result: { drowingSum,investSum } });
});


module.exports ={createNote}  ;