/* Requires */
const express = require("express");
const mongoose = require("mongoose");

/* Routes */
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

/* Variables */
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("hello"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));
