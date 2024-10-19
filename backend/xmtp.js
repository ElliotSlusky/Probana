const { Client } = require('@xmtp/xmtp-js');
const { ethers } = require('ethers');

// Function to send an alert message
async function sendAlert(recipientAddress, message) {
    // Retrieve the private key from environment variables
    const privateKey = "d5c887de5c4381da09a90f593d8c3039f791aa0491b4687eec36f918b95cb55c"; // Ensure this is set in your environment
    if (!privateKey) {
        throw new Error('Private key is not set in environment variables');
    }
    const wallet = new ethers.Wallet(privateKey);

    // Create an XMTP client
    const xmtp = await Client.create(wallet, { env: 'production' });

    // Start a conversation with the recipient
    const conversation = await xmtp.conversations.newConversation(recipientAddress);

    // Send a message
    await conversation.send(message);

    console.log(`Alert sent to ${recipientAddress}: ${message}`);
}

// Example usage
(async () => {
    try {
        const recipient = '0x14d3D4d1B76266DeBC63E20E13338211541e07E7';
        const alertMessage = 'hi andres';
        await sendAlert(recipient, alertMessage);
    } catch (error) {
        console.error('Error sending alert:', error);
    }
})();
