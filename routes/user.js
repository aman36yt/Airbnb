const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user.js");
const { isLoggedin } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware.js");

const usersController = require("../controllers/users.js");

router
    .route("/signup")
    .get(usersController.signupForm)
    .post(wrapAsync(usersController.createUser)
);


router
    .route("/login")
    .get(usersController.loginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local",{
            failureRedirect:"/login",
            failureFlash:true
        }),
    wrapAsync(usersController.userAuthenticate)
);

router.get("/logout",usersController.logOut);

module.exports = router;