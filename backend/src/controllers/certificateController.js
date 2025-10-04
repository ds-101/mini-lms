const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// Generate Certificate
exports.generateCertificate = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    // Check if student enrolled
    const enrollment = await pool.query(
      "SELECT * FROM enrollments WHERE student_id=$1 AND course_id=$2",
      [studentId, courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Check if already certificate issued
    const existing = await pool.query(
      "SELECT * FROM certificates WHERE student_id=$1 AND course_id=$2",
      [studentId, courseId]
    );

    if (existing.rows.length > 0) {
      return res.json({ message: "Certificate already issued", certificate: existing.rows[0] });
    }

    // Generate QR Code link (for verification)
    const verifyUrl = `http://localhost:5000/api/certificates/verify/${studentId}-${courseId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    // PDF Path
    const certPath = path.join(__dirname, `../../certificates/cert-${studentId}-${courseId}.pdf`);

    // Ensure directory
    fs.mkdirSync(path.dirname(certPath), { recursive: true });

    // Create PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(certPath);
    doc.pipe(writeStream);

    // Certificate Design
    doc.fontSize(26).text("Mini LMS Certificate", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(18).text(`This is to certify that Student ID: ${studentId}`, { align: "center" });
    doc.moveDown(1);
    doc.text(`has successfully completed the course ID: ${courseId}`, { align: "center" });
    doc.moveDown(2);

    // Insert QR Code
    const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrImage, "base64");
    doc.image(qrBuffer, doc.page.width / 2 - 50, doc.y, { fit: [100, 100] });

    doc.end();

    writeStream.on("finish", async () => {
      // Save in DB
      const savedCert = await pool.query(
        "INSERT INTO certificates (student_id, course_id, certificate_url) VALUES ($1,$2,$3) RETURNING *",
        [studentId, courseId, certPath]
      );

      res.json({ message: "Certificate generated", certificate: savedCert.rows[0] });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify Certificate
exports.verifyCertificate = async (req, res) => {
  try {
    const [studentId, courseId] = req.params.certId.split("-");

    const cert = await pool.query(
      "SELECT * FROM certificates WHERE student_id=$1 AND course_id=$2",
      [studentId, courseId]
    );

    if (cert.rows.length === 0) {
      return res.status(404).json({ message: "Invalid certificate" });
    }

    res.json({ valid: true, certificate: cert.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
