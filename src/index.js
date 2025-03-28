import './index.css';
import './contractABI.js';

// Import functions from metamask and auth modules
let checkConnection, connectMetaMask, checkUserRole, setUserRole;
let isUserLoggedIn, getCurrentUser, logout;

// Try to import from modules (may fail in older browsers)
try {
    const metamaskModule = require('./metamask.js');
    checkConnection = metamaskModule.checkConnection;
    connectMetaMask = metamaskModule.connectMetaMask;
    checkUserRole = metamaskModule.checkUserRole;
    setUserRole = metamaskModule.setUserRole;
    
    const authModule = require('./auth.js');
    isUserLoggedIn = authModule.isUserLoggedIn;
    getCurrentUser = authModule.getCurrentUser;
    logout = authModule.logout;
} catch (e) {
    console.log('Error importing modules:', e);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Index page loaded successfully');
    
    // Get UI elements
    const walletNotConnected = document.getElementById('wallet-not-connected');
    const walletConnected = document.getElementById('wallet-connected');
    const connectButton = document.getElementById('connect-metamask');
    const metamaskStatus = document.getElementById('metamask-status');
    const metamaskWarning = document.getElementById('metamask-warning');
    const producerButton = document.getElementById('producer-button');
    const consumerButton = document.getElementById('consumer-button');
    const registerRoleButton = document.getElementById('register-role-button');
    const roleRegistration = document.getElementById('role-registration');
    const registerRoleSubmit = document.getElementById('register-role-submit');
    const cancelRegistration = document.getElementById('cancel-registration');
    const producerType = document.getElementById('producer-type');
    const consumerType = document.getElementById('consumer-type');
    
    // Initialize UI
    function initUI() {
        // Check if MetaMask is available and connected
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is available');
            initMetaMask();
        } else {
            console.log('MetaMask is not available');
            showMetaMaskWarning("MetaMask extension not detected. Please install MetaMask to use this application.");
            disableConnectUI();
        }
    }
    
    // Initialize MetaMask connection
    async function initMetaMask() {
        try {
            // Check if already connected
            const isConnected = await checkConnection();
            
            if (isConnected) {
                console.log('Already connected to MetaMask');
                const account = localStorage.getItem('lastConnectedAccount');
                
                // Show connected UI
                showConnectedUI(account);
                
                // Check role
                const userRole = await getUserRole(account);
                updateRoleButtons(userRole);
            } else {
                console.log('Not connected to MetaMask');
                showDisconnectedUI();
            }
        } catch (error) {
            console.error('Error initializing MetaMask:', error);
            showMetaMaskWarning("Error connecting to MetaMask: " + error.message);
        }
    }
    
    // Get user role from blockchain or localStorage
    async function getUserRole(account) {
        try {
            // First check authenticated user if available
            if (isUserLoggedIn && isUserLoggedIn()) {
                const user = getCurrentUser();
                if (user && user.userType) {
                    return user.userType;
                }
            }
            
            // Then check blockchain role if connected
            if (window.isMetaMaskConnected && checkUserRole) {
                const role = await checkUserRole(account);
                return role;
            }
            
            return null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    }
    
    // Show connected UI state
    function showConnectedUI(account) {
        if (walletNotConnected) walletNotConnected.style.display = 'none';
        if (walletConnected) walletConnected.style.display = 'block';
        
        if (metamaskStatus) {
            const shortenedAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            metamaskStatus.innerHTML = `Connected address: <strong>${shortenedAddress}</strong>`;
        }
    }
    
    // Show disconnected UI state
    function showDisconnectedUI() {
        if (walletNotConnected) walletNotConnected.style.display = 'block';
        if (walletConnected) walletConnected.style.display = 'none';
    }
    
    // Show warning message
    function showMetaMaskWarning(message) {
        if (metamaskWarning) {
            metamaskWarning.style.display = 'block';
            metamaskWarning.innerHTML = `<div class="alert alert-warning">${message}</div>`;
        }
    }
    
    // Disable connect UI
    function disableConnectUI() {
        if (connectButton) {
            connectButton.disabled = true;
            connectButton.textContent = 'MetaMask Not Available';
            connectButton.classList.remove('btn-primary');
            connectButton.classList.add('btn-secondary');
        }
    }
    
    // Update UI based on user role
    function updateRoleButtons(role) {
        if (!role) {
            // No role, show register button
            if (registerRoleButton) registerRoleButton.style.display = 'inline-block';
            if (producerButton) producerButton.style.display = 'none';
            if (consumerButton) consumerButton.style.display = 'none';
            return;
        }
        
        // Hide register button
        if (registerRoleButton) registerRoleButton.style.display = 'none';
        
        // Show appropriate role button
        if (role === 'producer') {
            if (producerButton) producerButton.style.display = 'inline-block';
            if (consumerButton) consumerButton.style.display = 'none';
        } else if (role === 'consumer') {
            if (producerButton) producerButton.style.display = 'none';
            if (consumerButton) consumerButton.style.display = 'inline-block';
        }
    }
    
    // Connect to MetaMask
    async function connectToMetaMask() {
        if (connectButton) {
            connectButton.disabled = true;
            connectButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';
        }
        
        try {
            const account = await connectMetaMask();
            
            if (account) {
                showConnectedUI(account);
                const userRole = await getUserRole(account);
                updateRoleButtons(userRole);
            } else {
                throw new Error('Failed to connect to MetaMask');
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            showMetaMaskWarning("Error connecting to MetaMask: " + error.message);
        } finally {
            if (connectButton) {
                connectButton.disabled = false;
                connectButton.innerHTML = '<i class="bi bi-wallet2"></i> Connect MetaMask';
            }
        }
    }
    
    // Register user role
    async function registerRole(role) {
        try {
            const account = localStorage.getItem('lastConnectedAccount');
            if (!account) {
                throw new Error('No MetaMask account connected');
            }
            
            // Set role in localStorage
            setUserRole(role);
            
            // Call the contract to register the role
            if (window.contract) {
                let tx;
                if (role === 'producer') {
                    tx = await window.contract.methods.registerProducer().send({ from: account });
                } else if (role === 'consumer') {
                    tx = await window.contract.methods.registerConsumer().send({ from: account });
                }
                console.log('Transaction hash:', tx ? tx.transactionHash : 'No transaction');
            }
            
            // Update UI
            updateRoleButtons(role);
            
            // Hide registration form
            if (roleRegistration) roleRegistration.style.display = 'none';
            
            // Show success message
            showMetaMaskWarning(`Successfully registered as ${role}!`);
            
            // Redirect to appropriate dashboard
            setTimeout(() => {
                window.location.href = role === 'producer' ? 'producer.html' : 'consumer.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error registering role:', error);
            showMetaMaskWarning("Error registering role: " + error.message);
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Connect button
        if (connectButton) {
            connectButton.addEventListener('click', connectToMetaMask);
        }
        
        // Register role button
        if (registerRoleButton) {
            registerRoleButton.addEventListener('click', function() {
                if (roleRegistration) roleRegistration.style.display = 'block';
            });
        }
        
        // Cancel registration button
        if (cancelRegistration) {
            cancelRegistration.addEventListener('click', function() {
                if (roleRegistration) roleRegistration.style.display = 'none';
            });
        }
        
        // Register role submit button
        if (registerRoleSubmit) {
            registerRoleSubmit.addEventListener('click', function() {
                let selectedRole = null;
                
                if (producerType && producerType.checked) {
                    selectedRole = 'producer';
                } else if (consumerType && consumerType.checked) {
                    selectedRole = 'consumer';
                }
                
                if (selectedRole) {
                    registerRole(selectedRole);
                } else {
                    showMetaMaskWarning("Please select a role");
                }
            });
        }
        
        // Dashboard links
        if (producerButton) {
            producerButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'producer.html';
            });
        }
        
        if (consumerButton) {
            consumerButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'consumer.html';
            });
        }
    }
    
    // Initialize the page
    initUI();
    setupEventListeners();
});
