const isAuth = require('../../../common/middleare/isAuth');
const { uploadMixOfFiles } = require('../../../helpers/fileUpload');

const clientHistoryRoutes=require('express').Router() ;
const { addClientHistory , searchClientHistorys ,getClientHistorys ,updateClientHistory, isNumberAvailable, deleteClientHistory } = require("../controller/clientHistory.controller")

clientHistoryRoutes.get('/AllClientHistorys',isAuth('ALL'),getClientHistorys) 
clientHistoryRoutes.post('/AddClientHistory',isAuth('ALL'),addClientHistory)
clientHistoryRoutes.put('/UpdateClientHistory',uploadMixOfFiles([{name: 'registrationFile', maxCount:1 },{name: 'licenseFile', maxCount:1 },{name: 'certificateFile', maxCount:1 }],'clientHistory'),isAuth('ALL'),updateClientHistory)
clientHistoryRoutes.get('/SearchClientHistory',isAuth('ALL'),searchClientHistorys) ;
clientHistoryRoutes.delete('/DeleteClientHistory',isAuth('ALL'),deleteClientHistory) ;
clientHistoryRoutes.post('/IsNumberAvailable',isNumberAvailable) ; 

module.exports=clientHistoryRoutes;