const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    //1. Data Validation
    validateSignUpData(req);

    //2. Encrypt Password
    const {
      emailAddress,
      firstName,
      lastName,
      age,
      gender,
      skills,
      about,
      photoUrl,
      password,
    } = req.body || {};
    pswrdHash = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      age,
      about,
      gender,
      skills,
      photoUrl,
      emailAddress,
      password: pswrdHash,
    });
    await user.save();
    res.send({
      message: "Account Created Successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: `Singup Error:: ${err}`,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailAddress, password } = req.body || {};
    //validate emailAddress exist or not
    const user = await UserModel.findOne({ emailAddress: emailAddress });
    if (!user) {
      throw Error("Invalid Credentialssssss");
    }
    // validated password
    const isValidPswrd = user.validatePassword(password);
    if (!isValidPswrd) {
      throw Error("Invalid Credentials...");
    }

    // create unique token
    const token = user.createToken();
    // Set Cookies: token
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
    });
    res.json({
      message: "Successfully logged IN",
    });
  } catch (err) {
    res.status(400).json({
      message: `LogedIn Error:: ${err}`,
    });
  }
});

authRouter.post("/logout", (_req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({
    message: "Logged out successfully!",
  });
});

module.exports = authRouter;
