CREATE TABLE Patient (
                         patient_id INT PRIMARY KEY AUTO_INCREMENT,
                         name VARCHAR(100) NOT NULL,
                         age INT CHECK (age > 0),
                         gender VARCHAR(10),
                         phone VARCHAR(15) UNIQUE
);

CREATE TABLE Doctor (
                        doctor_id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(100) NOT NULL,
                        specialization VARCHAR(100),
                        phone VARCHAR(15) UNIQUE
);

CREATE TABLE Appointment (
                             appointment_id INT PRIMARY KEY AUTO_INCREMENT,
                             patient_id INT,
                             doctor_id INT,
                             appointment_date DATE NOT NULL,
                             priority ENUM('Low', 'Medium', 'High') NOT NULL,
                             FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
                             FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
);

INSERT INTO Patient (name, age, gender, phone) VALUES
                                                   ('Alice Smith', 30, 'Female', '1234567890'),
                                                   ('Bob Johnson', 45, 'Male', '0987654321');

INSERT INTO Doctor (name, specialization, phone) VALUES
                                                     ('Dr. John Doe', 'Cardiology', '1112223333'),
                                                     ('Dr. Jane Roe', 'Dermatology', '4445556666');

INSERT INTO Appointment (patient_id, doctor_id, appointment_date, priority) VALUES
                                                                                (1, 1, '2026-02-15', 'High'),
                                                                                (2, 2, '2026-02-20', 'Medium');