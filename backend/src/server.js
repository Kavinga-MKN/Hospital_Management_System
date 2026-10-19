require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/laboratory', require('./routes/laboratoryRoutes'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/admissions', require('./routes/admissionsRoutes'));
app.use('/api/system', require('./routes/staffRoutes')); // contains staff and audit
app.use('/api/reports', require('./routes/reportsRoutes'));

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'API is running successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Something went wrong!', error: err.message });
});

const pool = require('./config/db');

// Verify database connection on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
