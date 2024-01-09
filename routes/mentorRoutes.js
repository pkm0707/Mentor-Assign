const express = require("express");
const router = express.Router();
const mentorModel = require("../model/mentorModel.js");

router.post("/creatementor", async (req, res) => {
  try {
    const newMentor = new mentorModel({ ...req.body, verified: true });
    await newMentor.save();
    res.send("Mentor created successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

//get Mentor
router.get("/getmentors", async (req, res) => {
  try {
    const Mentors = await mentorModel.find();
    res.send(Mentors);
  } catch (error) {
    res.status(400).json(error);
  }
});

//get Mentor by Id
router.get("/getmentorsbyid", async (req, res) => {
  try {
    const Mentor = await mentorModel.findOne({ id: req.body.mentorId });
    res.send(Mentor);
  } catch (error) {
    res.status(400).json(error);
  }
});

//update Mentor by Id
router.post("/updatementorsbyid", async (req, res) => {
  try {
    const updatedMentor = await mentorModel.findOneAndUpdate(
      { id: req.body.id },
      req.body
    );
    res.send("Mentor updated successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete Mentor by Id
router.delete("/deletementorsbyid", async (req, res) => {
  try {
    const deleteMentor = await mentorModel.findOneAndDelete({
      id: req.body.id,
    });
    deleteMentor
      ? res.send("Mentor deleted successfully")
      : res.status(404).send({ message: "Mentor not found" });
  } catch (error) {
    res.status(400).json(error);
  }
});

//get all students for a mentor
router.get("/getstudentsformentor", async (req, res) => {
  try {
    const result = await mentorModel.findOne({ name: req.body.mentor });
    res.send(result.students);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
