const sequelize = require("../../../configrations/sequelize");
const Sequelize = require("sequelize");
const Car = sequelize.define("car", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    workPermitCard: {
        type: Sequelize.STRING ,
        unique: true,
    },
    expiryDate: {
        type: Sequelize.DATEONLY
    },
    insuranceExpiryDate: {
        type: Sequelize.DATEONLY
    },
    formImage: {
        type: Sequelize.STRING
    }
})


module.exports = Car;