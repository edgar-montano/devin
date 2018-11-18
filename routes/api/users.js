/* requires */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route       GET api/users/test
// @desc        Test post route
// @access      public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users works"
  })
);

// @route       GET api/users/register
// @desc        Test post route
// @access      public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check if input is valid
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      //create avatar icon based on email
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" // default
      });
      //create new user to save to database
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // encrypt the password with bcrypt
      bcrypt.genSalt(8, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //throw error if hash was not successful, otherwise set password
          //as the new hash
          if (err) throw err;
          newUser.password = hash;
          //save new user to mongodb
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route       GET api/users/login
// @desc        Login user / returning jwt token
// @access      public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //check if input is valid
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(passwordMatched => {
      if (passwordMatched) {
        // Payload required for json web token to sign
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //web token is signed with a bearer signature, token expires in 1 hour
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
        //res.json({ msg: "Success" });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route       GET api/users/current
// @desc       Return current user
// @access      private
router.post(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
