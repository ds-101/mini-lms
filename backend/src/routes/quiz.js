const express = require("express");
const {
  createQuiz,
  addQuestion,
  submitQuiz,
  getQuizResult,
} = require("../controllers/quizController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Instructor only
router.post("/", authMiddleware, createQuiz);
router.post("/:quizId/questions", authMiddleware, addQuestion);

// Student only
router.post("/:quizId/submit", authMiddleware, submitQuiz);
router.get("/:quizId/result", authMiddleware, getQuizResult);

module.exports = router;
