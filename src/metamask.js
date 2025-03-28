// MetaMask Integration for Supply Chain Management System

// Global variables to keep track of connection state
window.isMetaMaskConnected = false;
window.contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Import auth functions if available
let authFunctions = null;
try {
    authFunctions = require('./auth');
} catch (e) {
    console.log('Auth module not available, using localStorage directly.');
}

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
        
        // Update UI if elements exist
        const connectionStatus = document.getElementById('connection-status');
        if (connectionStatus) {
            connectionStatus.textContent = 'MetaMask Not Found';
            connectionStatus.classList.add('text-danger');
        }
        
        // Redirect to login page if on dashboard
        const isLoginPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname === '/' || 
                          window.location.pathname.endsWith('index.html');
        
        if (!isLoginPage) {
            window.location.href = 'login.html?metamask=required';
        }
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
        
        // Check if we need to verify user authentication status
        verifyUserAuthentication(connectedAccount);
        
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

// Verify if the user authentication matches the MetaMask account
function verifyUserAuthentication(account) {
    // If we have auth functions, use them
    if (authFunctions && authFunctions.isUserLoggedIn()) {
        const user = authFunctions.getCurrentUser();
        if (user && user.walletAddress !== account) {
            // Wallet address doesn't match the authenticated user
            authFunctions.logout();
            
            // Check if we're on a dashboard page
            const isLoginPage = window.location.pathname.includes('login.html') || 
                              window.location.pathname === '/' || 
                              window.location.pathname.endsWith('index.html');
            
            if (!isLoginPage) {
                window.location.href = 'login.html?wallet=mismatch';
            }
        }
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
        
        // Verify user authentication with the new account
        verifyUserAuthentication(newAccount);
        
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
        
        // Also log out the user if they were authenticated
        if (authFunctions && authFunctions.isUserLoggedIn()) {
            authFunctions.logout();
        }
        
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
        
        // Redirect to login page if on dashboard
        const isLoginPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname === '/' || 
                          window.location.pathname.endsWith('index.html');
        
        if (!isLoginPage) {
            window.location.href = 'login.html';
        }
        
        return true;
    } catch (error) {
        console.error("Error disconnecting from MetaMask:", error);
        
        updateStatusDisplay({
            type: 'danger',
            message: 'Error disconnecting'
        });
        
        showMessage('Error disconnecting from MetaMask: ' + error.message, 'danger');
        return false;
    }
}

// Check if MetaMask is already connected
async function checkConnection() {
    console.log("Checking MetaMask connection...");
    
    // If MetaMask is not available, return immediately
    if (typeof window.ethereum === 'undefined') {
        console.error("MetaMask is not installed");
        return false;
    }
    
    try {
        // Check if user has explicitly disconnected
        const explicitlyDisconnected = localStorage.getItem('explicitly_disconnected') === 'true';
        if (explicitlyDisconnected) {
            console.log("User explicitly disconnected previously, not reconnecting automatically");
            ensureDisconnectedState();
            return false;
        }
        
        // Check if we have the account already saved
        const savedAccount = localStorage.getItem('lastConnectedAccount');
        if (!savedAccount) {
            console.log("No previously connected account found");
            ensureDisconnectedState();
            return false;
        }
        
        // Get accounts that are already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length === 0) {
            console.log("No accounts connected to this site");
            ensureDisconnectedState();
            return false;
        }
        
        // Check if the first account matches our saved account
        const currentAccount = accounts[0];
        if (currentAccount.toLowerCase() !== savedAccount.toLowerCase()) {
            console.log("Connected account doesn't match saved account, updating");
            localStorage.setItem('lastConnectedAccount', currentAccount);
            
            // Verify user authentication with the current account
            verifyUserAuthentication(currentAccount);
        }
        
        // We are connected
        window.isMetaMaskConnected = true;
        
        // Initialize Web3 with current provider
        window.web3 = new Web3(window.ethereum);
        
        // Initialize contract
        window.contract = new window.web3.eth.Contract(
            window.contractABI || [],
            window.contractAddress
        );
        
        // Set up event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        // Update UI
        updateStatusDisplay({
            type: 'success',
            message: 'Connected to MetaMask'
        });
        
        // Check if we need to update UI with role-specific content
        await checkUserRole(currentAccount);
        
        return true;
    } catch (error) {
        console.error("Error checking MetaMask connection:", error);
        ensureDisconnectedState();
        return false;
    }
}

// Function to handle connect button click
async function connectClickHandler() {
    console.log("Connect button clicked");
    
    // Get UI elements
    const connectBtn = document.getElementById('connect-button');
    const disconnectBtn = document.getElementById('disconnect-button');
    
    // If already connected, just update UI
    if (window.isMetaMaskConnected) {
        console.log("Already connected, updating UI");
        
        // If we have disconnect button, show it
        if (disconnectBtn) {
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'block';
        } else {
            // Otherwise update connect button to show connected state
            connectBtn.textContent = 'Connected to MetaMask';
            connectBtn.classList.remove('btn-primary');
            connectBtn.classList.add('btn-success');
        }
        
        return true;
    }
    
    // Otherwise try to connect
    const connected = await connectMetaMask();
    
    // Update UI based on connection result
    if (connected) {
        console.log("Connection successful, updating UI");
        
        // If we have disconnect button, show it
        if (disconnectBtn) {
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'block';
        } else {
            // Otherwise update connect button to show connected state
            connectBtn.textContent = 'Connected to MetaMask';
            connectBtn.classList.remove('btn-primary');
            connectBtn.classList.add('btn-success');
        }
        
        return true;
    } else {
        console.log("Connection failed");
        return false;
    }
}

// Function to handle disconnect button click
async function disconnectClickHandler() {
    console.log("Disconnect button clicked");
    
    // Get UI elements
    const connectBtn = document.getElementById('connect-button');
    const disconnectBtn = document.getElementById('disconnect-button');
    
    // If not connected, just update UI
    if (!window.isMetaMaskConnected) {
        console.log("Not connected, updating UI");
        
        // If we have disconnect button, hide it
        if (disconnectBtn) {
            connectBtn.style.display = 'block';
            disconnectBtn.style.display = 'none';
        } else {
            // Otherwise update connect button to show disconnected state
            connectBtn.textContent = 'Connect MetaMask';
            connectBtn.classList.remove('btn-success');
            connectBtn.classList.add('btn-primary');
        }
        
        return true;
    }
    
    // Otherwise try to disconnect
    const disconnected = await disconnectMetaMask();
    
    // Update UI based on disconnection result
    if (disconnected) {
        console.log("Disconnection successful, updating UI");
        
        // If we have disconnect button, hide it
        if (disconnectBtn) {
            connectBtn.style.display = 'block';
            disconnectBtn.style.display = 'none';
        } else {
            // Otherwise update connect button to show disconnected state
            connectBtn.textContent = 'Connect MetaMask';
            connectBtn.classList.remove('btn-success');
            connectBtn.classList.add('btn-primary');
        }
        
        return true;
    } else {
        console.log("Disconnection failed");
        return false;
    }
}

// Ensure the UI reflects disconnected state
function ensureDisconnectedState() {
    // Reset global state
    window.isMetaMaskConnected = false;
    window.web3 = null;
    window.contract = null;
    
    // Update UI
    updateStatusDisplay({
        type: 'info',
        message: 'Not connected to MetaMask'
    });
    
    // Get UI elements
    const connectBtn = document.getElementById('connect-button');
    const disconnectBtn = document.getElementById('disconnect-button');
    
    // Update button visibility
    if (connectBtn && disconnectBtn) {
        connectBtn.style.display = 'block';
        disconnectBtn.style.display = 'none';
        
        connectBtn.textContent = 'Connect MetaMask';
        connectBtn.classList.remove('btn-success');
        connectBtn.classList.add('btn-primary');
    }
}

// Update connection status display
function updateStatusDisplay(typeOrConfig, message) {
    // Get status display element
    const statusElement = document.getElementById('connection-status');
    if (!statusElement) return;
    
    // Parse arguments
    let type, displayMessage;
    
    if (typeof typeOrConfig === 'object') {
        type = typeOrConfig.type;
        displayMessage = typeOrConfig.message;
    } else {
        type = typeOrConfig;
        displayMessage = message;
    }
    
    // Remove all previous status classes
    statusElement.classList.remove('text-success', 'text-warning', 'text-info', 'text-danger');
    
    // Add appropriate class based on type
    switch (type) {
        case 'success':
            statusElement.classList.add('text-success');
            break;
        case 'warning':
            statusElement.classList.add('text-warning');
            break;
        case 'info':
            statusElement.classList.add('text-info');
            break;
        case 'danger':
            statusElement.classList.add('text-danger');
            break;
    }
    
    // Set message text
    statusElement.textContent = displayMessage;
    
    // If we also have a wallet info element, update it
    const walletInfoElement = document.getElementById('wallet-info');
    if (walletInfoElement) {
        // If connected, show address
        if (type === 'success' && window.isMetaMaskConnected) {
            const account = localStorage.getItem('lastConnectedAccount');
            if (account) {
                const shortenedAddress = account.substring(0, 6) + '...' + account.substring(38);
                walletInfoElement.textContent = 'Wallet: ' + shortenedAddress;
                walletInfoElement.style.display = 'block';
            }
        } else {
            // Otherwise hide wallet info
            walletInfoElement.style.display = 'none';
        }
    }
}

// Show toast message
function showMessage(message, type = 'info') {
    // Try to find existing toast container
    let toastContainer = document.getElementById('toast-container');
    
    // Create container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create a new toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Add appropriate color class based on type
    let bgClass = 'bg-info';
    switch (type) {
        case 'success':
            bgClass = 'bg-success';
            break;
        case 'warning':
            bgClass = 'bg-warning';
            break;
        case 'danger':
            bgClass = 'bg-danger';
            break;
    }
    
    // Set toast content
    toast.innerHTML = `
        <div class="toast-header ${bgClass} text-white">
            <strong class="me-auto">MetaMask</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    try {
        // Try using Bootstrap's JS API
        new bootstrap.Toast(toast, { autohide: true, delay: 5000 }).show();
    } catch (e) {
        // Fallback to manual implementation
        console.log('Bootstrap Toast not available, using fallback');
        toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            
            // Remove from DOM after fade out
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
                
                // Remove container if empty
                if (toastContainer.children.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            }, 500);
        }, 5000);
        
        // Handle close button
        const closeBtn = toast.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('show');
                
                // Remove from DOM after fade out
                setTimeout(() => {
                    if (toastContainer.contains(toast)) {
                        toastContainer.removeChild(toast);
                    }
                    
                    // Remove container if empty
                    if (toastContainer.children.length === 0) {
                        document.body.removeChild(toastContainer);
                    }
                }, 500);
            });
        }
    }
}

// Check user role on the blockchain
async function checkUserRole(account) {
    if (!window.isMetaMaskConnected || !window.contract) {
        console.log("Not connected or contract not initialized");
        return null;
    }
    
    try {
        // Try to get user role from contract
        // First check if user is a producer
        const isProducer = await window.contract.methods.isProducer(account).call();
        if (isProducer) {
            setUserRole('producer');
            return 'producer';
        }
        
        // Then check if user is a consumer
        const isConsumer = await window.contract.methods.isConsumer(account).call();
        if (isConsumer) {
            setUserRole('consumer');
            return 'consumer';
        }
        
        // User is not registered yet
        setUserRole('');
        return null;
    } catch (error) {
        console.error("Error checking user role:", error);
        return null;
    }
}

// Set user role
function setUserRole(role) {
    userRole = role;
    localStorage.setItem('userRole', role);
}

// Get user role
function getUserRole() {
    // First check local variable
    if (userRole) {
        return userRole;
    }
    
    // Then check localStorage
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
        userRole = savedRole;
        return savedRole;
    }
    
    // No role found
    return null;
}

// Initialize the MetaMask connection when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing MetaMask connection');
    
    // Set up event listeners for connect/disconnect buttons
    const connectBtn = document.getElementById('connect-button');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectClickHandler);
    }
    
    const disconnectBtn = document.getElementById('disconnect-button');
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', disconnectClickHandler);
    }
    
    // Get MetaMask status
    waitForMetaMask(async () => {
        console.log('MetaMask is available, checking connection');
        const isConnected = await checkConnection();
        console.log(`Initial connection check: ${isConnected ? 'Connected' : 'Not connected'}`);
    });
});

// Export functions for use in other modules
export {
    connectMetaMask,
    disconnectMetaMask,
    checkConnection,
    checkUserRole,
    getUserRole,
    setUserRole
}; 