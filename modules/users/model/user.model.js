const sequelize = require("../../../configrations/sequelize");
const Sequelize=require("sequelize");
const User=sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
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
      roleId : {
        type :Sequelize.INTEGER,
        defaultValue : 1
      },
      role: {
        type: Sequelize.STRING,
        defaultValue : "Admin"
      },
      active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
     permissions: {
      type: Sequelize.TEXT, // Assuming TEXT data type for JSON serialization
      defaultValue: JSON.stringify(['Pages.Client.List']), // Default value as JSON string
      allowNull: false 
    }
})

// Hook before create user to hash password
User.beforeCreate(async (user, options) => {
  console.log("hoooooooooks " , user.email );   
});


module.exports=User;