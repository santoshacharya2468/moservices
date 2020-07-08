const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mailer=require("nodemailer");
const User = require("../models/user");
router.post("/register", async (req, res) => {
  var { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "email or password invalid user" +user});
    }
    let result = bcrypt.compare(password, user.password);
    if (result) {
      try {
        let token = jsonwebtoken.sign(
          { email: user.email, id: user._id },
          "53465FDSFf##%#%$%",
          {
            expiresIn: "30 days",
          }
        );
        res.json({ token: token, id: user._id });
      } catch (error) {
        res.status(401).json({ message: "email or password invalid bcrypt" +error});
      }
    }
  } catch (error) {
    res.status(401).json({ message: "email or password invalid server" +error});
  }
});
var transport = mailer.createTransport({
  service: "gmail",
  auth: {
    "user": process.env.email,
    "pass": process.env.password,
  }
});

router.post("/reset/:email",async(req,res)=>{
  try{
    var user=await User.findOne({email:req.params.email});
    var token = require('crypto').randomBytes(32).toString('hex');
    if(user!=null){
      var mailOptions = {
        from: process.env.email,
        to: user.email,
        subject: "Password reset link",
        text: token
      };
      await  transport.sendMail(mailOptions);
      await  User.findOneAndUpdate({email:user.email},{token:token});
      res.send({message:"Check your mail box"});
    }
    else{
      res.status(404).send({message:"User not found"});
    }
  }
  catch(e){console.log("error sending mail "+e)};
});
router.post("/verify_account/:token",async(req,res)=>{
  try{
    if(req.params.token!=null){
    var user=await User.findOne({accountToken:req.params.token});
    if(user!=null){
      await User.findOneAndUpdate({email:user.email},{email_verified:true,accountToken:null});

    }
    else{
      res.status(409).send({message:"Verification token could not be found for your account"});
    }
    res.send("Account verified sucessfully");
    }
    res.status(500).send({message:"Error verifying your account"});
  }
  catch(e){
    res.status(500).send({message:"Error verifying your account"});
  };
});
router.post("/login", async (req, res) => {
  var { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user != null) {
      var isAdmin=user.isAdmin ||false;
      try {
        let status = await bcrypt.compare(password, user.password);
        if (status) {
          try {
            let token = jsonwebtoken.sign(
              { email: user.email, id: user._id,isAdmin:isAdmin},
              "53465FDSFf##%#%$%",
              {
                expiresIn: "60 days",
              }
            );
            res.json({ token: token, id: user._id,isAdmin:isAdmin});
          } catch (e) {
            res.status(500).send({ message: "Error signin...."});
          }
        } else {
          res.status(401).send({ message: "Email/password error...." });
        }
      } catch (e) {
        res.status(401).send({ message: "Email/password error...." });
      }
    } else {
      res.status(401).send({ message: "Email/password error...." });
    }
  } catch (e) {
    res.status(500).send({ message: "Server error try again..." });
  }
});
module.exports = router;
