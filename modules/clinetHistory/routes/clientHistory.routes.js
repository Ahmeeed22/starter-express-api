const isAuth = require('../../../common/middleare/isAuth')

const clientHistoryRoutes=require('express').Router() ;
const { addClientHistory , searchClientHistorys ,getClientHistorys ,updateClientHistory } = require("../controller/clientHistory.controller")

clientHistoryRoutes.get('/AllClientHistorys/:client_id',isAuth('ALL'),getClientHistorys) 
clientHistoryRoutes.post('/AddClientHistory',isAuth('ALL'),addClientHistory)
clientHistoryRoutes.put('/UpdateClientHistory/:id',isAuth('ALL'),updateClientHistory)
clientHistoryRoutes.get('/SearchClientHistory',isAuth('ALL'),searchClientHistorys)

module.exports=clientHistoryRoutes;