// require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handleSocketConnection = require("./socket");
const cors = require("cors");
const path = require('path');
const app = express();
const server = http.createServer(app);

mongoose.connect(
  "mongodb+srv://antenmanuuel:anten2001@cluster0.aaqyrxt.mongodb.net/test"
); //changed to ipv4

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/build')));




// for making requests from client side application
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// import routers
const gamesRouter = require("./routers/games-router");
const userRouter = require("./routers/users-router");

// use routers
app.use("/games", gamesRouter);
app.use("/users", userRouter);

// socket handlers
handleSocketConnection(server);

// start server
// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});