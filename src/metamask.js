// MetaMask Integration for Supply Chain Management System

// Global variables to keep track of connection state
window.isMetaMaskConnected = false;
window.contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Store user role
let userRole = '';

// Function to wait for MetaMask to be injected
function waitForMetaMask(callback, maxWaitTime = 3000, checkInterval = 100) {
    let waited = 0;
    
    console.log('Checking for MetaMask...');
    
    // If page is already fully loaded, start checking immediately
    if (document.readyState === 'complete') {
        startMetaMaskCheck();
    } else {
        // Wait for the page to fully load before checking
        window.addEventListener('load', startMetaMaskCheck);
    }
    
    function startMetaMaskCheck() {
        // If MetaMask is already available, execute callback immediately
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is already available');
            callback();
            return;
        }
        
        console.log('Waiting for MetaMask to be injected...');
        
        // Set up polling to check for MetaMask
        const interval = setInterval(() => {
            waited += checkInterval;
            
            // Check if MetaMask is now available
            if (typeof window.ethereum !== 'undefined') {
                clearInterval(interval);
                console.log('MetaMask detected');
                callback();
                return;
            }
            
            // If we've waited too long, stop waiting
            if (waited >= maxWaitTime) {
                clearInterval(interval);
                console.log('MetaMask not detected after timeout');
                console.log('Trying alternative detection method...');
                
                // Try an alternative approach - give more time
                detectEthereumProvider()
                    .then((provider) => {
                        if (provider) {
                            console.log('Ethereum provider detected through alternative method');
                            window.ethereum = provider;
                            callback();
                        } else {
                            console.log('No provider found even with alternative method');
                            alertNoMetaMask();
                        }
                    })
                    .catch(() => {
                        alertNoMetaMask();
                    });
            }
        }, checkInterval);
    }
    
    function alertNoMetaMask() {
        console.error('MetaMask extension not detected');
        alert('MetaMask extension not detected. Please install MetaMask and refresh the page.');
        document.getElementById('connection-status').textContent = 'MetaMask Not Found';
        document.getElementById('connection-status').classList.add('text-danger');
    }
    
    // Simple provider detection function
    async function detectEthereumProvider() {
        // This is a simplified version of the detectEthereumProvider library
        if (window.ethereum) {
            return window.ethereum;
        }
        
        // Check if it's in process of injecting
        if (window.web3) {
            return window.web3.currentProvider;
        }
        
        // Last resort - wait a bit longer
        return new Promise((resolve) => {
            setTimeout(() => {
                if (window.ethereum) {
                    resolve(window.ethereum);
                } else if (window.web3) {
                    resolve(window.web3.currentProvider);
                } else {
                    resolve(null);
                }
            }, 3000); // Wait an additional 3 seconds
        });
    }
}

// Function to connect to MetaMask
async function connectMetaMask() {
    console.log("Connecting to MetaMask...");
    
    if (typeof window.ethereum === 'undefined') {
        console.error("MetaMask is not installed");
        showMessage('MetaMask is not installed. Please install MetaMask extension.', 'danger');
        return null;
    }
    
    try {
        // Show connecting status
        updateStatusDisplay({
            type: 'warning',
            message: 'Connecting to MetaMask...'
        });
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        console.log("Connected accounts:", accounts);
        
        if (accounts.length === 0) {
            throw new Error("No accounts found. Please connect an account in MetaMask.");
        }
        
        // Save the connected account
        const connectedAccount = accounts[0];
        localStorage.setItem('lastConnectedAccount', connectedAccount);
        window.isMetaMaskConnected = true;
        
        // Initialize Web3 with current provider
        window.web3 = new Web3(window.ethereum);
        
        // Initialize contract
        window.contract = new window.web3.eth.Contract(
            window.contractABI || [],
            window.contractAddress
        );
        
        // Update UI to show connected state
        updateStatusDisplay({
            type: 'success',
            message: 'Connected to MetaMask'
        });
        
        // Add event listeners for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        showMessage('Successfully connected to MetaMask', 'success');
        
        // Check if we're on producer page and need to handle producer-specific logic
        if (typeof handleProducerAfterConnection === 'function') {
            console.log("Found producer handler, calling it with account:", connectedAccount);
            await handleProducerAfterConnection(connectedAccount);
        }
        
        // Check if we're on consumer page and need to handle consumer-specific logic
        if (typeof handleConsumerAfterConnection === 'function') {
            console.log("Found consumer handler, calling it with account:", connectedAccount);
            await handleConsumerAfterConnection(connectedAccount);
        }
        
        return connectedAccount;
    } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
        window.isMetaMaskConnected = false;
        
        updateStatusDisplay({
            type: 'danger',
            message: 'Failed to connect'
        });
        
        showMessage('Failed to connect to MetaMask: ' + error.message, 'danger');
        return null;
    }
}

// Handle account changes in MetaMask
function handleAccountsChanged(accounts) {
    console.log("Accounts changed:", accounts);
    
    if (accounts.length === 0) {
        // User disconnected all accounts
        disconnectMetaMask();
    } else {
        // User switched accounts
        const newAccount = accounts[0];
        localStorage.setItem('lastConnectedAccount', newAccount);
        
        // Update UI
        updateStatusDisplay({
            type: 'success',
            message: 'Account changed'
        });
        
        showMessage('Account changed to ' + newAccount.substring(0, 6) + '...', 'info');
        
        // Check if we're on producer page and need to handle producer-specific logic
        if (typeof handleProducerAfterConnection === 'function') {
            handleProducerAfterConnection(newAccount);
        }
        
        // Check if we're on consumer page and need to handle consumer-specific logic
        if (typeof handleConsumerAfterConnection === 'function') {
            handleConsumerAfterConnection(newAccount);
        }
    }
}

// Function to disconnect from MetaMask
async function disconnectMetaMask() {
    console.log("Disconnecting from MetaMask...");
    
    try {
        // Show disconnecting status
        updateStatusDisplay({
            type: 'warning',
            message: 'Disconnecting...'
        });
        
        // Remove event listeners
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
        
        // Set flag that user has explicitly disconnected
        localStorage.setItem('explicitly_disconnected', 'true');
        
        // Clear saved account
        localStorage.removeItem('lastConnectedAccount');
        localStorage.removeItem('userRole');
        
        // Reset global state
        window.isMetaMaskConnected = false;
        window.web3 = null;
        window.contract = null;
        
        // Update UI to show disconnected state
        updateStatusDisplay({
            type: 'info',
            message: 'Disconnected from MetaMask'
        });
        
        showMessage('Successfully disconnected from MetaMask', 'info');
        
        // Reload the page to reset all state
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        console.error("Failed to disconnect from MetaMask:", error);
        showMessage('Failed to disconnect: ' + error.message, 'danger');
    }
}

// Function to check if already connected
async function checkConnection() {
    console.log("Checking existing connection...");
    
    // If user explicitly disconnected, don't auto-connect
    if (localStorage.getItem('explicitly_disconnected') === 'true') {
        console.log("User explicitly disconnected previously, not auto-connecting");
        return null;
    }
    
    if (typeof window.ethereum === 'undefined') {
        console.log("MetaMask not installed");
        updateStatusDisplay({
            type: 'danger',
            message: 'MetaMask not installed'
        });
        return null;
    }
    
    try {
        // Get currently connected accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length === 0) {
            console.log("No accounts connected");
            updateStatusDisplay({
                type: 'warning',
                message: 'Not connected to MetaMask'
            });
            return null;
        }
        
        // We have a connected account
        const connectedAccount = accounts[0];
        console.log("Already connected with account:", connectedAccount);
        
        // Save the connected account
        localStorage.setItem('lastConnectedAccount', connectedAccount);
        window.isMetaMaskConnected = true;
        
        // Initialize Web3 with current provider
        window.web3 = new Web3(window.ethereum);
        
        // Initialize contract
        window.contract = new window.web3.eth.Contract(
            window.contractABI || [],
            window.contractAddress
        );
        
        // Update UI to show connected state
        updateStatusDisplay({
            type: 'success',
            message: 'Connected to MetaMask'
        });
        
        // Add event listeners for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        // Check if we're on producer page and need to handle producer-specific logic
        if (typeof handleProducerAfterConnection === 'function') {
            console.log("Found producer handler, calling it with account:", connectedAccount);
            await handleProducerAfterConnection(connectedAccount);
        }
        
        // Check if we're on consumer page and need to handle consumer-specific logic
        if (typeof handleConsumerAfterConnection === 'function') {
            console.log("Found consumer handler, calling it with account:", connectedAccount);
            await handleConsumerAfterConnection(connectedAccount);
        }
        
        return connectedAccount;
    } catch (error) {
        console.error("Error checking connection:", error);
        return null;
    }
}

// Helper for Connect button
async function connectClickHandler() {
    const connectButton = document.getElementById('connect-button');
    const disconnectButton = document.getElementById('disconnect-button');
    
    // Disable connect button while connecting
    if (connectButton) {
        connectButton.disabled = true;
        connectButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';
    }
    
    try {
        // Try to connect
        const account = await connectMetaMask();
        
        if (account) {
            // If connected successfully, hide connect button and show disconnect
            if (connectButton) {
                connectButton.style.display = 'none';
            }
            if (disconnectButton) {
                disconnectButton.style.display = 'block';
            }
            
            // Update account display (if element exists)
            const accountDisplay = document.getElementById('account-display');
            if (accountDisplay) {
                accountDisplay.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
                accountDisplay.style.display = 'block';
            }
        }
    } finally {
        // Re-enable the connect button when done
        if (connectButton) {
            connectButton.disabled = false;
            connectButton.innerHTML = 'Connect MetaMask';
        }
    }
}

// Helper for Disconnect button
async function disconnectClickHandler() {
    const connectButton = document.getElementById('connect-button');
    const disconnectButton = document.getElementById('disconnect-button');
    
    // Disable disconnect button while disconnecting
    if (disconnectButton) {
        disconnectButton.disabled = true;
        disconnectButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Disconnecting...';
    }
    
    try {
        // Try to disconnect
        await disconnectMetaMask();
        
        // After disconnect, show connect button and hide disconnect
        if (connectButton) {
            connectButton.style.display = 'block';
        }
        if (disconnectButton) {
            disconnectButton.style.display = 'none';
        }
        
        // Hide account display (if element exists)
        const accountDisplay = document.getElementById('account-display');
        if (accountDisplay) {
            accountDisplay.textContent = '';
            accountDisplay.style.display = 'none';
        }
    } finally {
        // Re-enable the disconnect button when done
        if (disconnectButton) {
            disconnectButton.disabled = false;
            disconnectButton.innerHTML = 'Disconnect';
        }
    }
}

// Function to ensure the UI shows the disconnected state
function ensureDisconnectedState() {
    // Show connect button and hide disconnect
    const connectButton = document.getElementById('connect-button');
    const disconnectButton = document.getElementById('disconnect-button');
    
    if (connectButton) {
        connectButton.style.display = 'block';
    }
    if (disconnectButton) {
        disconnectButton.style.display = 'none';
    }
    
    // Hide account display
    const accountDisplay = document.getElementById('account-display');
    if (accountDisplay) {
        accountDisplay.textContent = '';
        accountDisplay.style.display = 'none';
    }
}

// Update UI status elements
function updateStatusDisplay(typeOrConfig, message) {
    const statusElement = document.getElementById('connection-status');
    if (!statusElement) return;
    
    let type, statusMessage;
    
    // Handle both old and new calling conventions
    if (typeof typeOrConfig === 'object') {
        type = typeOrConfig.type;
        statusMessage = typeOrConfig.message;
    } else {
        type = typeOrConfig;
        statusMessage = message;
    }
    
    // Remove all existing status classes
    statusElement.classList.remove('text-success', 'text-warning', 'text-danger', 'text-info');
    
    // Add appropriate class based on status type
    switch (type) {
        case 'success':
            statusElement.classList.add('text-success');
            break;
        case 'warning':
            statusElement.classList.add('text-warning');
            break;
        case 'danger':
            statusElement.classList.add('text-danger');
            break;
        case 'info':
        default:
            statusElement.classList.add('text-info');
            break;
    }
    
    // Update text content
    statusElement.textContent = statusMessage;
    
    // Also update wallet address display if it exists
    if (type === 'success' && window.isMetaMaskConnected) {
        const addressElement = document.getElementById('wallet-address');
        if (addressElement) {
            const account = localStorage.getItem('lastConnectedAccount');
            if (account) {
                addressElement.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            }
        }
    }
}

// General message display function
function showMessage(message, type = 'info') {
    // Check for toast container
    let toastContainer = document.getElementById('toast-container');
    
    // Create toast container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '5';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toastEl = document.createElement('div');
    toastEl.id = toastId;
    toastEl.className = `toast align-items-center border-0 show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // Set background class based on type
    switch (type) {
        case 'success':
            toastEl.classList.add('bg-success', 'text-white');
            break;
        case 'danger':
            toastEl.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toastEl.classList.add('bg-warning', 'text-dark');
            break;
        case 'info':
        default:
            toastEl.classList.add('bg-info', 'text-white');
            break;
    }
    
    // Create toast content
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toastEl);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// Function to check and set user role
async function checkUserRole(account) {
    try {
        const isProducer = await window.contract.methods.isProducerRegistered(account).call();
        
        if (isProducer) {
            setUserRole('producer');
            return 'producer';
        } else {
            setUserRole('consumer');
            return 'consumer';
        }
    } catch (error) {
        console.error("Error checking user role:", error);
        return null;
    }
}

// User role management
function setUserRole(role) {
    userRole = role;
    localStorage.setItem('userRole', role);
}

function getUserRole() {
    if (userRole) return userRole;
    return localStorage.getItem('userRole') || null;
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    waitForMetaMask(() => {
        checkConnection();
        
        // Set up connect and disconnect button handlers
        const connectButton = document.getElementById('connect-button');
        const disconnectButton = document.getElementById('disconnect-button');
        
        if (connectButton) {
            connectButton.addEventListener('click', connectClickHandler);
        }
        
        if (disconnectButton) {
            disconnectButton.addEventListener('click', disconnectClickHandler);
        }
    });
}); 