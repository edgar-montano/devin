const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};
  // this helps us test for an empty string using validator

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  //check for empty fields
  if (Validator.isEmpty(data.title)) errors.title = "title field is required";
  if (Validator.isEmpty(data.from)) errors.from = "from date field is required";
  if (Validator.isEmpty(data.company))
    errors.company = "company field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
