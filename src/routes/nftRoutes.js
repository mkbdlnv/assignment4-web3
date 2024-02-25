const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

router.post('/connect-wallet', nftController.connectWallet);

module.exports = router
