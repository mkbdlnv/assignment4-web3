const nftService = require('../services/nftService');
const authService = require('../services/authService')
async function connectWallet(req, res){
    const { walletAddress } = req.body;
    const userId = req.session.user.id;
    try{
        await nftService.connectWallet(walletAddress, userId);
        req.session.user.wallet = walletAddress;
        res.status(200).send("Wallet connected successfully");
    }catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}




module.exports = {
    connectWallet
}