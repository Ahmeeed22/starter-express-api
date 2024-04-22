const profileRoutes= require("express").Router();
const isAuth = require("../../../common/middleare/isAuth");
const validateRequest=require('../../../common/middleare/validationRequest');
const { updateProfile } = require("../controllers/profile.controller");
const { updateUserSchema } = require("../joi/profile.validation");

// profileRoutes.get("/AllUsers",isAuth('ALL'),getAllUsers);
// profileRoutes.delete('/DeleteUser/:id',isAuth('ALL'),deleteUser);
profileRoutes.put('/UpdatePersonalData',isAuth('ALL'),validateRequest(updateUserSchema),updateProfile);
// profileRoutes.post('/AddUser',validateRequest(addUserSchema),addUser);
// profileRoutes.get('/GetCurrentLoginInformations',isAuth('ALL'),getCurrentLoginInformations)
// profileRoutes.get('/SearchUser',isAuth('ALL'),search)
// profileRoutes.post('/Login',validateRequest(loginSchema),login);
// profileRoutes.put('/ChangePassword',isAuth('ALL'),changePassword)


module.exports=profileRoutes;
