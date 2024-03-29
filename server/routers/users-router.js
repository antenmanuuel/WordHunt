const express = require("express");
const userRouter = express.Router();
const mod = require("../models");
const User = mod["User"];
const fs = require("fs");

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

// userRouter.get("/login", (req, res) => {
//   // Check if the user has a cookie with a key of "username"
//   let existingUsername = req.cookies.username;
//   if (!existingUsername)
//     // If the user does not have a cookie, generate a random username
//     existingUsername = randomUsername(); // subject to change

//   try {
//     const newUser = new User({
//       username: existingUsername,
//     });
//     newUser.save().catch((err) => {
//       console.log("user already exists");
//     });
//     // res.cookie("username", existingUsername).status(200).json({
//     //   username: existingUsername,
//     // });
//     res.cookie("username", existingUsername, { httpOnly: true, secure: true, sameSite: 'None' }).status(200).json({ username: existingUsername });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
userRouter.get("/login", async (req, res) => {
  let existingUsername = req.cookies.username;
  if (!existingUsername) {
    existingUsername = randomUsername();
  }

  try {
    const newUser = new User({ username: existingUsername });
    await newUser.save();
    res.cookie("username", existingUsername, { httpOnly: true, secure: true, sameSite: 'None' }).status(200).json({ username: existingUsername });
  } catch (err) {
    console.log(err);
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
  let words = fs
    .readFileSync("../5_letter_words.txt", "utf-8")
    .split(/[\r\n]+/);
  let randomNumber = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  let randomUsername = `${words[Math.floor(Math.random() * words.length)]}${
    words[Math.floor(Math.random() * words.length)]
  }${randomNumber}`;
  console.log("user name here",randomUsername);
  return randomUsername;
};

module.exports = userRouter;
