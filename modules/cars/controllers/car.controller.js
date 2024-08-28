const { StatusCodes } = require("http-status-codes");
const { catchAsyncError } = require("../../../helpers/catchSync");
const AppError = require("../../../helpers/AppError");
const Car = require("../model/car.model");

const cloudinary= require('cloudinary');
          
cloudinary.config({ 
  cloud_name: 'dznjcejpn', 
  api_key: '522611695566884', 
  api_secret: 'MoRZRCxxji3Fm14pryYpV18YyXs' 
});


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
            [Op.or]: [
                { workPermitCard: { [Op.like]: `%${search}%` } }
            ]
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
            // Check if req.file exists (image is uploaded)
            if (req.file) {
                cloudinary.v2.uploader.upload(req.file.path,async(error, result)=>{
                    console.log(result);
                    await Car.update({...req.body,formImage:result.secure_url},{where:{id}})
                    res.status(StatusCodes.OK).json({success:true, message : "Updated Car Successfully"})
                });
                // If image is uploaded, update car with image
                // await Car.update({ ...req.body, image: req.file.filename }, { where: { id } });
            } else {
                // If no image is uploaded, update car without image
                await Car.update({...req.body},{where:{id}}) ;
                res.status(StatusCodes.OK).json({success:true, message : "Updated Car Successfully"})
        }
}) 

// get single Car
const getSingleCar=catchAsyncError(async(req,res,next)=>{
        let id=req.query.id;
        let car=await Car.findOne({ where:{id} ,} , );
        res.status(StatusCodes.OK).json({success:true,result :car , message : "Returned Car Successfully"});
   
})

// add car
const addCar=catchAsyncError(async(req,res,next)=>{
    cloudinary.v2.uploader.upload(req.file.path,async(error, result)=>{
      console.log(result);

      var resultCreated= await Car.create({...req.body,formImage:result.secure_url})
       res.status(StatusCodes.OK).json({success:true,result:resultCreated, message : "Created Car Successfully"})
  });
        // const car= await  Car.findOne({where:{id:req.body.identity}});
        // if (car) {
        //     res.status(StatusCodes.BAD_REQUEST).json({message:"id is found before"})
        // } else {
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
// });

// deleteClientHistory
const deleteCarSoft=catchAsyncError( async (req , res , next)=>{
    let id =req.query.id ; 
    const car = await Car.findOne({where : {id : id}})
        if (!car) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await Car.update({isDeleted : !car.isDeleted},{where:{id:id}});

       res.status(StatusCodes.OK).json({ success : true , message:" Deleted car success"})
})
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
// toggleActivation
const toggleActivation=catchAsyncError( async (req , res , next)=>{
    let id =req.query.id ; 
        let car=await Car.findOne({
            where:{id}  } );
        if (!car) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await Car.update({active : !client.active},{where:{id:id}})
        res.status(StatusCodes.OK).json({success:true, message : `Car ${!client.active? 'Activated':'Disactived'}`})
})

module.exports={deleteCar , addCar , updateCar , getAllCars , getSingleCar , toggleActivation,deleteCarSoft}