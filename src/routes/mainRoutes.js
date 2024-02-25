const express = require('express');
const isAuthenticated = require('../middlewares/authMiddleware');
const userController = require("../controllers/userController");
const nftService = require('../services/nftService');
const postService = require("../services/postService")
const userService = require('../services/userService');
const coinService = require("../services/coinService")
const router = express.Router();



router.get("/",isAuthenticated, async function(req, res){
    const posts = await postService.getAll();
    res.render('index', {posts: posts});
})

router.get('/users', isAuthenticated, async function(req, res){
    const users = await userService.getAll();
    res.render('users', {users: users});
})

router.get("/profile", isAuthenticated, userController.profile);

router.get("/user/:userId", isAuthenticated, userController.getUser);

router.post('/add-friend', userController.addFriend);
router.post('/accept-friend', userController.acceptFriend);
router.post('/delete-friend', userController.deleteFriend);

router.post('/add-post', async function(req,res) {
    const hasToken = await userService.hasToken(req.session.user.id);
    if(!hasToken){
        return res.redirect('/');
    }
    const {text} = req.body;
    console.log(text);
    try{
        await postService.create(text, req.session.user.id);
    }catch(error){
        console.log(error);
    }
    res.render('index');
})

router.post('/transfer-coin', async function(req, res){
    try{
        await coinService.transfer(req.session.user.wallet);
        res.status(200).send('successful transfer of coin');
    }catch(err){
        console.log(err);
    }
})

router.get('/test', async function(req,res) {
    try{
        const result = await nftService.testContract();
        res.status(200).send("Hello: " +result);
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;
