const userService = require('../services/userService');
const nftService = require('../services/nftService');
const coinService = require('../services/coinService');
async function getUser(req, res) {
    const userId = req.params.userId;
    try{
        const user = await userService.getById(userId);
        res.render('user', {user: user, friendStatus: await userService.getFriendStatus(req.session.user.id, userId),
        friendStatusFrom: await userService.getFriendStatusFrom(req.session.user.id, userId)});
    }catch(error){
        res.status(404).send('user not found');
    }
}

async function addFriend(req, res){
    const {userId} = req.body;
    try{
        await userService.addFriend(req.session.user.id, userId);
        res.redirect(req.get('referer'));
    }catch(err){
        res.status(500).send('Cannot add to friend');
    }
}

async function deleteFriend(req, res){
    const {userId} = req.body;
    console.log("Delete user: ")
    console.log('userid1: ' + req.session.user.id + ", userid2: " + userId);
    try{
        await userService.deleteFriend(req.session.user.id, userId);
        res.redirect(req.get('referer'));
    }catch(err){
        res.status(500).send('Cannot delete to friend');
    }
}

async function acceptFriend(req, res){
    const {userId} = req.body;
    try{
        await userService.acceptFriend(req.session.user.id, userId);
        res.redirect(req.get('referer'));
    }catch(err){
        res.status(500).send('Cannot accept friend');
    }
}

async function profile(req, res){
    try{
        const friends = await userService.getFrineds(req.session.user.id);
        const friendsRequests = await userService.getFrinedsRequests(req.session.user.id);
        const balance = await nftService.balanceOf(req.session.user.wallet);
        const balanceCoin =  await coinService.balanceOf(req.session.user.wallet);
        const {tokenId, nftURL, nftIMG} = await nftService.getTokens(req.session.user.wallet);
        res.render('profile', {friends: friends, friendsRequests: friendsRequests,
        balance: balance, tokenId: tokenId, nftURL: nftURL, nftIMG: nftIMG, 
        balanceCoin: balanceCoin});
        
    }catch(err){
        res.status(500).send('Cannot find profile');
    }
}


module.exports = {
    getUser,
    addFriend,
    profile,
    acceptFriend,
    deleteFriend

}