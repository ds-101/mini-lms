const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    // Create a new user
    create: async (name, email, password, role) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
                       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`;
        const values = [name, email, hashedPassword, role];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    // Find user by email
    findByEmail: async (email) => {
        const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        return rows[0];
    },

    // Find user by ID
    findById: async (id) => {
        const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return rows[0];
    }
};

module.exports = User;
