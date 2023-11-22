const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');

const maxAge = 1 * 24 * 60 * 60 * 1000; // 3 days

const login = async (req, res) => {
    try {
        if (req.method === 'GET') {
            res.render('login');
        } else if (req.method === 'POST') {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });

            if (admin && bcrypt.compareSync(password, admin.password)) {
                const token = await admin.generateAuthToken();
                res.cookie('token', `Bearer ${token}`,
                    { maxAge: maxAge, httpOnly: true });
                res.status(200).send({ email: admin.email, role: admin.role, token });

            } else {
                res.status(401).send({ error: 'Invalid credentials' });
            }
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', err });
    }
}

const register = async (req, res) => {
    try {
        if (req.method === 'GET') {
            res.render('register');
        } else if (req.method === 'POST') {
            const { name, email, role, password } = req.body;
            const admin = new Admin({ name, email, role, password });
            const savedAdmin = await admin.save();

            const token = await admin.generateAuthToken();
            res.cookie('token', `Bearer ${token}`,
                { maxAge: maxAge, httpOnly: true });
            res.status(200).send({ name: savedAdmin.name, email: savedAdmin.email, role: savedAdmin.role, token });

        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', err });
    }
}

const logout = async (req, res) => {
    try {
        const bearerToken =  req.header('Authorization') || req.cookies.token;
        const token = bearerToken.split(' ')[1];

        await Admin.updateOne(
            { 'tokens.token': token },
            { $pull: { 'tokens.token': token } }
        );
        res.clearCookie('token');
        res.status(200).send({ message: 'Logout successful' });
    } catch (err) {
        res.clearCookie('token');
        res.status(500).json({ message: 'Internal Server Error', err });
    }
}


module.exports = {
    login, register, logout
}