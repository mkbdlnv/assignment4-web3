const { BigNumber, FixedNumber } = require('ethers');

const {contract} = require('../contracts/coinContract');

async function balanceOf(address){
    try{
        const result = await contract.balanceOf(address);
        const fixedBalance = FixedNumber.from(result.toString());
        const divisor = FixedNumber.from('1000000000000000000');
        const balance = fixedBalance.divUnsafe(divisor);
        console.log(balance);
        return balance;
    }catch(err){
        console.log(err);
        return "";
    }
}

async function transfer(address){
    try{
        const tx = await contract.transfer(address, '1000000000000000000');
        await tx.wait(); 
        console.log("Transaction hash: "+ tx.hash);
    }catch(err){
        throw new Error("Cannot transfer coin: " + err);
    }
}

module.exports = {
    balanceOf,
    transfer
}