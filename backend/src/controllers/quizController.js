const pool = require("../config/db");

// Create Quiz (Instructor)
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    const newQuiz = await pool.query(
      "INSERT INTO quizzes (course_id, title) VALUES ($1, $2) RETURNING *",
      [courseId, title]
    );

    res.status(201).json({ message: "Quiz created", quiz: newQuiz.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Question
exports.addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { question_text, question_type, options, correct_answer } = req.body;

    const newQuestion = await pool.query(
      "INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [quizId, question_text, question_type, options ? JSON.stringify(options) : null, correct_answer]
    );

    res.status(201).json({ message: "Question added", question: newQuestion.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit Quiz (Student)
exports.submitQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId } = req.params;
    const { answers } = req.body;  // { questionId: answer }

    // Fetch questions
    const questions = await pool.query("SELECT * FROM questions WHERE quiz_id=$1", [quizId]);

    let score = 0;
    questions.rows.forEach(q => {
      if (q.correct_answer && answers[q.id] && answers[q.id].toString().trim() === q.correct_answer.toString().trim()) {
        score += 1;
      }
    });

    const submission = await pool.query(
      "INSERT INTO quiz_submissions (quiz_id, student_id, answers, score) VALUES ($1, $2, $3, $4) RETURNING *",
      [quizId, studentId, JSON.stringify(answers), score]
    );

    res.status(201).json({ message: "Quiz submitted", score, submission: submission.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Quiz Result (Student)
exports.getQuizResult = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM quiz_submissions WHERE quiz_id=$1 AND student_id=$2",
      [quizId, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No submission found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
