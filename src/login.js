// Login page specific functionality
import './index.css';
import { getCurrentUser } from './auth';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded successfully');
    
    // Get MetaMask connection elements
    const connectMetaMaskBtn = document.getElementById('connect-metamask');
    const metamaskStatus = document.getElementById('metamask-status');
    const metamaskWarning = document.getElementById('metamask-warning');
    
    // Get verification elements
    const emailVerificationSection = document.getElementById('email-verification-section');
    const mobileVerificationSection = document.getElementById('mobile-verification-section');
    
    // Tab elements
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    
    // Initialize UI state
    if (emailVerificationSection) emailVerificationSection.style.display = 'none';
    if (mobileVerificationSection) mobileVerificationSection.style.display = 'none';
    
    // For testing purposes, clear any previous login data
    // This ensures the login page appears first during development
    localStorage.removeItem('currentUser');
    
    // But don't clear MetaMask connection
    const isMetaMaskConnected = window.isMetaMaskConnected || false;
    const connectedAccount = localStorage.getItem('lastConnectedAccount');
    
    // Check URL parameters for reset request
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reset') && urlParams.get('reset') === 'true') {
        localStorage.removeItem('currentUser');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check if MetaMask is required
    if (urlParams.has('metamask') && urlParams.get('metamask') === 'required') {
        if (metamaskWarning) {
            metamaskWarning.style.display = 'block';
            metamaskWarning.innerHTML = '<div class="alert alert-warning">Please connect your MetaMask wallet before logging in or registering.</div>';
        }
    }
    
    // Check if wallet mismatch occurred
    if (urlParams.has('wallet') && urlParams.get('wallet') === 'mismatch') {
        if (metamaskWarning) {
            metamaskWarning.style.display = 'block';
            metamaskWarning.innerHTML = '<div class="alert alert-danger">Your wallet address doesn\'t match your account. Please connect the correct wallet or create a new account.</div>';
        }
    }
    
    // Check if user is already logged in, redirect if necessary
    const currentUser = getCurrentUser();
    if (currentUser && isMetaMaskConnected && connectedAccount) {
        // Verify the wallet address matches
        if (currentUser.walletAddress === connectedAccount) {
            redirectToDashboard(currentUser.userType);
        } else {
            // Clear the session since wallet doesn't match
            localStorage.removeItem('currentUser');
            if (metamaskWarning) {
                metamaskWarning.style.display = 'block';
                metamaskWarning.innerHTML = '<div class="alert alert-danger">Your wallet address doesn\'t match your account. Please connect the correct wallet or create a new account.</div>';
            }
        }
    }
    
    // Connect MetaMask button
    if (connectMetaMaskBtn) {
        // Update button state based on MetaMask connection
        updateConnectButton();
        
        connectMetaMaskBtn.addEventListener('click', async function() {
            try {
                // If already connected, do nothing
                if (isMetaMaskConnected && connectedAccount) {
                    alert('MetaMask is already connected with account: ' + 
                          connectedAccount.substring(0, 6) + '...' + 
                          connectedAccount.substring(38));
                    return;
                }
                
                // Try to connect
                if (typeof window.ethereum !== 'undefined') {
                    connectMetaMaskBtn.disabled = true;
                    connectMetaMaskBtn.textContent = 'Connecting...';
                    
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    
                    if (accounts.length > 0) {
                        const account = accounts[0];
                        localStorage.setItem('lastConnectedAccount', account);
                        window.isMetaMaskConnected = true;
                        
                        updateConnectButton();
                        
                        // Show success message
                        if (metamaskWarning) {
                            metamaskWarning.style.display = 'block';
                            metamaskWarning.innerHTML = '<div class="alert alert-success">MetaMask connected successfully! You can now login or register.</div>';
                        }
                    }
                } else {
                    alert('MetaMask is not installed. Please install MetaMask extension and refresh the page.');
                }
            } catch (error) {
                console.error('Failed to connect to MetaMask:', error);
                alert('Failed to connect to MetaMask: ' + error.message);
            } finally {
                connectMetaMaskBtn.disabled = false;
            }
        });
    }
    
    // Update connect button state
    function updateConnectButton() {
        if (!connectMetaMaskBtn) return;
        
        // Check current connection state
        const isConnected = window.isMetaMaskConnected || false;
        const account = localStorage.getItem('lastConnectedAccount');
        
        if (isConnected && account) {
            connectMetaMaskBtn.textContent = 'MetaMask Connected';
            connectMetaMaskBtn.classList.remove('btn-primary');
            connectMetaMaskBtn.classList.add('btn-success');
            connectMetaMaskBtn.disabled = true;
            
            // Show account info
            const shortAccount = account.substring(0, 6) + '...' + account.substring(38);
            
            // If metamaskStatus exists, update it
            if (metamaskStatus) {
                metamaskStatus.style.display = 'block';
                metamaskStatus.innerHTML = `Connected: <strong>${shortAccount}</strong>`;
            }
        } else {
            connectMetaMaskBtn.textContent = 'Connect MetaMask';
            connectMetaMaskBtn.classList.remove('btn-success');
            connectMetaMaskBtn.classList.add('btn-primary');
            connectMetaMaskBtn.disabled = false;
            
            // Hide account info
            if (metamaskStatus) {
                metamaskStatus.style.display = 'none';
            }
        }
    }
    
    // Initialize verification code inputs to only accept numbers
    const verificationCodeInput = document.getElementById('verification-code');
    if (verificationCodeInput) {
        verificationCodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
        });
    }
    
    const emailVerificationCodeInput = document.getElementById('email-verification-code');
    if (emailVerificationCodeInput) {
        emailVerificationCodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
        });
    }
    
    const mobileVerificationCodeInput = document.getElementById('mobile-verification-code');
    if (mobileVerificationCodeInput) {
        mobileVerificationCodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
        });
    }
    
    // Initialize mobile number input to only accept numbers
    const mobileInput = document.getElementById('register-mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
        });
    }
    
    // Password strength indicator
    const registerPassword = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (registerPassword) {
        registerPassword.addEventListener('input', checkPasswordStrength);
    }
    
    if (confirmPassword && registerPassword) {
        confirmPassword.addEventListener('input', function() {
            if (confirmPassword.value === registerPassword.value) {
                confirmPassword.classList.remove('is-invalid');
                confirmPassword.classList.add('is-valid');
            } else {
                confirmPassword.classList.remove('is-valid');
                confirmPassword.classList.add('is-invalid');
            }
        });
    }
    
    function checkPasswordStrength() {
        const password = registerPassword.value;
        let strength = 0;
        
        // Add visual indicator for password strength
        const feedbackDiv = document.getElementById('password-strength-feedback');
        if (!feedbackDiv) {
            const newFeedbackDiv = document.createElement('div');
            newFeedbackDiv.id = 'password-strength-feedback';
            newFeedbackDiv.className = 'form-text mt-2';
            registerPassword.parentNode.appendChild(newFeedbackDiv);
        }
        
        // Create progress bar if it doesn't exist
        let progressBar = document.getElementById('password-strength-meter');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'password-strength-meter';
            progressBar.className = 'progress mt-1';
            progressBar.innerHTML = '<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
            
            // Insert after the password field
            registerPassword.parentNode.insertBefore(progressBar, registerPassword.nextSibling);
        }
        
        if (password.length >= 8) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
        
        const progressBarInner = progressBar.querySelector('.progress-bar');
        progressBarInner.style.width = strength + '%';
        progressBarInner.setAttribute('aria-valuenow', strength);
        
        // Update progress bar color
        if (strength < 50) {
            progressBarInner.className = 'progress-bar bg-danger';
        } else if (strength < 75) {
            progressBarInner.className = 'progress-bar bg-warning';
        } else {
            progressBarInner.className = 'progress-bar bg-success';
        }
        
        // Update feedback text
        const feedbackText = document.getElementById('password-strength-feedback');
        if (feedbackText) {
            if (strength < 50) {
                feedbackText.textContent = 'Weak: Add uppercase letters, numbers, and special characters';
                feedbackText.className = 'form-text text-danger mt-2';
            } else if (strength < 75) {
                feedbackText.textContent = 'Moderate: Your password could be stronger';
                feedbackText.className = 'form-text text-warning mt-2';
            } else {
                feedbackText.textContent = 'Strong: Your password meets all requirements';
                feedbackText.className = 'form-text text-success mt-2';
            }
        }
    }
    
    function redirectToDashboard(userType) {
        if (userType === 'producer') {
            window.location.href = 'producer.html';
        } else {
            window.location.href = 'consumer.html';
        }
    }
    
    // Handle tab switching to reset verification sections
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', function() {
            if (emailVerificationSection) emailVerificationSection.style.display = 'none';
            if (mobileVerificationSection) mobileVerificationSection.style.display = 'none';
        });
        
        registerTab.addEventListener('click', function() {
            if (emailVerificationSection) emailVerificationSection.style.display = 'none';
            if (mobileVerificationSection) mobileVerificationSection.style.display = 'none';
        });
    }
}); 