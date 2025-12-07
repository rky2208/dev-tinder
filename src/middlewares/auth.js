const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const authenticateUser = async (req, res, next) => {
  try {
    // Read Cookies
    const { token } = req.cookies;

    if (!token) {
      throw Error("Token is not valid!!");
    }

    //validate token
    const decodedJwtObj = jwt.verify(token, "JWT@123");
    const { _id } = decodedJwtObj;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      message: `Error:: ${err}`,
    });
  }
};

module.exports = authenticateUser;
