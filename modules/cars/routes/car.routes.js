const isAuth = require('../../../common/middleare/isAuth');
const carRoutes=require('express').Router() ;
const validateRequest = require("../../../common/middleare/validationRequest");
const { uploadSingleFile } = require('../../../helpers/fileUpload');
const { addCar , deleteCar , getAllCars , getSingleCar , updateCar, toggleActivation, deleteCarSoft } = require("../controllers/car.controller");
const { addCarSchema , updateCarSchema} = require('../joi/car.validation');



carRoutes.get('/AllCars',isAuth('ALL'),getAllCars) 
carRoutes.post('/AddCar', uploadSingleFile('formImage','car'),validateRequest(addCarSchema) ,isAuth('ALL'),addCar)
carRoutes.put('/UpdateCar', uploadSingleFile('formImage','car'),validateRequest(updateCarSchema),isAuth('ALL'),updateCar)
carRoutes.put('/DeleteCar',isAuth('ALL'),deleteCarSoft) ;
carRoutes.delete('/DeleteCar',isAuth('ALL'),deleteCar) ;
carRoutes.get('/GetSingleCar',isAuth('ALL'),getSingleCar) ;
// carRoutes.post('/IsWorkPermitCardAvailable',isWorkPermitCardAvailable) ; 
carRoutes.get('/ToggleActivation',isAuth('ALL'),toggleActivation) ;


module.exports=carRoutes;