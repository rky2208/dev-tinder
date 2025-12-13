const express = require("express");
const authenticateUser = require("../middlewares/auth");
const ConnectionModel = require("../models/connection");
const UserModel = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/request/recieved", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const filter = {
      toUserId: loggedInUser._id,
      status: "interested",
    };

    const [totalCount, data] = await Promise.all([
      ConnectionModel.countDocuments(filter),
      ConnectionModel.find(filter).populate("fromUserId").limit(20).exec(),
    ]);

    res.json({
      message: "Success",
      count: totalCount,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error:${error.message}}`,
    });
  }
});

userRouter.get("/user/connections", authenticateUser, async (req, res) => {
  try {
    const ALLOW_TO_SHARE_NONSENTIVE = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "photoUrl",
    ];
    const loggedInUser = req.user;
    const connectionRecieved = await ConnectionModel.find({
      $and: [
        {
          $or: [
            { toUserId: loggedInUser._id },
            { fromUserId: loggedInUser._id },
          ],
        },
        { status: "accepted" },
      ],
    })
      .populate("fromUserId", ALLOW_TO_SHARE_NONSENTIVE)
      .populate("toUserId", ALLOW_TO_SHARE_NONSENTIVE);

    const result = connectionRecieved?.map((connection) => {
      if (connection.toUserId) return connection.toUserId;
      connection.fromUserId;
    });

    res.json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error:${error.message}}`,
    });
  }
});

userRouter.get("/user/feed", authenticateUser, async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    const pageSize = Math.min(parseInt(req.params.pageNumber) || 10, 50);
    const skip = (pageNumber - 1) * 10;
    const loggedInUser = req.user;
    const ALLOW_TO_SHARE_NONSENTIVE = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "photoUrl",
    ];
    // find all connection Request sent or recieved
    const connections = await ConnectionModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    //create set so to alway contains unique value so that incase duplicate from or to find only pick unique
    const hideTheUserAlreaydSentOrRecieved = new Set();
    connections.forEach((conn) => {
      hideTheUserAlreaydSentOrRecieved.add(conn.fromUserId.toString());
      hideTheUserAlreaydSentOrRecieved.add(conn.toUserId.toString());
    });

    const feedUsers = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideTheUserAlreaydSentOrRecieved) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(pageSize)
      .select(ALLOW_TO_SHARE_NONSENTIVE);
      
    res.json({
      data: feedUsers,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error: ${error.message}}`,
    });
  }
});

module.exports = userRouter;
