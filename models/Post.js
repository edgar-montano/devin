const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  // the fields below are used for the case where if a user
  // decides to delete their account we still maintain a reference to them
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
