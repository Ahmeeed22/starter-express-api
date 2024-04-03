const clientRoutes= require("express").Router();
const isAuth = require("../../../common/middleare/isAuth");
const validateRequest=require('../../../common/middleare/validationRequest')


const {addClient , getAllClients , getSingleClient , login ,search ,updateClient } = require("../controllers/client.controller")
const { addClientSchema , loginSchema , updateClientSchema } = require("../joi/client.validation");



clientRoutes.get("/AllClients",isAuth('ADMIN'),getAllClients);
clientRoutes.put('/UpdateClient/:id',isAuth('ADMIN'),validateRequest(updateClientSchema),updateClient);
clientRoutes.post('/AddClient',validateRequest(addClientSchema),addClient);
clientRoutes.get('/GetSingleClient/:id',isAuth('ADMIN'),getSingleClient)
clientRoutes.get('/SearchClient',isAuth('ADMIN'),search)
clientRoutes.post('/Login',validateRequest(loginSchema),login)


module.exports=clientRoutes; 
