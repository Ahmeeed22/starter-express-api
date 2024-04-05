const clientRoutes= require("express").Router();
const isAuth = require("../../../common/middleare/isAuth");
const validateRequest=require('../../../common/middleare/validationRequest')


const {addClient , getAllClients , getSingleClient , login ,search ,updateClient ,isEmailAvailable ,isIdentityAvailable , isPhoneNumberAvailable } = require("../controllers/client.controller")
const { addClientSchema , loginSchema , updateClientSchema } = require("../joi/client.validation");



clientRoutes.get("/AllClients",isAuth('ALL'),getAllClients);
clientRoutes.put('/UpdateClient/:id',isAuth('ALL'),validateRequest(updateClientSchema),updateClient);
clientRoutes.post('/AddClient',validateRequest(addClientSchema),addClient);
clientRoutes.get('/GetSingleClient/:id',isAuth('ALL'),getSingleClient);
clientRoutes.get('/SearchClient',isAuth('ADMIN'),search);
clientRoutes.post('/Login',validateRequest(loginSchema),login);
clientRoutes.post('/IsEmailAvailable',isEmailAvailable) ;
clientRoutes.post('/IsIdentityAvailable',isIdentityAvailable) ;
clientRoutes.post('/IsPhoneNumberAvailable',isPhoneNumberAvailable) ;


module.exports=clientRoutes; 
