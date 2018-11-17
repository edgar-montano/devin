/* Requires */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const gravatar = require("gravatar");
const passport = require("passport");
/* Routes */
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

/* Variables */
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
const db = require("./config/keys").mongoURI;

//passport
app.use(passport.initialize());
require("./config/passport")(passport);

// app.get("/", (req, res) => res.send("hello"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));
