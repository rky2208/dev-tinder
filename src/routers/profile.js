const express = require("express");
const authenticateUser = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
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
        message:"Profile updated successfull!!"
    });
  } catch (err) {
    res.status(400).json({
      message: `Update Error:: ${err}`,
    });
  }
});

module.exports = profileRouter;
