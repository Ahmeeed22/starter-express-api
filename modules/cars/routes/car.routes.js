const isAuth = require('../../../common/middleare/isAuth');
const carRoutes=require('express').Router() ;
const validateRequest = require("../../../common/middleare/validationRequest")
const { addCar , deleteCar , getAllCars , getSingleCar , updateCar } = require("../controllers/car.controller");
const { addCarSchema , updateCarSchema} = require('../joi/car.validation');

carRoutes.get('/AllCars',isAuth('ALL'),getAllCars) 
carRoutes.post('/AddCar', validateRequest(addCarSchema) ,isAuth('ALL'),addCar)
carRoutes.put('/UpdateCar',validateRequest(updateCarSchema),isAuth('ALL'),updateCar)
carRoutes.delete('/DeleteCar',isAuth('ALL'),deleteCar) ;
carRoutes.get('/GetSingleCar',isAuth('ALL'),getSingleCar) ;
// carRoutes.post('/IsIdentityAvailable',isIdentityAvailable) ; 

module.exports=carRoutes;