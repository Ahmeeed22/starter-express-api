const userRoutes= require("express").Router();
const isAuth = require("../../../common/middleare/isAuth");
const validateRequest=require('../../../common/middleare/validationRequest')
const { getAllUsers, deleteUser, updateUser, addUser, getCurrentLoginInformations, search, login } = require("../controllers/user.controller");
const { addUserSchema, loginSchema, updateUserSchema } = require("../joi/user.validation");



userRoutes.get("/AllUsers",isAuth('ADMIN'),getAllUsers);
userRoutes.delete('/DeleteUser/:id',isAuth('ADMIN'),deleteUser);
userRoutes.put('/UpdateUser/:id',isAuth('ADMIN'),validateRequest(updateUserSchema),updateUser);
userRoutes.post('/AddUser',validateRequest(addUserSchema),addUser);
userRoutes.get('/GetCurrentLoginInformations/:id',getCurrentLoginInformations)
userRoutes.get('/SearchUser',isAuth('ADMIN'),search)
userRoutes.post('/Login',validateRequest(loginSchema),login)


module.exports=userRoutes;
