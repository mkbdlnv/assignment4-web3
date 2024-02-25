document.addEventListener('DOMContentLoaded', () => {
    const connectWalletButton = document.getElementById('connectWalletButton');

    connectWalletButton.addEventListener('click', async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            const response = await fetch('/nft/connect-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ walletAddress })
            });

            if (response.ok) {
                console.log('Wallet connected successfully');
                window.location.reload();
            } else {
                console.error('Failed to connect wallet');
            }
        } catch (error) {
            console.error(error);
        }
    });
});