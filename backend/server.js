const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => {
    res.send("Clinic Appointment Backend is running");
});

// -------------------- ADD PATIENT --------------------
app.post("/add-patient", (req, res) => {
    const { name, gender, phone } = req.body;

    const sql = "INSERT INTO Patient (name, gender, phone) VALUES (?, ?, ?)";
    db.query(sql, [name, gender, phone], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Patient added successfully" });
        }
    });
});

// -------------------- ADD DOCTOR --------------------
app.post("/add-doctor", (req, res) => {
    const { name, specialization } = req.body;

    const sql = "INSERT INTO Doctor (name, specialization) VALUES (?, ?)";
    db.query(sql, [name, specialization], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ message: "Doctor added successfully" });
        }
    });
});

// -------------------- ADD APPOINTMENT --------------------
app.post("/add-appointment", (req, res) => {
    const { patient_id, doctor_id, appointment_date, priority_level } = req.body;

    const sql = `
        INSERT INTO Appointment
        (patient_id, doctor_id, appointment_date, priority_level)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [patient_id, doctor_id, appointment_date, priority_level],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.json({ message: "Appointment booked successfully" });
            }
        }
    );
});

// -------------------- GET ALL APPOINTMENTS --------------------
app.get("/appointments", (req, res) => {
    const sql = `
        SELECT
            a.appointment_id,
            p.name AS patient_name,
            d.name AS doctor_name,
            a.appointment_date,
            a.priority_level
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.patient_id
        JOIN Doctor d ON a.doctor_id = d.doctor_id
        ORDER BY a.appointment_date
    `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// -------------------- GET ALL PATIENTS --------------------
app.get("/patients", (req, res) => {
    const sql = "SELECT patient_id, name, gender, phone FROM Patient";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// -------------------- GET ALL DOCTORS --------------------
app.get("/doctors", (req, res) => {
    const sql = "SELECT doctor_id, name FROM Doctor";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// -------------------- DELETE PATIENT --------------------
app.delete("/delete-patient/:id", (req, res) => {
    const patientId = req.params.id;

    const sql = "DELETE FROM Patient WHERE patient_id = ?";
    db.query(sql, [patientId], (err, result) => {
        if (err) {
            if (err.code === "ER_ROW_IS_REFERENCED_2") {
                res.status(400).json({
                    message: "Cannot delete patient. Patient has existing appointments."
                });
            } else {
                res.status(500).json({ error: err });
            }
        } else {
            res.json({ message: "Patient deleted successfully" });
        }
    });
});

// -------------------- DELETE APPOINTMENT --------------------
app.delete("/delete-appointment/:id", (req, res) => {
    const appointmentId = req.params.id;
    const sql = "DELETE FROM Appointment WHERE appointment_id = ?";
    db.query(sql, [appointmentId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "Appointment not found" });
        } else {
            res.json({ message: "Appointment deleted successfully" });
        }
    });
});

// -------------------- START SERVER --------------------
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});