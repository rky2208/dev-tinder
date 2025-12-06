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

module.exports = signUpDataValidation;
