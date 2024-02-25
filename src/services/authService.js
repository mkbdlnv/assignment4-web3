
const pool = require('../db');
const {hashPassword, comparePasswords } = require('../utils/passwordEncoder');
const {uploadImage} = require('../utils/fileUploadUtil');

async function register(user, image){
    const { name, lastname, bio, img_path, username, password } = user;
    try {
        const hashedPassword = await hashPassword(password);
        const imagePath = await uploadImage(image);
        const result = await pool.query('INSERT INTO users (name, lastname, bio, img_path, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, lastname, bio, imagePath, username, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Failed to register user: ' + error.message);
    }
}

async function login(req, username, password) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            conolse.log('user not found');
            throw new Error('User not found');
        }
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            conolse.log('Invalid password');
            throw new Error('Invalid password');
        }
        req.session.user = user;
        return user;
    } catch (error) {
        throw new Error('Failed to authenticate user: ' + error.message);
    }
}


async function logout(req) {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw new Error('Failed to destroy session: ' + err.message);
            }
        });
    } catch (error) {
        throw new Error('Failed to logout user: ' + error.message);
    }
}

module.exports = {
  login, register, logout
};
