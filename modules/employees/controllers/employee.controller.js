const { StatusCodes } = require("http-status-codes");
const { catchAsyncError } = require("../../../helpers/catchSync");
const Employee = require("../model/employee.model");
const AppError = require("../../../helpers/AppError");

// get all Emps
const getAllEmps = catchAsyncError(async (req, res, next) => {
    // Parse query parameters
    const page = req.query.page || 1;
    const perPage = parseInt(req.query.per_page) || 1000; // Default per_page to 1000 if not provided
    // Calculate offset based on page and perPage
    const offset = (page - 1) * perPage;
    // Define search criteria based on query parameter 'search'
    const search = req.query.search;

    let searchCriteria = {
        clientHistory_id: req.query.clientHistory_id
    };
    if (req.query.search) {
        searchCriteria = {
            ...searchCriteria,
            // Uncomment this block if you want to include search functionality
            // [Op.or]: [
            //     { name: { [Op.like]: `%${search}%` } },
            //     { email: { [Op.like]: `%${search}%` } },
            //     { identity: { [Op.like]: `%${search}%` } },
            //     // Add more attributes here for searching
            //     // Add phoneNumber as well
            //     { phoneNumber: { [Op.like]: `%${search}%` } }
            // ]
        };
    }

    const emps = await Employee.findAndCountAll({
        where: { clientHistory_id: req.query.clientHistory_id },
        limit: perPage,
        offset: offset,
        order: [['createdAt', 'DESC']] // Order by createdAt in descending order
    });

    // Calculate total pages
    const totalPages = Math.ceil(emps.count / perPage);
    // Adjust total count if there are no items on the last page
    const totalCount = (page < totalPages) ? emps.count : (offset + emps.rows.length);
    res.status(StatusCodes.OK).json({
        success: true,
        result: {
            totalCount: totalCount,
            totalPages: totalPages,
            currentPage: page,
            perPage: perPage,
            items: emps.rows
        }
    });
})


// update emp
const updateEmp=catchAsyncError(async(req,res,next)=>{

        let id=req.query.id; 
        await Employee.update({...req.body},{where:{id}})
        res.status(StatusCodes.OK).json({success:true, message : "Updated Employee Successfully"})

}) 

// get single emp
const getSingleEmp=catchAsyncError(async(req,res,next)=>{
        let id=req.query.id;
        let emp=await Employee.findOne({
                                            where:{id} ,
                                        } , );
        res.status(StatusCodes.OK).json({success:true,result :emp , message : "Returned Employee Successfully"});
   
})

// add employee
const addEmp=catchAsyncError(async(req,res,next)=>{
        const emp= await  Employee.findOne({where:{identity:req.body.identity}});
        if (emp) {
            res.status(StatusCodes.BAD_REQUEST).json({message:"identity is excit "})
        } else {
                var result= await Employee.create({...req.body,healthCertificate:"https://ik.imagekit.io/2cvha6t2l9/logo.png?updatedAt=1713227861401",iqamaImage : "https://ik.imagekit.io/2cvha6t2l9/logo.png?updatedAt=1713227861401"})
                 res.status(StatusCodes.CREATED).json({success:true,result, message : "Created Employee Successfully"})
        }
})

// check unique isIdentityAvailable 
const isIdentityAvailable =catchAsyncError(async(req,res,next)=>{
    const { identity } = req.body;
    const existingClient = await Employee.findOne({ where: { identity } });
        if (existingClient) {
            return res.status(200).json({success : true , result: false });
        }else{
            return res.status(200).json({ success : true ,result: true });
        }
})

// delete Emp
const deleteEmp=catchAsyncError(async(req,res,next)=>{
    let id=req.query.id
    var empX=await Employee.findOne({where:{id}})
    if (!empX)
        next(new AppError('this id not exist ',400))
    await Employee.destroy({
        where :{
            id
        },
    })
    res.status(StatusCodes.OK).json({ success : true , message:" Deleted Employee success"})
})

module.exports={getAllEmps , addEmp , updateEmp , getSingleEmp , isIdentityAvailable , deleteEmp}