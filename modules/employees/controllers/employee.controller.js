const { StatusCodes } = require("http-status-codes");
const { catchAsyncError } = require("../../../helpers/catchSync");
const Employee = require("../model/employee.model");
const AppError = require("../../../helpers/AppError");
const cloudinary= require('cloudinary');
          
cloudinary.config({ 
  cloud_name: 'dznjcejpn', 
  api_key: '522611695566884', 
  api_secret: 'MoRZRCxxji3Fm14pryYpV18YyXs' 
});


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
            [Op.or]: [
                { identity: { [Op.like]: `%${search}%` } },
                { healthCertificate: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` }  }
            ]
        };
    }

    const emps = await Employee.findAndCountAll({
        where: { clientHistory_id: req.query.clientHistory_id ,isDeleted:false},
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
// const updateEmp=catchAsyncError(async(req,res,next)=>{
//         let id=req.query.id; 
//         var empOld = await Employee.findOne({ where: { id } })
//             if (!empOld)
//                 next(new AppError('invalid id Employee', 400)) ;
//           // Check if req.file exists (image is uploaded)
//           if (req.file) {
//             cloudinary.v2.uploader.upload(req.file.path,async(error, result)=>{
//                 console.log(result ,"error",error);
//                 await Employee.update({...req.body,iqamaImage:result.secure_url},{where:{id}})
//                 res.status(StatusCodes.OK).json({success:true, message : "Updated Employee Successfully"})
//             });
//         } else {
//             // If no image is uploaded, update Employee without image
//             await Employee.update({...req.body},{where:{id}}) ;
//             res.status(StatusCodes.OK).json({success:true, message : "Updated Employee Successfully"})
//     }

// }) 
const updateEmp = catchAsyncError(async (req, res, next) => {
    let id = req.query.id; 
    const empOld = await Employee.findOne({ where: { id } });
    
    if (!empOld) {
        return next(new AppError('Invalid Employee ID', 400));
    }

    // Initialize updateData object with request body data
    let updateData = { ...req.body };

    try {
        // Check and upload `iqamaImage` if it exists
        if (req.files && req.files.iqamaImage) {
            const iqamaImageResult = await cloudinary.v2.uploader.upload(req.files.iqamaImage[0].path);
            updateData.iqamaImage = iqamaImageResult.secure_url;
        }

        // Check and upload `contractImage` if it exists
        if (req.files && req.files.contractImage) {
            const contractImageResult = await cloudinary.v2.uploader.upload(req.files.contractImage[0].path);
            updateData.contractImage = contractImageResult.secure_url;
        }

        // Update the Employee with new data
        await Employee.update(updateData, { where: { id } });

        res.status(StatusCodes.OK).json({ success: true, message: "Updated Employee Successfully" });

    } catch (error) {
        console.error("Error updating Employee:", error);
        return next(new AppError('Error updating Employee', 500));
    }
});


// get single emp
const getSingleEmp=catchAsyncError(async(req,res,next)=>{
        let id=req.query.id;
        let emp=await Employee.findOne({
                                            where:{id} ,
                                        } , );
        res.status(StatusCodes.OK).json({success:true,result :emp , message : "Returned Employee Successfully"});
   
})

// // add employee
// const addEmp=catchAsyncError(async(req,res,next)=>{
//         const emp= await  Employee.findOne({where:{identity:req.body.identity}});
//         if (emp) {
//             res.status(StatusCodes.BAD_REQUEST).json({message:"identity is excit "})
//         } else {
//                  cloudinary.v2.uploader.upload(req.file.path,async(error, result)=>{
//                     console.log(result);
              
//                     var result= await Employee.create({...req.body,iqamaImage :result.secure_url });
//                     res.status(StatusCodes.OK).json({success:true,result, message : "Created Employee Successfully"})
//                 });
//         }

        
// })
const addEmp = catchAsyncError(async (req, res, next) => {
    const emp = await Employee.findOne({ where: { identity: req.body.identity } });
    
    if (emp) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Identity already exists" });
    } 
    
    // Assuming `iqamaImage` and `contractImage` are files uploaded via Multer (use `upload.fields` to handle multiple files)
    const iqamaImageFile = req.files.iqamaImage ? req.files.iqamaImage[0].path : null;
    const contractImageFile = req.files.contractImage ? req.files.contractImage[0].path : null;

    try {
        // Upload `iqamaImage` to Cloudinary
        let iqamaImageResult = iqamaImageFile ? await cloudinary.v2.uploader.upload(iqamaImageFile) : null;

        // Upload `contractImage` to Cloudinary
        let contractImageResult = contractImageFile ? await cloudinary.v2.uploader.upload(contractImageFile) : null;

        // Create employee record with the uploaded image URLs
        const result = await Employee.create({
            ...req.body,
            iqamaImage: iqamaImageResult ? iqamaImageResult.secure_url : null,
            contractImage: contractImageResult ? contractImageResult.secure_url : null
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            result,
            message: "Created Employee Successfully"
        });

    } catch (error) {
        console.error("Error uploading files to Cloudinary:", error);
        return next(new AppError('Error uploading images', 500));
    }
});


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

// deleteClientHistory
const deleteEmpSoft=catchAsyncError( async (req , res , next)=>{
    let id =req.query.id ; 
    const emp = await Employee.findOne({where : {id : id}})
        if (!emp) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await Employee.update({isDeleted : !emp.isDeleted},{where:{id:id}});

       res.status(StatusCodes.OK).json({ success : true , message:" Deleted Employee success"})
})
// toggleActivation
const toggleActivation=catchAsyncError( async (req , res , next)=>{
    let id =req.query.id ; 
        let employee=await Employee.findOne({
            where:{id}  } );
        if (!employee) {
            res.status(StatusCodes.BAD_REQUEST).json({success : false,message:"id is no exit"})
        }      
        await Employee.update({active : !client.active},{where:{id:id}})
        res.status(StatusCodes.OK).json({success:true, message : `employee ${!client.active? 'Activated':'Disactived'}`})
})
module.exports={getAllEmps , addEmp , updateEmp , getSingleEmp , isIdentityAvailable , deleteEmp,toggleActivation,deleteEmpSoft}