const express = require("express");
const { connectDB } = require("./config/database");
const UserModel = require("./models/user");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");

const appClient = new express();
appClient.use(express.json());

const ALLOWED_UPDATE_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "skills",
  "about",
  "photoUrl",
];

appClient.post("/signUp", async (req, res) => {
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
      password
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
    res.send("Created..");
  } catch (err) {
    res.status(404).send(`Error while singup bad request:${err}`);
  }
});

appClient.get("/login", async (req, res) => {
  try {
    const { emailAddress, password } = req.body || {};
    //validate emailAddress exist or not
    const user = await UserModel.findOne({ emailAddress: emailAddress });
    if (!user) {
      throw Error("Invalid Credentialssssss");
    }
    // validated password
    const isValidPswrd = await bcrypt.compare(password, user.password);
    if (!isValidPswrd) {
      throw Error("Invalid Credentials...");
    }
    res.send("Successfully logged IN");
  } catch (err) {
    res.status(400).send("Bad Request:" + err);
  }
});

appClient.get("/user", async (req, res) => {
  try {
    // const users =  await UserModel.find({lastName:req.body.lastName}) // incase of more than one find all matching

    const user = await UserModel.findOne({ lastName: req.body.lastName }); // first occurence
    if (user.length === 0) {
      res.status(404).send("User Not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while findind bad request", err);
  }
});

appClient.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    // const users =  await UserModel.find({_id:userId}) // incase of more than one find all matching

    await UserModel.findOneAndDelete(userId);
    res.send("Deleted successfully");
  } catch (err) {
    res.status(400).send("Error while deleting bad request", err);
  }
});

appClient.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  try {
    const data = req.body;
    const hasAnyNotAllowedData = Object.keys?.(data)?.every(
      (field) => !ALLOWED_UPDATE_FIELDS.includes(field)
    );
    if (hasAnyNotAllowedData) {
      throw "There is some data which is not allowed to udpate";
    }
    //const fName = req.body.firstName;
    //await UserModel.findByIdAndUpdate(userId, { firstName: fName });
    //await UserModel.findOneAndUpdate({_id:userId, firstName: fName })
    await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    res.send("Updated...");
  } catch (err) {
    res.status(400).send("Error while updating bad request" + err);
  }
});

appClient.get("/feed", async (req, res) => {
  try {
    const user = await UserModel.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while finding");
  }
});

const main = async () => {
  const res = await connectDB();
  if (res) {
    console.log("DB------connected");
  }
  appClient.listen(3000, () => {
    console.log("server started & listening at port 3000 ....");
  });
};
main();
