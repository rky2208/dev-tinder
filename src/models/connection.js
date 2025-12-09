const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is not supported",
      },
      lowercase: true,
    },
  },
  { timestamps: true }
);

ConnectionSchema.index({ fromUserId: 1, toUserId: 1 });
ConnectionSchema.pre("save", function () {
  const connectionUser = this;
  if (connectionUser.fromUserId.equals(connectionUser.toUserId)) {
    throw Error("You can't send the request to yourself");
  }
});

ConnectionModel = mongoose.model("Connections", ConnectionSchema);

module.exports = ConnectionModel;
