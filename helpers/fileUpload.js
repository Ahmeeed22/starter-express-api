
const multer  = require('multer') ;
const AppError = require('./AppError');


// module.exports.uploadSingleFile = (fieldName,folderName)=>{
//     const storage = multer.diskStorage({})

//     function fileFilter(req,file,cb){
//         if (file.mimetype.startsWith('image')) {
//             cb(null,true)
//         } else {
//             cb(new AppError('only image',400),false)        
//         }
//     }
//     console.log("mooooooooooooooooooddddddddddddiiiiiiiiiiiiiiiifer");
//     const upload = multer({ storage,fileFilter}) ; 
//     return upload.single(fieldName,folderName)
// }

//////////////////////////////////////////////////////////////


let options = (folderName) => {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new AppError("images only", 400), false)
        }
    }
    const upload = multer({ storage, fileFilter })
    return upload
}

exports.uploadSingleFile = (fieldName, folderName) => {   
    console.log("tessssssssssssstttttttttttttttttttt");
   return options(folderName).single(fieldName)
}


exports.uploadMixOfFiles = (arrayOfFields, folderName) => options(folderName).fields(arrayOfFields)

