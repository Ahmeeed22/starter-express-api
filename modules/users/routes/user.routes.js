const userRoutes= require("express").Router();
const isAuth = require("../../../common/middleare/isAuth");
const validateRequest=require('../../../common/middleare/validationRequest')
const { getAllUsers, deleteUser, updateUser, addUser, getCurrentLoginInformations, search, login } = require("../controllers/user.controller");
const { addUserSchema, loginSchema, updateUserSchema } = require("../joi/user.validation");



userRoutes.get("/AllUsers",isAuth('ALL'),getAllUsers);
userRoutes.delete('/DeleteUser/:id',isAuth('ALL'),deleteUser);
userRoutes.put('/UpdateUser/:id',isAuth('ALL'),validateRequest(updateUserSchema),updateUser);
userRoutes.post('/AddUser',validateRequest(addUserSchema),addUser);
userRoutes.get('/GetCurrentLoginInformations',isAuth('ALL'),getCurrentLoginInformations)
userRoutes.get('/SearchUser',isAuth('ALL'),search)
userRoutes.post('/Login',validateRequest(loginSchema),login)


module.exports=userRoutes;
