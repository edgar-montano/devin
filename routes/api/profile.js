const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//validation import
const validateProfileInupt = require("../../validation/profile");
const validateExperienceInupt = require("../../validation/experience");
const validateEducationInupt = require("../../validation/education");

// @route       GET api/profile/test
// @desc        Test post route
// @access      public
router.get("/test", (req, res) =>
  res.json({
    msg: "Profile works"
  })
);

// @route       GET api/profile
// @desc        Get current users profile
// @access      private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        } else {
          res.json(profile);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route       Get api/profile/handle/:handle
// @desc        Get profile by handle
// @access      public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route       Get api/profile/profile/all
// @desc        Get all profile
// @access      public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles for this site";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profiles: "There are no profiles" });
    });
});

// @route       Get api/profile/user/:user_id
// @desc        Get profile by user id
// @access      public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route       POST api/profile
// @desc        Create or edit user profile
// @access      private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validate input and respond with errors
    const { errors, isValid } = validateProfileInupt(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields for profile
    const profileFields = {};
    profileFields.user = req.user.id;

    //checking to see if sent from form
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Array of skills
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // social fields
    profileFields.social = {}; // must initialize social field before adding to it
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      //this means that this is a profile update not a profile create request
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      }
      //this means its a create
      else {
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exists";
            res.status(400).json(errors);
          }
          //save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route       Post api/profile/experience
// @desc        Add experience to prpfile
// @access      private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate experience input
    const { errors, isValid } = validateExperienceInupt(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //search for user profile and create a new experience to push to profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExperience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to experience array
      //use unshift to add experience to top
      profile.experience.unshift(newExperience);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route       Delete api/profile/experience/:exp_id
// @desc        Delete experience from prpfile
// @access      private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //search for user profile and create a new experience to push to profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      // Remove the proper index from array of experience
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      //splice out of array
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route       Post api/profile/education
// @desc        Add education to prpfile
// @access      private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //validate experience input
    const { errors, isValid } = validateEducationInupt(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //search for user profile and create a new education to push to profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to experience array
      //use unshift to add experience to top
      profile.education.unshift(newEducation);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route       Delete api/profile/education/:edu_id
// @desc        Delete education from prpfile
// @access      private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //search for user profile and create a new experience to push to profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      // Remove the proper index from array of experience
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      //splice out of array
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route       Delete api/profile
// @desc        Delete user and profile
// @access      private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.secure.id })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(404).json(err));
    });
  }
);

module.exports = router;
