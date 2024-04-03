const { Sequelize } = require("sequelize");
const sequelize = require("../../../configrations/sequelize");
const ClientHistory =sequelize.define('clientHistory',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false ,
    },
    number:{
        type:Sequelize.STRING,
        allowNull:false ,
    },
    expireDate: {
        type: Sequelize.DATEONLY,
    },
    active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    }
});
   
module.exports=ClientHistory ;