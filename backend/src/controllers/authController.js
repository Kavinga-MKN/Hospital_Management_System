const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auditLogger = require('../middleware/auditLogger');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        const [users] = await pool.query(
            `SELECT u.*, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.email = ? AND u.is_active = TRUE`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials or inactive account' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_name, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Log login action
        await auditLogger(user.id, 'Login', 'Auth', user.id, 'User successfully logged in', req);

        res.json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role_name
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.logout = async (req, res) => {
    try {
        // Log logout action
        if (req.user) {
            await auditLogger(req.user.id, 'Logout', 'Auth', req.user.id, 'User logged out', req);
        }
        res.json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.is_active, r.name as role 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.json({ status: 'success', data: users[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
