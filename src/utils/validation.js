const { isEmail, isStrongPassword } = require("validator");

function validateSignUpData(req) {
  //NOTE: schema level validation is sufficient if already added

  const { emailAddress, password } = req?.body || {};

  if (!isEmail(emailAddress)) {
    throw Error("Email address not allowed: Invalid email address");
  } else if (!isStrongPassword(password?.toString())) {
    throw Error("Password is weak enter strong password");
  }
}

function validateEditProfileData(req) {
  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys?.(req.body)?.every((field) =>
    ALLOWED_EDIT_FIELDS.includes(field)
  );
  return isEditAllowed;
}

function validatePasswordResetData(password) {
  if (!password) {
    throw Error("Password shoult not be empty, null or undefined");
  } else if (!isStrongPassword(password?.toString())) {
    throw Error("Password is weak enter strong password");
  }
}
module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validatePasswordResetData,
};
