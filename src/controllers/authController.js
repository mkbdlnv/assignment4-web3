
const pool = require('../db');
const { hashPassword } = require('../utils/passwordEncoder');
const authService = require('../services/authService');

async function register(req, res) {
  const { name, lastname, bio, username, password } = req.body;
  const image = req.files && req.files.image; 

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
        res.render('register', {usernameError: 'Username is already taken! Choose another one.'})
    }
      const newUser = await authService.register({ name, lastname, bio, username, password }, image);

      res.render('login')
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Failed to register user',
          error: error.message
      });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  console.log(username + ", " + password)
  try{
    await authService.login(req, username, password);
    res.redirect('/');
  }catch (error) {
    res.render('login', {loginError: 'Inocrrect username or password.'});
  }
}

async function logout(req, res){
  try {
    await authService.logout(req);
    res.redirect('/auth/login'); 
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
}




module.exports = {
  register,
  login,
  logout
};
