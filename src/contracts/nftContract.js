const { ethers } = require("ethers");
const path = require('path');
const fs = require("fs");
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.NFT_RPC);


const privateKey = process.env.WALLET_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);


const abiPath = path.resolve("./src/contracts/abis/Kitten.json");  
const rawData = fs.readFileSync(abiPath);  
const contractAbi = JSON.parse(rawData).abi;

const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);


module.exports = {
    contract
}