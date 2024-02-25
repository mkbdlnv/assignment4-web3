// Track the number of clicks
let clickCount = 0;

// Update the click count display
function updateClickCount() {
    document.getElementById('clickCount').textContent = clickCount;
}

// Event listener for the mine button
document.getElementById('mineButton').addEventListener('click', async () => {
    clickCount++; // Increment the click count
    updateClickCount(); // Update the click count display

    // Check if the user has clicked 100 times
    if (clickCount % 100 === 0) {
        document.getElementById('mineButton').disabled = true;
        try {
            const response = await fetch('/transfer-coin', {
                method: 'POST',

            });
            
            if (response.ok) {
                // Handle success
                console.log('You received 1 coin!');
                window.location.reload();
            } else {
                // Handle error
                console.error('Failed to receive coin from the server');
            }
        } catch (error) {
            // Handle network error
            console.error('Network error:', error);
        }
    }
});
