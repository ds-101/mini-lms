const pool = require("../config/db");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const instructorId = req.user.id;

    const newCourse = await pool.query(
      "INSERT INTO courses (title, description, instructor_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, instructorId]
    );

    res.status(201).json({ message: "Course created", course: newCourse.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    res.json(courses.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Course
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await pool.query("SELECT * FROM courses WHERE id=$1", [id]);

    if (course.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await pool.query(
      "UPDATE courses SET title=$1, description=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [title, description, id]
    );

    if (course.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated", course: course.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query("DELETE FROM courses WHERE id=$1 RETURNING *", [id]);

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
