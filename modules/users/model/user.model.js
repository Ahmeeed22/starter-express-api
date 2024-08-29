const sequelize = require("../../../configrations/sequelize");
const Sequelize=require("sequelize");
const User=sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    identity: {
        type: Sequelize.STRING,
        unique: true, 
    },
    name: {
        type: Sequelize.STRING,
        defaultValue: "user", 
    },
    birthDate: {
        type: Sequelize.DATEONLY,
    },
    phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
    } ,
    countryCode : {
        type : Sequelize.STRING,
        defaultValue : "+966"
    },
    email: {
        type: Sequelize.STRING,
      },
    password: {
        type: Sequelize.STRING,
      },
      active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
     permissions: {
      type: Sequelize.TEXT, // Assuming TEXT data type for JSON serialization
      defaultValue: JSON.stringify(['Pages.Client.List','Pages.Client.Edit','Pages.Statistics','Pages.Client.Add','Pages.ClientHistory.List','Pages.ClientHistory.Add','Pages.ClientHistory.Edit','Pages.Employee.List','Pages.Employee.Edit','Pages.Employee.Delete','Pages.Employee.Add','Pages.Car.Add','Pages.Car.Edit','Pages.Car.List','Pages.Car.Delete']), // Default value as JSON string
      allowNull: false 
    } ,
    admin_id: {
      type: Sequelize.INTEGER,
      allowNull: true // Allow null for users of type 'Admin'
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
})

// Hook before create user to hash password
User.beforeCreate(async (user, options) => {
  console.log("hoooooooooks " , user.email );   
}); 


module.exports=User;