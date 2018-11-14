const express = require("express");
const router = express.Router();

// @route       GET api/users/test
// @desc        Test post route
// @access      private
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works"
  })
);

module.exports = router;
