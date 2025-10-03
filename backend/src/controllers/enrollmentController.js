const pool = require("../config/db");

// Enroll student into a course
exports.enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;  // from authMiddleware
    const { courseId } = req.body;

    // Check if already enrolled
    const exists = await pool.query(
      "SELECT * FROM enrollments WHERE student_id=$1 AND course_id=$2",
      [studentId, courseId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const newEnrollment = await pool.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
      [studentId, courseId]
    );

    res.status(201).json({ message: "Enrolled successfully", enrollment: newEnrollment.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all courses enrolled by a student
exports.getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await pool.query(
      `SELECT e.id, e.progress, e.status, c.title, c.description
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id=$1`,
      [studentId]
    );

    res.json(enrollments.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const updated = await pool.query(
      "UPDATE enrollments SET progress=$1, status=CASE WHEN $1=100 THEN 'completed' ELSE status END WHERE id=$2 RETURNING *",
      [progress, enrollmentId]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Progress updated", enrollment: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
