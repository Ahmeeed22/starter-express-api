const isAuth = require('../../../common/middleare/isAuth');
const employeeRoutes=require('express').Router() ;
const validateRequest = require("../../../common/middleare/validationRequest")
const { addEmp , deleteEmp ,getAllEmps ,getSingleEmp ,isIdentityAvailable ,updateEmp, toggleActivation } = require("../controllers/employee.controller");
const { addEmpSchema , updateEmpSchema} = require('../joi/employee.validation');

employeeRoutes.get('/AllEmployees',isAuth('ALL'),getAllEmps) 
employeeRoutes.post('/AddEmployee', validateRequest(addEmpSchema) ,isAuth('ALL'),addEmp)
employeeRoutes.put('/UpdateEmployee',validateRequest(updateEmpSchema),isAuth('ALL'),updateEmp)
employeeRoutes.delete('/DeleteEmployee',isAuth('ALL'),deleteEmp) ;
employeeRoutes.get('/GetSingleEmployee',isAuth('ALL'),getSingleEmp) ;
employeeRoutes.post('/IsIdentityAvailable',isIdentityAvailable) ; 
employeeRoutes.get('/ToggleActivation',isAuth('ALL'),toggleActivation) ;


module.exports=employeeRoutes;