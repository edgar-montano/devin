/* Requires */
const express = require("express");
const mongoose = require("mongoose");

/* Variables */
const app = express();
const port = process.env.PORT || 5000;

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello"));
app.listen(port, () => console.log(`Server running on port ${port}`));
