const express = require("express");
const userRouter = express.Router();
const mod = require("../models");
const User = mod["User"];
const fs = require("fs");
const path = require("path");

// returns all user records
userRouter.get("/", async (req, res) => {
  try {
    const user = await User.find();
    console.log("All users", user);
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.get("/login", (req, res) => {
  let existingUsername = req.cookies.username;
  if (!existingUsername) {
    existingUsername = randomUsername();
  }

  try {
    const newUser = new User({ username: existingUsername });
    newUser.save().catch((err) => console.log("user already exists"));
    
    // Adjust cookie settings for secure transmission
    res.cookie("username", existingUsername, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // Use 'none' for cross-site requests, 'lax' for same-site requests
    }).status(200).json({ username: existingUsername });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// finds user with id
userRouter.get("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// creates user
userRouter.post("/", async (req, res) => {
  let user = new User({
    username: req.body.username,
    games: req.body.games,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const randomUsername = () => {
  const filePath = path.resolve(__dirname, "../5_letter_words.txt");
  let words = fs.readFileSync(filePath, "utf-8").split(/[\r\n]+/);
  let randomNumber = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  let randomUsername = `${words[Math.floor(Math.random() * words.length)]}${
    words[Math.floor(Math.random() * words.length)]
  }${randomNumber}`;
  return randomUsername;
};

module.exports = userRouter;
