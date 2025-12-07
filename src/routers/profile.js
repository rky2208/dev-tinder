const express = require("express");
const bcrypt = require("bcrypt");
const authenticateUser = require("../middlewares/auth");
const {
  validateEditProfileData,
  validatePasswordResetData,
} = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.patch("/profile/edit", authenticateUser, async (req, res) => {
  const loggedInUser = req.user;

  try {
    if (!validateEditProfileData(req)) {
      throw Error("You are not allowed to update all fields");
    }
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send({
      message: "Profile updated successfull!!",
    });
  } catch (err) {
    res.status(400).json({
      message: `Update Error:: ${err}`,
    });
  }
});

profileRouter.patch("/profile/password", authenticateUser, async (req, res) => {
  try {
    const { password } = req.body || {};
    validatePasswordResetData(password);
    const loggedInUser = req.user;
    const isPswrdMatching = await loggedInUser.validatePassword(password);

    if (isPswrdMatching) {
      throw Error("New password can't be same as previous one");
    }
    pswrdHash = await bcrypt.hash(password, 10);

    loggedInUser.password = pswrdHash;
    loggedInUser.save();
    res.send({
      message: "Password Reset Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error::" + error,
    });
  }
});

module.exports = profileRouter;
