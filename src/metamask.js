// MetaMask Integration for Supply Chain Management System

// Contract address and ABI will be imported in producer.js and consumer.js

// Function to connect to MetaMask
async function connectMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'requestAccounts' });
            
            // Get the connected account
            const account = accounts[0];
            document.getElementById('wallet-address').textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            document.getElementById('connection-status').textContent = 'Connected';
            document.getElementById('connection-status').classList.remove('text-danger');
            document.getElementById('connection-status').classList.add('text-success');
            
            // Setup network switch
            setupNetworkSwitch();
            
            // Initialize contract
            await initContract();
            
            return account;
        } catch (error) {
            console.error("User denied account access", error);
            document.getElementById('connection-status').textContent = 'Connection Failed';
            document.getElementById('connection-status').classList.add('text-danger');
            return null;
        }
    } else {
        console.log('MetaMask is not installed');
        alert('Please install MetaMask to use this application');
        document.getElementById('connection-status').textContent = 'MetaMask Not Found';
        document.getElementById('connection-status').classList.add('text-danger');
        return null;
    }
}

// Function to setup network switch functionality
async function setupNetworkSwitch() {
    const networkSelect = document.getElementById('network-select');
    
    // Add event listener to network select
    networkSelect.addEventListener('change', async () => {
        const networkId = networkSelect.value;
        try {
            await switchNetwork(networkId);
        } catch (error) {
            console.error("Failed to switch network", error);
        }
    });
    
    // Get current network
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    updateNetworkUI(chainId);
    
    // Listen for chain changes
    ethereum.on('chainChanged', (chainId) => {
        updateNetworkUI(chainId);
    });
}

// Function to switch network
async function switchNetwork(networkId) {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${parseInt(networkId).toString(16)}` }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await addNetwork(networkId);
            } catch (addError) {
                console.error("Failed to add network", addError);
            }
        }
    }
}

// Function to add network if not available
async function addNetwork(networkId) {
    let networkParams;
    
    // Define network parameters based on networkId
    switch (networkId) {
        case '97': // BSC Testnet
            networkParams = {
                chainId: '0x61',
                chainName: 'Binance Smart Chain Testnet',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com']
            };
            break;
        case '80001': // Mumbai Testnet
            networkParams = {
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
            };
            break;
        case '5': // Goerli Testnet
            networkParams = {
                chainId: '0x5',
                chainName: 'Goerli Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                blockExplorerUrls: ['https://goerli.etherscan.io']
            };
            break;
        default:
            throw new Error(`Network with ID ${networkId} not supported`);
    }
    
    // Add the network
    await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
    });
}

// Function to update network UI
function updateNetworkUI(chainId) {
    const decimalChainId = parseInt(chainId, 16);
    const networkSelect = document.getElementById('network-select');
    
    // Set the select value based on the current network
    if (networkSelect) {
        if (decimalChainId === 1) {
            networkSelect.value = '1';
            document.getElementById('current-network').textContent = 'Ethereum Mainnet';
        } else if (decimalChainId === 5) {
            networkSelect.value = '5';
            document.getElementById('current-network').textContent = 'Goerli Testnet';
        } else if (decimalChainId === 97) {
            networkSelect.value = '97';
            document.getElementById('current-network').textContent = 'BSC Testnet';
        } else if (decimalChainId === 80001) {
            networkSelect.value = '80001';
            document.getElementById('current-network').textContent = 'Mumbai Testnet';
        } else {
            document.getElementById('current-network').textContent = `Chain ID: ${decimalChainId}`;
        }
    }
}

// Function to check if an account is connected
async function checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const account = accounts[0];
                document.getElementById('wallet-address').textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
                document.getElementById('connection-status').textContent = 'Connected';
                document.getElementById('connection-status').classList.remove('text-danger');
                document.getElementById('connection-status').classList.add('text-success');
                
                setupNetworkSwitch();
                await initContract();
                
                return account;
            } else {
                document.getElementById('connection-status').textContent = 'Not Connected';
                document.getElementById('connection-status').classList.add('text-danger');
                return null;
            }
        } catch (error) {
            console.error("Error checking connection", error);
            return null;
        }
    } else {
        console.log('MetaMask is not installed');
        document.getElementById('connection-status').textContent = 'MetaMask Not Found';
        document.getElementById('connection-status').classList.add('text-danger');
        return null;
    }
}

// Initialize the contract
async function initContract() {
    // This function will be implemented in producer.js and consumer.js
}

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            document.getElementById('wallet-address').textContent = '';
            document.getElementById('connection-status').textContent = 'Disconnected';
            document.getElementById('connection-status').classList.remove('text-success');
            document.getElementById('connection-status').classList.add('text-danger');
        } else {
            // User switched accounts
            const account = accounts[0];
            document.getElementById('wallet-address').textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        }
    });
}

// Check connection status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkConnection();
}); 