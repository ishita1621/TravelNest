const express=require('express');
const router=express.Router(); //to get access to params of parent route
const User=require('../models/user.js');
const wrapAysnc = require('../utils/wrapAysnc');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/users.js')

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAysnc(userController.signUp));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }),userController.login)

router.get('/logout',userController.logout);

module.exports=router;