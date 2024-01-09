const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const studentRoute = require("./routes/studentRoutes.js");
const mentorRoute = require("./routes/mentorRoutes.js");

const app = express();
const PORT = process.env.PORT;

//Inbuilt middleware
app.use(express.json());
app.use(cors());

//Home
app.get("/", (req, res) => {
  res.send("Welcome to Mentor Assign for Student Website");
});

//Mongoose DB connection with Mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongoose is connected");
    app.listen(PORT, () => console.log("Server started on port", PORT));
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.use("/students", studentRoute);
app.use("/mentors", mentorRoute);
