const sequelize = require("../../../configrations/sequelize");
const Sequelize = require("sequelize");

const Client = sequelize.define("client", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    identity: {
        type: Sequelize.STRING,
        unique: true, 
    },
    birthDate: {
        type: Sequelize.DATEONLY,
    },
    phoneNumber: {
        type: Sequelize.STRING,
        unique: true, 
    }
});

// Hook before create user to hash password
Client.beforeCreate(async (client, options) => {
    console.log("Hooks: ", client.email);
});

module.exports = Client;
