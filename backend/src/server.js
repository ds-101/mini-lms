/*import courseRoutes from "./routes/course.js";

const courseRoutes = require("./routes/courseRoutes");
const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/auth");
// const courseRoutes = require("./routes/course");

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
*/

/*const express = require("express");
const app = express();
require("dotenv").config(); // .env ফাইল লোড করার জন্য

// আপনার কোর্স রুটস ফাইল লোড হচ্ছে
const courseRoutes = require("./routes/courseRoutes"); 
const authRoutes = require("./routes/auth");

// 1. মিডলওয়্যার
app.use(express.json()); // JSON বডি পার্স করার জন্য অত্যন্ত জরুরি

// 2. রুটস (Routes)
app.use("/auth", authRoutes); 
app.use("/api/courses", courseRoutes); 

// 3. সার্ভার লিসেন
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");       // ✅ alias: authRoutes
const courseRoutes = require("./routes/course");   // ✅ alias: courseRoutes
const enrollmentRoutes = require("./routes/enrollment");
const quizRoutes = require("./routes/quiz");
const certificateRoutes = require("./routes/certificate");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);       // all auth related APIs
app.use("/api/courses", courseRoutes);  // all course related APIs
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);

// Root test
app.get("/", (req, res) => {
  res.send("Mini-LMS Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
  }
  console.log(`Server running on port ${PORT}`);
});
