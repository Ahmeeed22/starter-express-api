const isAuth = require('../../../common/middleare/isAuth');
const { createRole } = require('../controller/roles.controller');

const rolesRoutes=require('express').Router() ;

rolesRoutes.post("/AddRole",isAuth('ALL'),createRole) ;

module.exports=rolesRoutes ;  