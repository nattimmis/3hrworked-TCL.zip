const Web3 = require('web3');

// Variables definition
const privKey =
    '07a1c09e9d5204704410869c5cf373c64abcffbefc16e6719b8db951426bdd16';
const addressFrom = '0x275a1b777A0f5f190a56415580f53ee5590E52C1';
const addressTo = '0x883a37BB19e2203dab7Dd76Ec104798F0CDAfb59';
const web3 = new Web3('http://localhost:7545');

// Create transaction
module.exports.deploy = async (address,amount) => {
    console.log(
        `Attempting to make transaction from ${addressFrom} to ${address}`
    );

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: addressFrom,
            to: address,
            value: web3.utils.toWei(amount.toString(), 'ether'),
            gas: '21000',
        },
        privKey
    );

    // Deploy transaction
    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
};

