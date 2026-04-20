const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const dbPath = path.join(__dirname, "..", "database", "hospital.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ============================
// Cities & Districts
// ============================

// GET /api/cities
app.get("/api/cities", (req, res) => {
  const cities = db.prepare("SELECT name FROM cities ORDER BY rowid").all();
  res.json(cities);
});

// GET /api/cities/:cityName/districts
app.get("/api/cities/:cityName/districts", (req, res) => {
  const districts = db
    .prepare("SELECT name FROM districts WHERE city_name = ? ORDER BY rowid")
    .all(req.params.cityName);
  res.json(districts);
});

// GET /api/districts  (list all)
app.get("/api/districts", (_req, res) => {
  const districts = db
    .prepare(
      `SELECT city_name, name
       FROM districts
       ORDER BY city_name, rowid`
    )
    .all();
  res.json(districts);
});

// ============================
// Departments & Doctors
// ============================

// GET /api/departments
app.get("/api/departments", (req, res) => {
  const departments = db
    .prepare("SELECT code, name FROM departments ORDER BY rowid")
    .all();
  res.json(departments);
});

// GET /api/departments/:deptCode/doctors
app.get("/api/departments/:deptCode/doctors", (req, res) => {
  const doctors = db
    .prepare("SELECT name FROM doctors WHERE department_code = ? ORDER BY rowid")
    .all(req.params.deptCode);
  res.json(doctors);
});

// GET /api/doctors  (list all, joined with department name)
app.get("/api/doctors", (_req, res) => {
  const doctors = db
    .prepare(
      `SELECT d.department_code, d.name, dep.name AS department_name
       FROM doctors d
       JOIN departments dep ON d.department_code = dep.code
       ORDER BY dep.rowid, d.rowid`
    )
    .all();
  res.json(doctors);
});

// ============================
// Patients
// ============================

// GET /api/patients?medical_no=xxx
app.get("/api/patients", (req, res) => {
  const { medical_no } = req.query;
  if (medical_no) {
    const patient = db
      .prepare("SELECT * FROM patients WHERE medical_no = ?")
      .get(medical_no);
    return res.json(patient || null);
  }
  const patients = db.prepare("SELECT * FROM patients ORDER BY created_at DESC").all();
  res.json(patients);
});

// POST /api/patients
app.post("/api/patients", (req, res) => {
  const { medical_no, name, gender, birthday, age, phone, city_name, district_name, address } = req.body;
  try {
    db.prepare(
      `INSERT INTO patients (medical_no, name, gender, birthday, age, phone, city_name, district_name, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(medical_no, name, gender || null, birthday || null, age || null, phone || null, city_name || null, district_name || null, address || null);
    res.json({ medical_no });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "病歷號碼已存在" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/patients/:medicalNo
app.put("/api/patients/:medicalNo", (req, res) => {
  const { name, gender, birthday, age, phone, city_name, district_name, address } = req.body;
  try {
    db.prepare(
      `UPDATE patients SET name=?, gender=?, birthday=?, age=?, phone=?, city_name=?, district_name=?, address=?, updated_at=datetime('now','localtime')
       WHERE medical_no=?`
    ).run(name, gender || null, birthday || null, age || null, phone || null, city_name || null, district_name || null, address || null, req.params.medicalNo);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// Registrations
// ============================

// POST /api/registrations
app.post("/api/registrations", (req, res) => {
  const { patient_medical_no, visit_type, reg_date, reg_period, department_code, doctor_name } = req.body;

  // Auto-generate reg_number: count per department per date per period + 1
  const count = db
    .prepare("SELECT COUNT(*) as c FROM registrations WHERE reg_date = ? AND reg_period = ? AND department_code = ?")
    .get(reg_date, reg_period, department_code);
  const reg_number = String((count?.c || 0) + 1).padStart(2, "0");

  try {
    db.prepare(
      `INSERT INTO registrations (reg_date, reg_period, department_code, reg_number, patient_medical_no, visit_type, doctor_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(reg_date, reg_period, department_code, reg_number, patient_medical_no, visit_type, doctor_name);
    const dept = db.prepare("SELECT name FROM departments WHERE code = ?").get(department_code);
    res.json({ reg_number, department_name: dept?.name || "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/registrations
app.get("/api/registrations", (req, res) => {
  const rows = db
    .prepare(
      `SELECT r.*, p.name as patient_name, p.medical_no, dep.name as dept_name
       FROM registrations r
       JOIN patients p ON r.patient_medical_no = p.medical_no
       JOIN departments dep ON r.department_code = dep.code
       ORDER BY r.created_at DESC`
    )
    .all();
  res.json(rows);
});

// ============================
// Start
// ============================
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
