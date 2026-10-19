const pool = require('../config/db');

exports.getAllDepartments = async (req, res) => {
    try {
        const [departments] = await pool.query('SELECT * FROM departments ORDER BY name ASC');
        res.json({ status: 'success', data: departments });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const [result] = await pool.query('INSERT INTO departments (name, description) VALUES (?, ?)', [name, description]);
        res.status(201).json({ status: 'success', message: 'Department created', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
