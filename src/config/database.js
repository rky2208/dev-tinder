const mongoose = require("mongoose");
const clusterUri =
  "mongodb+srv://raj901655_db_user:Bwc80fNZfTNLn7Dt@namastenode.kcgzzhe.mongodb.net";

const connectDB = async () => {
  const DBurl = `${clusterUri}/devTinder`;
  try {
    console.log("connecting DB.....")
    return await mongoose.connect(DBurl);
  } catch (err) {
    console.log("Failed to connect DB:", err);
  }
};

module.exports = {
  connectDB,
};
