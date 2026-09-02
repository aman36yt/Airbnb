const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user.js");


router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser = new User({username,email});
        const requiredUser = await User.register(newUser,password);
        // console.log(requiredUser);
        req.flash("success","Welcome to NUVORA!");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
    wrapAsync(async(req,res)=>{
    req.flash("success","Welcome Back to LUVORA!");
    res.redirect("/listings");
}));

module.exports = router;