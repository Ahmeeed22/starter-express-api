const { Sequelize } = require("sequelize");
const sequelize = require("../../../configrations/sequelize");

const Role = sequelize.define('role', {
    id : {
        type :Sequelize.INTEGER ,
        autoIncrement :true ,
        primaryKey :true
    },
    name :{
        type :Sequelize.STRING ,
    },
    active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
});

module.exports =Role ;