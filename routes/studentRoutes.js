const express = require("express");
const router = express.Router();
const studentModel = require("../model/studentModel.js");
const mentortModel = require("../model/mentorModel.js");

//create student
router.post("/createstudent", async (req, res) => {
  try {
    const newStudent = new studentModel({ ...req.body, verified: true });
    await newStudent.save();
    res.send("Student created successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

//get student
router.get("/getstudents", async (req, res) => {
  try {
    const students = await studentModel.find();
    res.send(students);
  } catch (error) {
    res.status(400).json(error);
  }
});

//get student by Id
router.get("/getstudentsbyid", async (req, res) => {
  try {
    const student = await studentModel.findOne({ _id: req.body.studentId });
    res.send(student);
  } catch (error) {
    res.status(400).json(error);
  }
});

//update student by Id
router.post("/updatestudentsbyid", async (req, res) => {
  try {
    const updatedStudent = await studentModel.findOneAndUpdate(
      { id: req.body.id },
      req.body
    );
    res.send("Student updated successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete student by Id
router.delete("/deletestudentsbyid", async (req, res) => {
  try {
    const deleteStudent = await studentModel.findOneAndDelete({
      id: req.body.id,
    });
    deleteStudent
      ? res.send("Student deleted successfully")
      : res.status(404).send({ message: "Student not found" });
  } catch (error) {
    res.status(400).json(error);
  }
});

//Assign students to mentor
router.post("/assignstudentstomentor", async (req, res) => {
  const students = req.body.students;
  const mentor = req.body.name;
  console.log(mentor);
  console.log(students);
  let result;
  for (const student of students) {
    result = await studentModel.findOne({ name: student });
  }
  console.log(result);
  if (result.current_mentor) {
    res.send("Mentor already present for the student");
    return;
  } else {
    const result = await mentortModel.findOneAndUpdate(
      { name: mentor },
      { $addToSet: { students: { $each: [...students] } } }
    );
    for (const student of students) {
      const result1 = await studentModel.findOneAndUpdate(
        { name: student },
        { current_mentor: mentor }
      );
      console.log("result is ", result1);
    }
    console.log("Mentors added successfully");
    res.send("Mentors added successfully");
    return;
  }
});

//Change mentor for a student
router.post("/changementor", async (req, res) => {
  const student = req.body.student;
  const mentor = req.body.mentor;
  console.log(mentor);
  console.log(student);

  const result = await studentModel.findOne({ name: student });

  console.log(result.current_mentor);
  const result1 = await studentModel.findOneAndUpdate(
    { name: student },
    { current_mentor: mentor, previous_mentor: result.current_mentor }
  );
  console.log(result1);
  const result2 = await mentortModel.findOneAndUpdate(
    { name: mentor },
    { $addToSet: { students: student } }
  );
  res.send("Mentors added successfully");
});

//get previous mentor for a student
router.get("/getpreviousmentor", async (req, res) => {
  try {
    const student = await studentModel.findOne({ name: req.body.student });
    res.send({ previous_mentor: student.previous_mentor });
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = router;