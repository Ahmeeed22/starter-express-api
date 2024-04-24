const sequelize = require("../../../configrations/sequelize");
const Sequelize = require("sequelize");
const Employee = sequelize.define("employee", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    iqamaImage: {
        type: Sequelize.STRING ,
        allowNull: true ,// Assuming it's a file path or URL to the image
        defaultValue : "https://ik.imagekit.io/2cvha6t2l9/logo.png?updatedAt=1713227861401"
    },
    healthCertificate: {
        type: Sequelize.STRING ,
        allowNull: false
    },
    expiryDate: {
        type: Sequelize.DATEONLY ,
        allowNull: false,
    },
    identity: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    }
})


module.exports = Employee;