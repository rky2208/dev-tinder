const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const authenticateUser = async (req, res, next) => {
  try {
    // Read Cookies
    const { token } = req.cookies;

    if (!token) {
      throw Error("Token not exist!!");
    }

    //validate token
    const decodedJWT = jwt.verify(token, "JWT@123");
    const user = await UserModel.findById(decodedJWT._id);
    if (user?.length === 0) {
      res.status(404).send("User Not Exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: Issue while authentication");
  }
};

module.exports = authenticateUser;
