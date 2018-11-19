const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  // this helps us test for an empty string using validator

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  //check for empty fields
  if (Validator.isEmpty(data.school))
    errors.school = "school field is required";
  if (Validator.isEmpty(data.degree))
    errors.degree = "degree date field is required";
  if (Validator.isEmpty(data.from)) errors.from = "from date field is required";
  if (Validator.isEmpty(data.fieldofstudy))
    errors.fieldofstudy = "field of study field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
