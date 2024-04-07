const isAuth = require('../../../common/middleare/isAuth')

const clientHistoryRoutes=require('express').Router() ;
const { addClientHistory , searchClientHistorys ,getClientHistorys ,updateClientHistory, isNumberAvailable } = require("../controller/clientHistory.controller")

clientHistoryRoutes.get('/AllClientHistorys',isAuth('ALL'),getClientHistorys) 
clientHistoryRoutes.post('/AddClientHistory',isAuth('ALL'),addClientHistory)
clientHistoryRoutes.put('/UpdateClientHistory',isAuth('ALL'),updateClientHistory)
clientHistoryRoutes.get('/SearchClientHistory',isAuth('ALL'),searchClientHistorys) ;
clientHistoryRoutes.post('/IsNumberAvailable',isNumberAvailable) ; 

module.exports=clientHistoryRoutes;