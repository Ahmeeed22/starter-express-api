const { Sequelize } = require("sequelize");
const sequelize = require("../../../configrations/sequelize");
const ClientHistory = sequelize.define('clientHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    number: {
        type: Sequelize.STRING,
        allowNull: false ,
        unique: true, 
    },
    expireDate: {
        type: Sequelize.DATEONLY
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    licenseNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    licenseDate: {
        type: Sequelize.DATE
    },
    certificateNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    certificateDate: {
        type: Sequelize.DATE
    },
    medicalInsuranceNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    medicalInsuranceDate: {
        type: Sequelize.DATE
    },
    businessLicenseNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    businessLicense: {
        type: Sequelize.STRING,
        allowNull: true
    },
    registrationFile: {
        type: Sequelize.STRING,
        allowNull: true
    },
    licenseFile: {
        type: Sequelize.STRING,
        allowNull: true
    },
    certificateFile: {
        type: Sequelize.STRING,
        allowNull: true ,
        defaultValue : "https://ik.imagekit.io/2cvha6t2l9/logo.png?updatedAt=1713227861401"
    }
});
   
module.exports=ClientHistory ;