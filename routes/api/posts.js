//libraries
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
//models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
//validation
const validatePostInput = require("../../validation/post");

// @route   Get api/posts
// @desc    Get posts
// @access  public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopost: "No posts found" }));
});

// @route   Get api/posts/:id
// @desc    Get posts by id
// @access  public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopost: "No post found" }));
});

// @route   POST api/posts
// @desc    Create post
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.status(400).json(err));
  }
);

// @route   Delete api/posts/:id
// @desc    Delete post
// @access  private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            //console.log(`${post.user.toString()} is not ${req.user.id}`);
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          //delete
          post
            .remove()
            .then(() => res.json({ success: true }))
            .catch(err =>
              res.status(404).json({ postnotfound: "post not found" })
            );
        })
        .catch(err => res.status(400).json({ postnotfound: "post not found" }));
    });
  }
);

module.exports = router;
