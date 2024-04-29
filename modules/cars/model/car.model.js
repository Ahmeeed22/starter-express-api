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
        type: Sequelize.STRING ,
        defaultValue :"https://ik.imagekit.io/2cvha6t2l9/logo.png?updatedAt=1713227861401",
        allowNull :false
    }
})


module.exports = Car;