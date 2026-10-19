const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getAllPatients = async (req, res) => {
    try {
        const [patients] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
        res.json({ status: 'success', data: patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const [patients] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);

        if (patients.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Patient not found' });
        }

        res.json({ status: 'success', data: patients[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.createPatient = async (req, res) => {
    try {
        const { first_name, last_name, dob, gender, blood_group, contact_number, email, address, emergency_contact, nic } = req.body;

        const [result] = await pool.query(
            `INSERT INTO patients (first_name, last_name, dob, gender, blood_group, contact_number, email, address, emergency_contact, nic) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, dob, gender, blood_group, contact_number, email, address, emergency_contact, nic]
        );

        await auditLogger(req.user.id, 'Create', 'Patients', result.insertId, `Created patient ${first_name} ${last_name}`, req);

        res.status(201).json({ status: 'success', message: 'Patient created successfully', data: { id: result.insertId } });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ status: 'error', message: 'NIC or Email already exists' });
        }
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, dob, gender, blood_group, contact_number, email, address, emergency_contact, nic } = req.body;

        const [result] = await pool.query(
            `UPDATE patients 
             SET first_name =?, last_name =?, dob =?, gender =?, blood_group =?, contact_number =?, email =?, address =?, emergency_contact =?, nic =?
            WHERE id =? `,
            [first_name, last_name, dob, gender, blood_group, contact_number, email, address, emergency_contact, nic, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Patient not found' });
        }

        await auditLogger(req.user.id, 'Update', 'Patients', id, `Updated patient ${first_name} ${last_name}`, req);

        res.json({ status: 'success', message: 'Patient updated successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ status: 'error', message: 'NIC or Email already exists' });
        }
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM patients WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Patient not found' });
        }

        await auditLogger(req.user.id, 'Delete', 'Patients', id, `Deleted patient with ID ${id}`, req);

        res.json({ status: 'success', message: 'Patient deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
