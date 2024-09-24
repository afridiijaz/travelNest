const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { nextTick } = require("process");
const {isLoggedOut, saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
  .get(userController.renderSignupForm) //create sign up form
  .post(wrapAsync(userController.signup)); // sing up route


router.route("/login")
  .get( userController.renderLoginForm)
  .post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login',failureFlash:true }), userController.login)

router.get("/logout",isLoggedOut, userController.logout)

module.exports = router;