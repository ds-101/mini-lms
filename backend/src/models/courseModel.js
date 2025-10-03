const pool = require("../db");

const CourseModel = {
  async getAllCourses() {
    const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");
    return result.rows;
  },

  async getCourseById(id) {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    return result.rows[0];
  },

  async createCourse(title, description, instructor) {
    const result = await pool.query(
      "INSERT INTO courses (title, description, instructor) VALUES ($1, $2, $3) RETURNING *",
      [title, description, instructor]
    );
    return result.rows[0];
  },

  async updateCourse(id, title, description, instructor) {
    const result = await pool.query(
      "UPDATE courses SET title=$1, description=$2, instructor=$3 WHERE id=$4 RETURNING *",
      [title, description, instructor, id]
    );
    return result.rows[0];
  },

  async deleteCourse(id) {
    await pool.query("DELETE FROM courses WHERE id=$1", [id]);
    return { message: "Course deleted successfully" };
  }
};

module.exports = CourseModel;
