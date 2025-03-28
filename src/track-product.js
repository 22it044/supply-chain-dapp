// Track product page functionality
import './index.css';

// Import functions from metamask module
let checkConnection, connectMetaMask, disconnectMetaMask;

// Try to import from modules (may fail in older browsers)
try {
    const metamaskModule = require('./metamask.js');
    checkConnection = metamaskModule.checkConnection;
    connectMetaMask = metamaskModule.connectMetaMask;
    disconnectMetaMask = metamaskModule.disconnectMetaMask;
} catch (e) {
    console.log('Error importing modules:', e);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Track product page loaded successfully');
    
    // Get UI elements
    const connectButton = document.getElementById('connect-button');
    const disconnectButton = document.getElementById('disconnect-button');
    const walletInfo = document.getElementById('wallet-info');
    const metamaskWarning = document.getElementById('metamask-warning');
    const verifyProductBtn = document.getElementById('verify-product-btn');
    const productIdInput = document.getElementById('product-id-input');
    const verificationResult = document.getElementById('verification-result');
    
    // Initialize UI
    async function initUI() {
        // Check if MetaMask is available
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is available');
            await initMetaMask();
        } else {
            console.log('MetaMask is not available');
            showMetaMaskWarning("MetaMask extension not detected. Please install MetaMask to use this application.");
            disableTrackingUI();
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
                showConnectedUI(account);
            } else {
                console.log('Not connected to MetaMask');
                showDisconnectedUI();
            }
        } catch (error) {
            console.error('Error initializing MetaMask:', error);
            showMetaMaskWarning("Error connecting to MetaMask: " + error.message);
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
            } else {
                throw new Error('Failed to connect to MetaMask');
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            showMetaMaskWarning("Error connecting to MetaMask: " + error.message);
            showDisconnectedUI();
        } finally {
            if (connectButton) {
                connectButton.disabled = false;
                connectButton.innerHTML = '<i class="bi bi-wallet2"></i> Connect MetaMask';
            }
        }
    }
    
    // Disconnect from MetaMask
    async function disconnectFromMetaMask() {
        if (disconnectButton) {
            disconnectButton.disabled = true;
            disconnectButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Disconnecting...';
        }
        
        try {
            await disconnectMetaMask();
            showDisconnectedUI();
        } catch (error) {
            console.error('Error disconnecting from MetaMask:', error);
            showMetaMaskWarning("Error disconnecting from MetaMask: " + error.message);
        } finally {
            if (disconnectButton) {
                disconnectButton.disabled = false;
                disconnectButton.innerHTML = '<i class="bi bi-box-arrow-right"></i> Disconnect';
            }
        }
    }
    
    // Show connected UI state
    function showConnectedUI(account) {
        if (connectButton) connectButton.style.display = 'none';
        if (disconnectButton) disconnectButton.style.display = 'inline-block';
        
        if (walletInfo) {
            const shortenedAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            walletInfo.textContent = `Wallet: ${shortenedAddress}`;
            walletInfo.style.display = 'block';
        }
        
        if (metamaskWarning) metamaskWarning.style.display = 'none';
        enableTrackingUI();
    }
    
    // Show disconnected UI state
    function showDisconnectedUI() {
        if (connectButton) connectButton.style.display = 'inline-block';
        if (disconnectButton) disconnectButton.style.display = 'none';
        
        if (walletInfo) walletInfo.style.display = 'none';
        
        showMetaMaskWarning("Please connect your MetaMask wallet to track products.");
        disableTrackingUI();
    }
    
    // Show MetaMask warning
    function showMetaMaskWarning(message) {
        if (metamaskWarning) {
            metamaskWarning.textContent = message;
            metamaskWarning.style.display = 'block';
        }
    }
    
    // Enable tracking UI
    function enableTrackingUI() {
        if (verifyProductBtn) verifyProductBtn.disabled = false;
        if (productIdInput) productIdInput.disabled = false;
    }
    
    // Disable tracking UI
    function disableTrackingUI() {
        if (verifyProductBtn) verifyProductBtn.disabled = true;
        if (productIdInput) productIdInput.disabled = true;
    }
    
    // Verify product function
    async function verifyProduct() {
        if (!productIdInput || !verificationResult) return;
        
        const productId = parseInt(productIdInput.value);
        
        if (isNaN(productId) || productId <= 0) {
            verificationResult.innerHTML = `
                <div class="alert alert-danger mt-3">
                    Please enter a valid product ID.
                </div>
            `;
            return;
        }
        
        try {
            verificationResult.innerHTML = `
                <div class="d-flex justify-content-center mt-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
            
            // Check if MetaMask is connected
            if (!window.isMetaMaskConnected) {
                throw new Error("Please connect to MetaMask first to verify the product.");
            }
            
            // Get product details
            const product = await window.contract.methods.getProductById(productId).call();
            
            // Get product history
            const history = await window.contract.methods.getTrackingHistory(productId).call();
            
            // Format the output
            const statusNames = [
                "Created", "Produced", "Shipped to Distributor", "Received by Distributor", 
                "Shipped to Retailer", "Received by Retailer", "Available", "Sold"
            ];
            
            // Get latest status
            const latestStatus = statusNames[product.status] || "Unknown";
            const isAuthentic = history.length > 0;
            
            verificationResult.innerHTML = `
                <div class="alert ${isAuthentic ? 'alert-success' : 'alert-danger'} mt-3">
                    <h5 class="alert-heading">${isAuthentic ? 'Authentic Product' : 'Product Not Verified'}</h5>
                    ${isAuthentic ? `
                        <p><strong>Product ID:</strong> ${productId}</p>
                        <p><strong>Name:</strong> ${product.name}</p>
                        <p><strong>Current Status:</strong> ${latestStatus}</p>
                        <p><strong>Supply Chain Events:</strong> ${history.length}</p>
                        <hr>
                        <p class="mb-0">This product has verified tracking information on the blockchain.</p>
                    ` : `
                        <p>The product ID ${productId} could not be verified on the blockchain.</p>
                        <p class="mb-0">Please check the ID and try again, or contact support.</p>
                    `}
                </div>
                ${isAuthentic ? `
                    <div class="mt-3">
                        <h6>Supply Chain Timeline</h6>
                        <div class="timeline">
                            ${history.map((event, index) => `
                                <div class="timeline-item">
                                    <div class="timeline-marker"></div>
                                    <div class="timeline-content">
                                        <h6>${statusNames[event.status] || "Unknown"}</h6>
                                        <p class="text-muted small">${new Date(event.timestamp * 1000).toLocaleString()}</p>
                                        <p><strong>Location:</strong> ${event.location || "N/A"}</p>
                                        <p>${event.comments || "No additional information"}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            `;
            
        } catch (error) {
            console.error('Error verifying product:', error);
            verificationResult.innerHTML = `
                <div class="alert alert-danger mt-3">
                    Error verifying product: ${error.message}
                </div>
            `;
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Connect button
        if (connectButton) {
            connectButton.addEventListener('click', connectToMetaMask);
        }
        
        // Disconnect button
        if (disconnectButton) {
            disconnectButton.addEventListener('click', disconnectFromMetaMask);
        }
        
        // Verify product button
        if (verifyProductBtn) {
            verifyProductBtn.addEventListener('click', verifyProduct);
        }
        
        // Allow Enter key to submit in the product ID field
        if (productIdInput) {
            productIdInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    verifyProduct();
                }
            });
        }
    }
    
    // Initialize the page
    initUI();
    setupEventListeners();
}); 