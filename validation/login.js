const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  // this helps us test for an empty string using validator

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //check for empty fields
  if (Validator.isEmpty(data.email)) errors.email = "Email field is required";
  if (Validator.isEmpty(data.password))
    errors.password = "Password field is required";

  //check for valid email
  if (!Validator.isEmail(data.email)) errors.email = "Email is invalid";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
