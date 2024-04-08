// handle syntax error 
process.on('uncaughtException',err=>{
    console.log(err);
})

// winston
const express= require("express");
require("dotenv").config(); 
const createTable = require("./modules");
const User = require("./modules/users/model/user.model");
const clientRoutes = require("./modules/client/routes/client.routes");
const cookieParser=require('cookie-parser');
const companyRoutes = require("./modules/companies/routes/company.routes");
const Company = require("./modules/companies/model/company.model");
const AppError = require("./helpers/AppError");
const winston = require("winston/lib/winston/config");
const LoggerService = require("./services/logger.service");
var cors = require('cors');

const Client = require("./modules/client/model/client.model");
const ClientHistory = require("./modules/clinetHistory/model/clientHistory.model");
const userRoutes = require("./modules/users/routes/user.routes");
const clientHistoryRoutes = require("./modules/clinetHistory/routes/clientHistory.routes");
const Employee = require("./modules/employees/model/employee.model");
const employeeRoutes = require("./modules/employees/routes/employee.routes");
const Car = require("./modules/cars/model/car.model");
const carRoutes = require("./modules/cars/routes/car.routes");

const app =express();
app.use(cors())
app.use(express.json());

// wiston
const logger=new LoggerService('user.controller')
const loggerError=new LoggerService('error.general')
const loggerRoute=new LoggerService('error.route')


    Company.hasMany(Client,{
        foreignKey :'company_id'
    }) ;
    Client.belongsTo(Company, { 
        foreignKey: 'company_id', 
    });

    User.hasMany(Client,{
        foreignKey :'admin_id'
    }) ;
    Client.belongsTo(User, { 
        foreignKey: 'admin_id',
    });


    Client.hasMany(ClientHistory,{
        foreignKey : 'client_id' 
    })
    ClientHistory.belongsTo(Client,{
        foreignKey : 'client_id'
    })

    ClientHistory.hasMany(Employee,{
        foreignKey : 'clientHistory_id' 
    })
    Employee.belongsTo(ClientHistory,{
        foreignKey : 'clientHistory_id'
    })

    ClientHistory.hasMany(Car,{
        foreignKey : 'clientHistory_id' 
    })
    Car.belongsTo(ClientHistory,{
        foreignKey : 'clientHistory_id'
    })
   

  
 
app.use(cookieParser());
createTable();
const port=process.env.PORT ; 
app.use('/api/v1/Client',clientRoutes);   
app.use('/api/v1/User',userRoutes);
app.use('/api/v1/Company',companyRoutes);
app.use('/api/v1/ClientHistory',clientHistoryRoutes)
app.use('/api/v1/Employee',employeeRoutes);
app.use('/api/v1/Car',carRoutes);



// handle wronge routes 
app.all("*",(req,res,next)=>{
    loggerRoute.error(`can not find this route : ${req.originalUrl} on serve`)
    next(new AppError(`can not find this route : ${req.originalUrl} on serve `,404))
})

// global error handling middleware
app.use((error , req ,res , next)=>{
    error.statusCode=error.statusCode || 500
    if (process.env.MODE_ENV === 'DEVELOP') {
        loggerError.error(`error`,{status:error.statusCode,message:error.message,error,stack:error.stack})
        res.status(error.statusCode)
        .json({status:error.statusCode,message:error.message,error,stack:error.stack})
    }else{
        loggerError.error(`error`,{status:error.statusCode,message:error.message,error,stack:error.stack})
        res.status(error.statusCode)
        .json({status:error.statusCode,message:error.message,error})
    }
})
// Owners
app.listen(process.env.PORT||3000, () => {   
    console.log(`Server started on port ${port}`);
});
// handle outside express
process.on('unhandledRejection',err=>{
    console.log('unhandledRejection',err); 
})      
  