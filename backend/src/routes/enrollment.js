const express = require("express");
const { enrollCourse, getStudentEnrollments, updateProgress } = require("../controllers/enrollmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes protected (student)
router.post("/enroll", authMiddleware, enrollCourse);
router.get("/my-courses", authMiddleware, getStudentEnrollments);
router.put("/progress/:enrollmentId", authMiddleware, updateProgress);

module.exports = router;
