const { StatusCodes } = require("http-status-codes");
const { catchAsyncError } = require("../../../helpers/catchSync");
const AppError = require("../../../helpers/AppError");
const Car = require("../model/car.model");


// get all cars
const getAllCars = catchAsyncError(async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = parseInt(req.query.per_page) || 1000;
    const offset = (page - 1) * perPage;

    const search = req.query.search;
    let searchCriteria = {
        clientHistory_id: req.query.clientHistory_id
    };

    if (search) {
        searchCriteria = {
            ...searchCriteria,
            // Include your search criteria here
        };
    }

    const cars = await Car.findAndCountAll({ 
        where: searchCriteria,
        limit: perPage,
        offset: offset,
        order: [['createdAt', 'DESC']] // Order by createdAt in descending order
    });

    // Calculate total pages
    const totalPages = Math.ceil(cars.count / perPage);

    res.status(StatusCodes.OK).json({
        success: true,
        result: {
            totalCount: cars.count,
            totalPages: totalPages,
            currentPage: page,
            perPage: perPage,
            items: cars.rows
        }
    });
});



// update car
const updateCar=catchAsyncError(async(req,res,next)=>{

        let id=req.query.id; 
        var carOld = await Car.findOne({ where: { id } })
            if (!carOld)
                next(new AppError('invalid id Car', 400)) ;

        await Car.update({...req.body},{where:{id}}) ;
        res.status(StatusCodes.OK).json({success:true, message : "Updated Car Successfully"})

}) 

// get single Car
const getSingleCar=catchAsyncError(async(req,res,next)=>{
        let id=req.query.id;
        let car=await Car.findOne({ where:{id} ,} , );
        res.status(StatusCodes.OK).json({success:true,result :car , message : "Returned Car Successfully"});
   
})

// add car
const addCar=catchAsyncError(async(req,res,next)=>{
        // const car= await  Car.findOne({where:{id:req.body.identity}});
        // if (car) {
        //     res.status(StatusCodes.BAD_REQUEST).json({message:"id is found before"})
        // } else {
                var result= await Car.create({...req.body,formImage :"https://ik.imagekit.io/2cvha6t2l9/logo.png?updatedAt=1713227861401"})
                 res.status(StatusCodes.OK).json({success:true,result, message : "Created Car Successfully"})
        // }
})

// check unique isIdentityAvailable 
// const isIdentityAvailable =catchAsyncError(async(req,res,next)=>{
//     const { identity } = req.body;
//     const existingClient = await Employee.findOne({ where: { identity } });
//         if (existingClient) {
//             return res.status(400).json({success : true , result: false });
//         }else{
//             return res.status(200).json({ success : true ,result: true });
//         }
// })

// delete car
const deleteCar=catchAsyncError(async(req,res,next)=>{
    let id=req.query.id
    var carX=await Car.findOne({where:{id}})
    if (!carX)
        next(new AppError('this id not exist ',400))
    await Car.destroy({
        where :{
            id
        },
    })
    res.status(StatusCodes.OK).json({ success : true , message:" Deleted Car success"})
}) ;

module.exports={deleteCar , addCar , updateCar , getAllCars , getSingleCar}