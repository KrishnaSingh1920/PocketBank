const balanceElements = document.querySelectorAll('.balance');
const amountInputs = document.querySelectorAll('.amount');
const depositButtons = document.querySelectorAll('.deposit');
const withdrawButtons = document.querySelectorAll('.withdraw');
const messageElements = document.querySelectorAll('.message');
const transactionLogButton = document.getElementById('transaction-log-button');
const transactionLogPopup = document.getElementById('transaction-log-popup');
const transactionList = document.getElementById('transaction-list');
const closePopupButton = document.getElementById('close-popup');
const clearLogButton = document.getElementById('clear-log');
const moneySound = document.getElementById('money-sound');
const failSound = document.getElementById('fail-sound');

// Play sound on deposit or withdraw
function playSound() {
    moneySound.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}
function playFailSound() {
    failSound.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}



// Initialize transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update balance display and load stored transactions
function updateBalanceDisplay(containerId) {
    const balanceElement = document.getElementById(containerId).querySelector('.balance');
    let balance = parseFloat(localStorage.getItem(`balance-${containerId}`)) || 0;
    balanceElement.textContent = `₹${balance.toFixed(2)}`;
}

// Show transaction message
function showMessage(container, message, isSuccess = false) {
    const messageElement = container.querySelector('.message');
    messageElement.textContent = message;
    messageElement.style.color = isSuccess ? 'green' : 'red';
    messageElement.classList.add('show');
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Handle deposit
depositButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const containerId = `bank${index + 1}`;
        const container = document.getElementById(containerId);
        const balanceElement = container.querySelector('.balance');
        const amountInput = container.querySelector('.amount');
        let balance = parseFloat(balanceElement.textContent.replace('₹', ''));

        const amount = parseFloat(amountInput.value);
        const walletName = `Wallet ${index + 1}`; // Hardcoded wallet name

        if (amount > 0) {
            balance += amount;
            balanceElement.textContent = `₹${balance.toFixed(2)}`;
            localStorage.setItem(`balance-${containerId}`, balance);
            saveTransaction(`Successfully deposited ₹${amount.toFixed(2)} to ${walletName}!`);
            showMessage(container, `Successfully deposited ₹${amount.toFixed(2)} to ${walletName}!`, true);
            playSound();
        } else {
            showMessage(container, 'Please enter a valid amount.');
            playFailSound();
        }
        amountInput.value = '';
    });
});


// Handle withdraw
withdrawButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const containerId = `bank${index + 1}`;
        const container = document.getElementById(containerId);
        const balanceElement = container.querySelector('.balance');
        const amountInput = container.querySelector('.amount');
        let balance = parseFloat(balanceElement.textContent.replace('₹', ''));

        const amount = parseFloat(amountInput.value);
        const walletName = `Wallet ${index + 1}`; // Hardcoded wallet name

        if (amount > 0 && amount <= balance) {
            balance -= amount;
            balanceElement.textContent = `₹${balance.toFixed(2)}`;
            localStorage.setItem(`balance-${containerId}`, balance);
            saveTransaction(`Successfully withdrew ₹${amount.toFixed(2)} from ${walletName}!`);
            showMessage(container, `Successfully withdrew ₹${amount.toFixed(2)} from ${walletName}!`, true);
            playSound();
        } else if (amount > balance) {
            showMessage(container, 'Insufficient balance.');
        } else {
            showMessage(container, 'Please enter a valid amount.');
            playFailSound();
        }
        amountInput.value = '';
    });
});


// Save transaction log with wallet name
function saveTransaction(message) {
    transactions.push(message);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Show transaction log popup with transition
transactionLogButton.addEventListener('click', () => {
    transactionLogPopup.style.display = 'flex';
    setTimeout(() => {
        transactionLogPopup.style.opacity = '1'; // Transition in
        transactionList.innerHTML = transactions.map(transaction => `<li>${transaction}</li>`).join('');
    }, 0);
    
    // Slide in popup content
    const popupContent = transactionLogPopup.querySelector('.popup-content');
    setTimeout(() => {
        popupContent.style.transform = 'translateY(0)';
    }, 0);
});

// Close popup with transition
closePopupButton.addEventListener('click', () => {
    const popupContent = transactionLogPopup.querySelector('.popup-content');
    popupContent.style.transform = 'translateY(-150px)'; // Slide out
    setTimeout(() => {
        transactionLogPopup.style.opacity = '0'; // Fade out
    }, 300);
    setTimeout(() => {
        transactionLogPopup.style.display = 'none';
    }, 250);
});

// Clear transaction log with transition
clearLogButton.addEventListener('click', () => {
    // Add the 'clearing' class to start fading out
    transactionList.classList.add('clearing');

    // After the fade-out transition ends, clear the log
    setTimeout(() => {
        transactions = [];
        localStorage.setItem('transactions', JSON.stringify(transactions));
        transactionList.innerHTML = '';
        
        // Reset opacity for future actions
        transactionList.classList.remove('clearing');
    }, 500); // Match the duration of the fade-out transition
});

const editNameButtons = document.querySelectorAll('#edit-name-btn');
const walletNames = document.querySelectorAll('#wallet-name');

// Update wallet name and store it in localStorage
function updateWalletName(walletIndex) {
    const walletNameElement = document.getElementById(`wallet-name-${walletIndex}`);
    let newName = walletNameElement.textContent.trim();

    // Count the number of words
    const wordCount = newName.split(/\s+/).length;

    // Limit to 20 words
    if (wordCount > 20) {
        walletNameElement.textContent = newName.split(/\s+/).slice(0, 20).join(' '); // Truncate to 20 words
    }

    // Save the name (only if word count is within the limit)
    localStorage.setItem(`wallet-name-${walletIndex}`, walletNameElement.textContent.trim());
}



// Load wallet names from localStorage on page load
function loadWalletNames() {
    // For each wallet, load the stored name from localStorage
    [1, 2, 3, 4].forEach(walletIndex => {
        const savedName = localStorage.getItem(`wallet-name-${walletIndex}`);
        const walletNameElement = document.getElementById(`wallet-name-${walletIndex}`);
        if (savedName) {
            walletNameElement.textContent = savedName;
        }
    });
}

// Call loadWalletNames on page load to update the names
window.addEventListener('load', loadWalletNames);



// Update balance displays on page load
updateBalanceDisplay('bank1');
updateBalanceDisplay('bank2');
updateBalanceDisplay('bank3');
updateBalanceDisplay('bank4');


