const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
  // this helps us test for an empty string using validator

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!(Validator.isLength(data.text), { min: 2, max: 300 })) {
    errors.text = "Text must be between 2 and 300 characters";
  }
  //check for empty fields
  if (Validator.isEmpty(data.text)) errors.text = "Text field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
