const express = require("express");
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", authMiddleware, createCourse);   // Instructor creates
router.get("/", getCourses);                      // Anyone can view
router.get("/:id", getCourseById);                // Single course
router.put("/:id", authMiddleware, updateCourse); // Instructor updates
router.delete("/:id", authMiddleware, deleteCourse); // Instructor deletes

module.exports = router;
