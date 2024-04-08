const sequelize = require("../configrations/sequelize");
const createTable=()=>{
    sequelize.sync(
        {alter: true}        
        ).then(async(result)=>{
            // await BankAccount.sync({ alter: true });
        console.log("connection success");
    }).catch((err)=>{
        console.log("err",err); 
        
    })  
}  
module.exports=createTable;        