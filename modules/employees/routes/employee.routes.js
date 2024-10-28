const isAuth = require('../../../common/middleare/isAuth');
const employeeRoutes=require('express').Router() ;
const validateRequest = require("../../../common/middleare/validationRequest");
const { uploadSingleFile } = require('../../../helpers/fileUpload');
const { addEmp , deleteEmp ,getAllEmps ,getSingleEmp ,isIdentityAvailable ,updateEmp, toggleActivation, deleteEmpSoft } = require("../controllers/employee.controller");
const { addEmpSchema , updateEmpSchema} = require('../joi/employee.validation');

employeeRoutes.get('/AllEmployees',isAuth('ALL'),getAllEmps) 
employeeRoutes.post('/AddEmployee',uploadMixOfFiles([{name: 'iqamaImage', maxCount:1 },{name: 'contractImage', maxCount:1 }],'employee')
, validateRequest(addEmpSchema) ,isAuth('ALL'),addEmp)
employeeRoutes.put('/UpdateEmployee',uploadMixOfFiles([{name: 'iqamaImage', maxCount:1 },{name: 'contractImage', maxCount:1 }],'employee'),validateRequest(updateEmpSchema),isAuth('ALL'),updateEmp)
employeeRoutes.delete('/DeleteEmployee',isAuth('ALL'),deleteEmp) ;
employeeRoutes.put('/DeleteEmployee',isAuth('ALL'),deleteEmpSoft) ;
employeeRoutes.get('/GetSingleEmployee',isAuth('ALL'),getSingleEmp) ;
employeeRoutes.post('/IsIdentityAvailable',isIdentityAvailable) ; 
employeeRoutes.get('/ToggleActivation',isAuth('ALL'),toggleActivation) ;


module.exports=employeeRoutes;