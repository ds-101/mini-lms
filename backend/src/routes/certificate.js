const express = require("express");
const { generateCertificate, verifyCertificate } = require("../controllers/certificateController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Generate Certificate (Student after completion)
router.post("/", authMiddleware, generateCertificate);

// Verify Certificate (Public)
router.get("/verify/:certId", verifyCertificate);

module.exports = router;
