
// const multer  = require('multer') ;
// const AppError = require('./AppError');


// // module.exports.uploadSingleFile = (fieldName,folderName)=>{
// //     const storage = multer.diskStorage({})

// //     function fileFilter(req,file,cb){
// //         if (file.mimetype.startsWith('image')) {
// //             cb(null,true)
// //         } else {
// //             cb(new AppError('only image',400),false)        
// //         }
// //     }
// //     console.log("mooooooooooooooooooddddddddddddiiiiiiiiiiiiiiiifer");
// //     const upload = multer({ storage,fileFilter}) ; 
// //     return upload.single(fieldName,folderName)
// // }

// //////////////////////////////////////////////////////////////


// let options = (folderName) => {
//     const storage = multer.diskStorage({})
//     function fileFilter(req, file, cb) {
//         if (file.mimetype.startsWith('image')) {
//             cb(null, true)
//         } else {
//             cb(new AppError("images only", 400), false)
//         }
//     }
//     const upload = multer({ storage, fileFilter })
//     return upload
// }

// exports.uploadSingleFile = (fieldName, folderName) => {   
//     console.log("tessssssssssssstttttttttttttttttttt");
//    return options(folderName).single(fieldName)
// }


// exports.uploadMixOfFiles = (arrayOfFields, folderName) => options(folderName).fields(arrayOfFields)

const multer = require('multer');
const AppError = require('./AppError');
const fs = require('fs');
const path = require('path');

// Allowed file types and their corresponding MIME types
const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
];

let options = (folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, folderName); // Ensure full path is used
            
            // Check if directory exists, if not, create it
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath); // Set the destination folder
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname); // Set unique file name
        }
    });

    function fileFilter(req, file, cb) {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError("Invalid file type. Only images, PDFs, Excel, and Word documents are allowed.", 400), false);
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
};

exports.uploadSingleFile = (fieldName, folderName) => {
    return options(folderName).single(fieldName);
};

exports.uploadMixOfFiles = (arrayOfFields, folderName) => {
    return options(folderName).fields(arrayOfFields);
};
