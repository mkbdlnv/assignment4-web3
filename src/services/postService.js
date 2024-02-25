const pool = require('../db');

async function create(text, userId){
    try {
        const result = await pool.query('INSERT INTO posts (text, user_id) VALUES ($1, $2) RETURNING *', [text, userId]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Failed to make post: ' + error.message);
    }
}

async function getAll(){
    try {
        const result = await pool.query('SELECT * FROM posts p JOIN users u ON p.user_id=u.id');
        return result.rows;
    } catch (error) {
        throw new Error('Failed to retrieve post: ' + error.message);
    }
}

module.exports = {
    create,
     getAll
}