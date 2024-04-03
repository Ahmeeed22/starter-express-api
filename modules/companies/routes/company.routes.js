const isAuth = require('../../../common/middleare/isAuth')
const validationRequest = require('../../../common/middleare/validationRequest')
const { addcompany ,deletecompany ,getAllcompanys ,searchcompanys ,updatecompany} = require('../controller/company.controller')
const { addCompanySchema } = require('../joi/company.validation')

const companyRoutes=require('express').Router()

companyRoutes.get('/AllCompanies',isAuth('ADMIN'),getAllcompanys)
companyRoutes.post('/AddCompany',isAuth('ADMIN'),validationRequest(addCompanySchema),addcompany)
companyRoutes.put('/UpdateCompany/:id',isAuth('ADMIN'),validationRequest(addCompanySchema),updatecompany)
companyRoutes.delete('/DeleteCompany/:id',isAuth('ADMIN'),deletecompany)
companyRoutes.get('/SearchCompany',isAuth('ADMIN'),searchcompanys)

module.exports=companyRoutes;