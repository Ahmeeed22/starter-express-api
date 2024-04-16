const { Sequelize } = require("sequelize");
const sequelize = require("../../../configrations/sequelize");

const Note = sequelize.define('note', {
    id : {
        type :Sequelize.INTEGER ,
        autoIncrement :true ,
        primaryKey :true
    },
    desc :{
        type :Sequelize.STRING ,
    },
    active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
});

module.exports =Note ;