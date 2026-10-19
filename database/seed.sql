USE hospital_management;

-- Insert Roles
INSERT INTO roles (name, description) VALUES 
('Administrator', 'Full system access'),
('Doctor', 'Manage patients, records, prescriptions'),
('Nurse', 'Manage admissions, view patients'),
('Receptionist', 'Manage appointments, patient registration'),
('Laboratory Staff', 'Manage lab requests, enter results'),
('Pharmacist', 'Manage medicines, dispense prescriptions'),
('Accountant', 'Manage billing, payments, invoices');

-- Note: In a real app, passwords would be hashed. For this seed (testing), we use plain bcrypt hashes.
-- The hash below is for 'password123' -> $2b$10$wT0vR5sH2H... (generated in app, but we will seed users from node script or just use a generic hash here for demo)
-- Let's use a known hash for 'password123': $2b$10$nJwYMyrP57b6p3.9A82JdOj2P9h8D86L1C.R3XwHbU/0j1wF/7o4i
SET @hash = '$2b$10$K16OFGZQsWmV2TXpWkywHOL4uSPimJj/MmU1ZTXQe7HMnyXscSyhu';

-- Insert Users (one for each role)
INSERT INTO users (email, password, first_name, last_name, phone, role_id) VALUES
('admin@hms.com', @hash, 'System', 'Admin', '1234567890', 1),
('doctor@hms.com', @hash, 'John', 'Doe', '1234567891', 2),
('nurse@hms.com', @hash, 'Jane', 'Smith', '1234567892', 3),
('receptionist@hms.com', @hash, 'Alice', 'Williams', '1234567893', 4),
('lab@hms.com', @hash, 'Bob', 'Johnson', '1234567894', 5),
('pharmacy@hms.com', @hash, 'Carol', 'Davis', '1234567895', 6),
('accountant@hms.com', @hash, 'Eve', 'Brown', '1234567896', 7);

-- Departments
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart related diseases'),
('Neurology', 'Brain and nervous system'),
('General Medicine', 'General healthcare'),
('Orthopedics', 'Bone and joint care'),
('Pediatrics', 'Children healthcare'),
('Laboratory', 'Diagnostic testing'),
('Pharmacy', 'Medicine dispensary');

-- Employees
INSERT INTO employees (user_id, department_id, designation, joining_date, salary) VALUES
(2, 1, 'Senior Cardiologist', '2023-01-15', 150000.00),
(3, 3, 'Head Nurse', '2023-02-01', 60000.00),
(4, NULL, 'Front Desk Executive', '2023-03-10', 40000.00),
(5, 6, 'Lab Technician', '2023-04-05', 50000.00),
(6, 7, 'Head Pharmacist', '2023-05-20', 70000.00),
(7, NULL, 'Chief Accountant', '2023-06-15', 80000.00);

-- Doctors
INSERT INTO doctors (user_id, department_id, specialization, consultation_fee) VALUES
(2, 1, 'Cardiologist', 500.00);

-- Doctor Schedules
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time) VALUES
(1, 'Monday', '09:00:00', '14:00:00'),
(1, 'Wednesday', '09:00:00', '14:00:00'),
(1, 'Friday', '09:00:00', '14:00:00');

-- Patients
INSERT INTO patients (first_name, last_name, dob, gender, blood_group, contact_number, email, nic) VALUES
('Michael', 'Scott', '1970-03-15', 'Male', 'O+', '9876543210', 'michael.s@example.com', '197012345678'),
('Pam', 'Beesly', '1985-05-20', 'Female', 'A+', '9876543211', 'pam.b@example.com', '198512345678');

-- Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
(1, 1, CURDATE(), '10:00:00', 'Chest pain checkup', 'Confirmed');

-- Medicines
INSERT INTO medicines (name, category, manufacturer, batch_number, quantity, unit_price, expiry_date) VALUES
('Paracetamol 500mg', 'Tablet', 'PharmaCorp', 'B123', 1000, 5.00, '2027-12-31'),
('Amoxicillin 250mg', 'Capsule', 'HealthMed', 'C456', 500, 10.00, '2026-06-30'),
('Cough Syrup', 'Liquid', 'CureAll', 'L789', 200, 50.00, '2026-12-31');

-- Lab Tests
INSERT INTO laboratory_tests (name, description, price, reference_range) VALUES
('Complete Blood Count (CBC)', 'Checks overall health', 250.00, 'RBC: 4.5-5.5, WBC: 4-11'),
('Lipid Panel', 'Checks cholesterol levels', 400.00, 'Cholesterol < 200mg/dL'),
('Fasting Blood Sugar (FBS)', 'Checks blood glucose', 150.00, 'Glucose 70-99 mg/dL');
