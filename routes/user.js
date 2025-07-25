const express=require("express");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router=express.Router();
const controlleruser=require("../controllers/users");

router.route("/signup")
.get(controlleruser.rendersignup)
.post(controlleruser.signupnewuser);

router.route("/login")
.get(controlleruser.renderlogin)
.post( saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), controlleruser.redirectourl);

//logout route
router.get("/logout",controlleruser.logout);

module.exports=router;