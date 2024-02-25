const pool = require('../db');
const nftService = require('../services/nftService');

async function getById(userId){
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    console.log('Get user:');
    console.log(user.name);
    console.log(user.id);
    if (!user) {
        conolse.log('user not found');
        throw new Error('User not found');
    }
    return user
}

async function getAll(){
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
}

async function addFriend(user1_id, user2_id){
    try{
        await pool.query('INSERT INTO friends(user1_id, user2_id) VALUES($1, $2)', [user1_id, user2_id]);
    }catch(error){
        throw new Error("Cannot add to friend: " + error);
    }
    
}

async function getFriendStatus(user1_id, user2_id){
    try{
        const result = await pool.query('SELECT status FROM friends WHERE user1_id = $1 AND user2_id = $2', [user1_id, user2_id]);
        const status = result.rows[0];
        if(!status){
           return null;
        }
        return status.status;
    }catch(error){
        throw new Error("Cannot find status: " + error);
    }
}

async function getFriendStatusFrom(user1_id, user2_id){
    try{
        const result = await pool.query('SELECT status FROM friends WHERE user2_id = $1 AND user1_id = $2', [user1_id, user2_id]);
        const status = result.rows[0];
        if(!status){
           return null;
        }
        return status.status;
    }catch(error){
        throw new Error("Cannot find status: " + error);
    }
}



async function getFrineds(userId){
    console.log(userId);
    try{
        const result = await pool.query(`
            SELECT u.*
            FROM friends f
            JOIN users u ON (CASE WHEN f.user1_id = $1 THEN f.user2_id ELSE f.user1_id END) = u.id
            WHERE ($1 IN (f.user1_id, f.user2_id)) AND f.status = 'accepted'
        `, [userId]);
        return result.rows;
    }catch(error){
        throw new Error("Cannot find friends: " + error);
    }
}

async function getFrinedsRequests(userId){
    try{
        const result = await pool.query("SELECT * FROM friends f JOIN users u on f.user1_id = u.id WHERE user2_id = $1 AND status='pending'", [userId]);
        console.log(result.rows[0]);
        return result.rows;
    }catch(error){
        throw new Error("Cannot find friends: " + error);
    }
}

async function acceptFriend(user1_id, user2_id) {
    try {
        await pool.query('UPDATE friends SET status = $1 WHERE (user1_id = $2 AND user2_id = $3) OR (user1_id = $3 AND user2_id = $2)', ['accepted', user1_id, user2_id]);
        await increaseFriendsCount(user1_id, user2_id);
        const user1 = await getById(user1_id);
        await nftService.checkNftRequirement(user1);
        const user2 = await getById(user2_id);
        await nftService.checkNftRequirement(user2);
    } catch (error) {
        throw new Error("Cannot accept friend: " + error);
    }
}

async function deleteFriend(user1_id, user2_id){
    try {
        await pool.query('DELETE FROM friends WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)', [user1_id, user2_id]);
        await deacreaseFriendsCount(user1_id, user2_id);
        const user1 = await getById(user1_id);
        await nftService.checkNftRequirement(user1);
        const user2 = await getById(user2_id);
        await nftService.checkNftRequirement(user2);
    } catch (error) {
        throw new Error("Cannot delete friend: " + error);
    }
}

async function increaseFriendsCount(user1_id, user2_id){
    try { 
        await pool.query('UPDATE users SET friends_count = friends_count + 1  WHERE id=$1 OR id=$2', [user1_id, user2_id]);
    } catch (error) {
        console.log(error);
        throw new Error("Cannot accept friend: " + error);
    }
}

async function deacreaseFriendsCount(user1_id, user2_id){
    try {
     
        await pool.query('UPDATE users SET friends_count = friends_count - 1  WHERE id=$1 OR id=$2', [user1_id, user2_id]);
    } catch (error) {
        console.log(error);
        throw new Error("Cannot delete friend: " + error);
    }
}

async function hasToken(userId){
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const hasToken = result.rows[0].has_token;
    return hasToken;
}



module.exports = {
    getById,
    addFriend,
    acceptFriend,
    getFriendStatus,
    getFriendStatusFrom,
    getFrineds,
    getFrinedsRequests,
    deleteFriend,
    hasToken,
     getAll
}