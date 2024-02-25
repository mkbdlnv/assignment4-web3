const pool = require('../db');
const axios = require('axios');
const {contract} = require('../contracts/nftContract');


async function connectWallet(walletAddress, userId){
    try {
        const result = await pool.query('UPDATE users SET wallet = $1 WHERE id = $2', [walletAddress, userId]);
    } catch (error) {
        throw new Error("Failed to connect wallet: " + error);
    }
}

async function balanceOf(walletAddress){
    try{
        const result = await contract.balanceOf(walletAddress);
        return result;
    }catch(err){
        return 0;
    }
}

async function getTokens(walletAddress){
    try{
        const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, 0);
        const tokenURI = await getTokenURI(tokenId);
        const nftURL = await createHttpNFTLink(tokenURI);
        const nftImgIpfs = await fetchJSONFromIPFS(nftURL);
        const nftIMG = await createHttpNFTLink(nftImgIpfs.image);
        return {tokenId, nftURL, nftIMG};
    }catch(err){
        return {tokenId: "", nftURL: "", nftIMG: ""};
    }
}

async function getTokenURI(tokenId){
    try{
        const result = await contract.tokenURI(tokenId);
        return result;
    }catch(err){
        throw new Error(err);
    }
}


async function createHttpNFTLink(tokenURI){
    const ipfsPrefix = 'ipfs://';
    const httpsPrefix = 'https://ipfs.io/ipfs/';
    return httpsPrefix + tokenURI.slice(ipfsPrefix.length);
}

async function fetchJSONFromIPFS(ipfsLink) {
    try {
        const response = await axios.get(ipfsLink);
        return response.data;
    } catch (error) {
        console.log('Error fetching JSON from IPFS:', error);
        throw error; 
    }
}


async function mintNft(address, userId){
    try{
        const tx = await contract.safeMint(address);
        await tx.wait(); 
        console.log("Transaction hash: "+ tx.hash);
        try {
            const result = await pool.query('UPDATE users SET has_token = $1 WHERE id = $2', [true, userId]);
        } catch (error) {
            throw new Error("Failed to change has_token column: " + error);
        }
    }catch(err){
        throw new Error("Cannot mint nft: " + err);
    }
}

async function burnNft(tokenId, userId){
    try{
        const tx = await contract.burn(tokenId);
        await tx.wait(); 
        console.log("Transaction hash: "+ tx.hash);
        console.log(userId);
        try {
            const result = await pool.query('UPDATE users SET has_token = $1 WHERE id = $2', [false, userId]);
        } catch (error) {
            throw new Error("Failed to change has_token column: " + error);
        }
    }catch(err){
        throw new Error("Cannot burn nft: " + err);
    }
}


async function checkNftRequirement(user){
    console.log('Check nft requirement for: ')
    console.log(user);
    try {
        if(user.friends_count >= 5 && !user.has_token){
            await mintNft(user.wallet, user.id);
        }else if(user.friends_count  < 5 && user.has_token){
            console.log('Burn nft for: ' + user.id);
            const {tokenId} = await getTokens(user.wallet, user.id);
            await burnNft(tokenId, user.id);
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

async function testContract() {
    try{
        const result = await contract.owner();
        return result;
    }catch(err){
        throw new Error(err);
    }
    
}




module.exports = {
    connectWallet,
    testContract,
    balanceOf,
    getTokens,
    checkNftRequirement
};