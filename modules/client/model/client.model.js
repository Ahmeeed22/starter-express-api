const sequelize = require("../../../configrations/sequelize");
const Sequelize = require("sequelize");

const Client = sequelize.define("client", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});




// Hook before create user to hash password
Client.beforeCreate(async (client, options) => {
    console.log("Hooks: ", client.email);
});

module.exports = Client;
