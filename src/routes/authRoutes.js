
const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login',(req, res) => {
    res.render('login');
});

router.get('/logout', logout)
module.exports = router;
