// NOTE: replaces lo-dash is-empty method to reduce clutter of library

/*
Checks to see if value is undefined, null, empty object or empty string 
*/
const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

module.exports = isEmpty;
