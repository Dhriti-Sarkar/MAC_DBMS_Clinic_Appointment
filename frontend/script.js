const API = "http://127.0.0.1:3000";

/* ================= LOAD PATIENTS ================= */
async function loadPatients() {
    const res = await fetch(`${API}/patients`);
    const patients = await res.json();

    const list = document.getElementById("patient-list");
    const select = document.getElementById("appointment-patient");

    list.innerHTML = "";
    select.innerHTML = "";

    patients.forEach(p => {
        list.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.gender || '-'}</td>
                <td>${p.phone || '-'}</td>
                <td><button data-id="${p.patient_id}" class="delete-patient-btn">Delete</button></td>
            </tr>
        `;
        select.innerHTML += `<option value="${p.patient_id}">${p.name}</option>`;
    });

    document.querySelectorAll(".delete-patient-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const patientId = btn.getAttribute("data-id");

            if (!confirm("Are you sure you want to delete this patient?")) return;

            const res = await fetch(`${API}/delete-patient/${patientId}`, { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
                alert(result.message || "Patient deleted successfully");
                loadPatients();
                loadAppointments();
            } else {
                alert(result.message || "Error deleting patient");
            }
        });
    });
}

/* ================= LOAD DOCTORS ================= */
async function loadDoctors() {
    const res = await fetch(`${API}/doctors`);
    const doctors = await res.json();

    const list = document.getElementById("doctor-list");
    const select = document.getElementById("appointment-doctor");

    list.innerHTML = "";
    select.innerHTML = "";

    doctors.forEach(d => {
        list.innerHTML += `<li>${d.name}</li>`;
        select.innerHTML += `<option value="${d.doctor_id}">${d.name}</option>`;
    });
}

/* ================= LOAD APPOINTMENTS ================= */
async function loadAppointments() {
    const res = await fetch(`${API}/appointments`);
    const appointments = await res.json();

    const table = document.getElementById("appointment-table");
    table.innerHTML = "";

    appointments.forEach(a => {
        table.innerHTML += `
            <tr>
                <td>${a.patient_name}</td>
                <td>${a.doctor_name}</td>
                <td>${new Date(a.appointment_date).toLocaleDateString()}</td>
                <td>${a.priority_level || "-"}</td>
                <td><button data-id="${a.appointment_id}" class="delete-appointment-btn">Delete</button></td>
            </tr>
        `;
    });

    document.querySelectorAll(".delete-appointment-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const appointmentId = btn.getAttribute("data-id");
            if (!confirm("Are you sure you want to delete this appointment?")) return;

            const res = await fetch(`${API}/delete-appointment/${appointmentId}`, { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
                alert(result.message || "Appointment deleted successfully");
                loadAppointments();
            } else {
                alert(result.message || "Error deleting appointment");
            }
        });
    });
}

/* ================= ADD PATIENT ================= */
document.getElementById("add-patient-form").addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("patient-name").value;
    const gender = document.getElementById("patient-gender").value;
    const phone = document.getElementById("patient-phone").value;

    const res = await fetch(`${API}/add-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gender, phone }),
    });

    if (res.ok) {
        e.target.reset();
        loadPatients();
    } else {
        const error = await res.json();
        alert(error.message || "Error adding patient");
    }
});

/* ================= BOOK APPOINTMENT ================= */
document.getElementById("book-appointment-form").addEventListener("submit", async e => {
    e.preventDefault();

    const patient_id = document.getElementById("appointment-patient").value;
    const doctor_id = document.getElementById("appointment-doctor").value;
    const appointment_date = document.getElementById("appointment-date").value;
    const priority_level = document.getElementById("appointment-priority").value;

    const res = await fetch(`${API}/add-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id, doctor_id, appointment_date, priority_level }),
    });

    if (res.ok) {
        e.target.reset();
        loadAppointments();
    } else {
        const error = await res.json();
        alert(error.message || "Error booking appointment");
    }
});

/* ================= INITIAL LOAD ================= */
loadPatients();
loadDoctors();
loadAppointments();