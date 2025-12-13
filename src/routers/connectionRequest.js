const express = require("express");
const mongoose = require("mongoose");
const authenticateUser = require("../middlewares/auth");
const UserModel = require("../models/user");
const ConnectionModel = require("../models/connection");

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:userId",
  authenticateUser,
  async (req, res) => {
    try {
      const toUserId = req.params.userId;
      const status = req.params.status;
      const fromLoggedInUser = req.user;
      const { _id: fromUserId } = fromLoggedInUser;
      //Validation1: check if toUserId is correct objectId format
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw Error("Invalid ID format");
      }

      //Validation2: now check if status that they are sending is correct or not
      const ALLOWED_CONNECTION_SEND_TYPE = ["interested", "ignored"];
      if (!ALLOWED_CONNECTION_SEND_TYPE.includes(status)) {
        throw Error("status request is incorrect");
      }

      //Validation3: check is to user id even exist in db or not
      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        throw Error(
          "the connection to user which your are trying to send that user does not exist!"
        );
      }

      //validation 4: is already send the request A to B or B to A
      const isExisitngConnectionReq = await ConnectionModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      console.log(isExisitngConnectionReq);

      if (isExisitngConnectionReq) {
        throw Error("Connection request already exists");
      }

      await ConnectionModel({
        fromUserId,
        toUserId,
        status,
      }).save();

      res.send({
        message: `${status} successfully to ${toUser.firstName}!!`,
      });
    } catch (error) {
      res.status(400).send("Error:" + error.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  authenticateUser,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      //1. check valid object id or not
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw Error("Invalid format of reqId");
      }
      // 2. check only status allowed to be accepted, rejected
      const ALLOWED_CONNECTION_REVIEW_TYPE = ["accepted", "rejected"];
      if (!ALLOWED_CONNECTION_REVIEW_TYPE.includes(status)) {
        throw Error("invalid status type");
      }

      // 3. check is requestId, and also that request id should have only status as 'interested' and toUserId should be loggedIn userId
      const connectionRequest = await ConnectionModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        throw Error("No such connection request exist");
      }

      connectionRequest.status = status;
      connectionRequest.save();

      res.json({
        message: `You have ${status} the connection request`,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error:" + error.message,
      });
    }
  }
);

module.exports = connectionRouter;
