const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [2, "min character require for firstName is 2"],
      maxLength: [20, "max character allowed for firstName is 20"],
      required: true,
    },
    lastName: {
      type: String,
      maxLength: 30,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      // by default this will only run when a new document(entry) create, means post, but if we want to enable
      // for patch,put--> in the update method needs to enable validator as true
      validate: (value) => {
        if (!["male", "female", "Others"].includes(value)) {
          throw new Error("Invalid gender type");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This your default bio",
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-user&psig=AOvVaw1HiegERFQvmZpn6GBZLJAZ&ust=1765123038428000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKinifCpqZEDFQAAAAAdAAAAABAE",
      validate(val) {
        if (!validator.isURL(val)) {
          throw Error("Invalid photo url");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isValidPswrd = await bcrypt.compare(password, passwordHash);

  return isValidPswrd;
};

userSchema.methods.createToken = function () {
  const user = this;
  const userId = user.id;
  const token = jwt.sign({ _id: userId }, "JWT@123", {
    expiresIn: "1d",
  });

  return token;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
