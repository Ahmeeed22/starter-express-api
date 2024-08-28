const clientRoutes= require("express").Router();
const isAuth = require("../../../common/middleare/isAuth");
const validateRequest=require('../../../common/middleare/validationRequest');
const { getClientHistorys, deleteClientHistorySoft } = require("../../clinetHistory/controller/clientHistory.controller");


const {addClient , getAllClients , getSingleClient , login ,search ,updateClient ,isEmailAvailable ,isIdentityAvailable , isPhoneNumberAvailable, toggleActivation, deleteClient } = require("../controllers/client.controller")
const { addClientSchema , loginSchema , updateClientSchema } = require("../joi/client.validation");



clientRoutes.get("/AllClients",isAuth('ALL'),getAllClients);
clientRoutes.put('/UpdateClient/:id',isAuth('ALL'),validateRequest(updateClientSchema),updateClient);
clientRoutes.post('/AddClient',validateRequest(addClientSchema),isAuth('ALL'),addClient); 
clientRoutes.get('/GetSingleClient/:id',isAuth('ALL'),getSingleClient);
clientRoutes.get('/GetAllOwnHistory',isAuth('ALL'),getClientHistorys);
clientRoutes.get('/SearchClient',isAuth('ADMIN'),search);
clientRoutes.post('/Login',validateRequest(loginSchema),login);
clientRoutes.post('/IsEmailAvailable',isEmailAvailable) ;
clientRoutes.post('/IsIdentityAvailable',isIdentityAvailable) ;
clientRoutes.post('/IsPhoneNumberAvailable',isPhoneNumberAvailable) ;
clientRoutes.get('/ToggleActivation',isAuth('ALL'),toggleActivation) ;
clientRoutes.put('/DeleteClients',isAuth('ALL'),deleteClientHistorySoft) ;
clientRoutes.delete('/DeleteClient',isAuth('ALL'),deleteClient) ;

module.exports=clientRoutes; 
