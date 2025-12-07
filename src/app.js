const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");

const appClient = new express();
appClient.use(express.json());
appClient.use(cookieParser());

appClient.use(authRouter);
appClient.use(profileRouter);

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
