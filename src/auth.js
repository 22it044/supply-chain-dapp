// Authentication, verification, and SSO functionality
import './index.css';

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements for authentication on login page
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const verificationSection = document.getElementById('verification-section');
    const sendCodeBtn = document.getElementById('send-code-btn');
    const verificationCode = document.getElementById('verification-code');
    const googleLoginBtn = document.getElementById('google-login');
    const microsoftLoginBtn = document.getElementById('microsoft-login');
    const acceptTermsBtn = document.getElementById('accept-terms-btn');
    
    // Get DOM elements for authentication on dashboard pages
    const userStatus = document.getElementById('user-status');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const connectButton = document.getElementById('connect-button');
    const metamaskStatus = document.getElementById('metamask-status');
    const walletInfo = document.getElementById('wallet-info');
    
    // Registration elements
    const registerForm = document.getElementById('register-form');
    const registerName = document.getElementById('register-name');
    const registerEmail = document.getElementById('register-email');
    const registerMobile = document.getElementById('register-mobile');
    const registerPassword = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');
    const producerType = document.getElementById('producer-type');
    const consumerType = document.getElementById('consumer-type');
    const termsAgree = document.getElementById('terms-agree');
    
    // Verification elements
    const emailVerificationSection = document.getElementById('email-verification-section');
    const mobileVerificationSection = document.getElementById('mobile-verification-section');
    const emailVerificationCode = document.getElementById('email-verification-code');
    const mobileVerificationCode = document.getElementById('mobile-verification-code');
    const sendEmailCodeBtn = document.getElementById('send-email-code-btn');
    const sendMobileCodeBtn = document.getElementById('send-mobile-code-btn');
    
    // Check if MetaMask is connected before proceeding
    const isMetaMaskConnected = window.isMetaMaskConnected || false;
    const connectedAccount = localStorage.getItem('lastConnectedAccount');
    
    // MetaMask warning elements
    const metamaskWarning = document.getElementById('metamask-warning');
    
    // Check if we're on the login page or dashboard pages
    const isLoginPage = window.location.pathname.includes('login.html') || 
                        window.location.pathname === '/' || 
                        window.location.pathname.endsWith('index.html');
    const isProducerPage = window.location.pathname.includes('producer.html');
    const isConsumerPage = window.location.pathname.includes('consumer.html');
    const isDashboardPage = isProducerPage || isConsumerPage;
    
    // First check for MetaMask connection
    if (isDashboardPage && (!isMetaMaskConnected || !connectedAccount)) {
        // Not connected to MetaMask, redirect to login
        window.location.href = 'login.html?metamask=required';
        return;
    }
    
    // Show MetaMask warning if parameter is present
    if (isLoginPage && window.location.search.includes('metamask=required')) {
        if (metamaskWarning) {
            metamaskWarning.style.display = 'block';
            metamaskWarning.innerHTML = '<div class="alert alert-warning">Please connect your MetaMask wallet before logging in or registering.</div>';
        }
    }
    
    // Redirect logic - check if user should be on this page
    if (!isLoginPage) {
        // If on any page other than login, check if authenticated
        if (!isUserLoggedIn()) {
            // Not logged in, redirect to login page
            window.location.href = 'login.html';
            return;
        } else {
            // User is logged in, check if they should be on this page
            const user = getCurrentUser();
            
            // Also check if their wallet is associated with their account
            if (!user.walletAddress || user.walletAddress !== connectedAccount) {
                logout();
                window.location.href = 'login.html?wallet=mismatch';
                return;
            }
            
            if (isProducerPage && user.userType !== 'producer') {
                // Redirect producer trying to access consumer page
                window.location.href = 'consumer.html';
                return;
            } else if (isConsumerPage && user.userType !== 'consumer') {
                // Redirect consumer trying to access producer page
                window.location.href = 'producer.html';
                return;
            }
            
            // Show the appropriate dashboard elements
            updateDashboardUI(user);
        }
    } else {
        // On login page, we do NOT redirect even if authenticated
        // The login.js will handle this if needed
        console.log('On login page, no automatic redirection.');
    }
    
    // Handle Accept Terms button
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', function() {
            if (termsAgree) {
                termsAgree.checked = true;
            }
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset validation
            loginForm.classList.remove('was-validated');
            
            // Check if MetaMask is connected
            if (!isMetaMaskConnected || !connectedAccount) {
                showValidationError(loginEmail, 'Please connect your MetaMask wallet first');
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-danger">Please connect your MetaMask wallet before continuing.</div>';
                }
                return;
            }
            
            // Validate form
            if (!validateEmail(loginEmail.value)) {
                showValidationError(loginEmail, 'Please enter a valid email address');
                return;
            }
            
            if (loginPassword.value.length < 8) {
                showValidationError(loginPassword, 'Password must be at least 8 characters');
                return;
            }
            
            // If first login attempt, show verification code section
            if (verificationSection.style.display === 'none') {
                verificationSection.style.display = 'block';
                // Automatically send the verification code
                sendVerificationCodes(loginEmail.value);
                return;
            }
            
            // Verify the code
            if (!verificationCode.value || verificationCode.value.length !== 6) {
                showValidationError(verificationCode, 'Please enter the 6-digit verification code');
                return;
            }
            
            // Simulate verification (in a real app, this would call your API)
            // Check that the code is correct (in this demo we accept 123456)
            if (verificationCode.value !== '123456') {
                showValidationError(verificationCode, 'Invalid verification code. Please try again.');
                return;
            }
            
            // Mock successful login
            loginSuccessful({
                name: 'Test User',
                email: loginEmail.value,
                userType: getUserTypeForWallet(connectedAccount),
                walletAddress: connectedAccount
            });
            
            // Redirect to appropriate dashboard
            redirectLoggedInUser();
        });
    }
    
    // Send verification codes to both email and mobile
    function sendVerificationCodes(email, mobile) {
        // Show the verification sections
        if (emailVerificationSection) emailVerificationSection.style.display = 'block';
        if (mobileVerificationSection) mobileVerificationSection.style.display = 'block';
        
        // Send email code
        if (sendEmailCodeBtn) {
            sendEmailCodeBtn.disabled = true;
            sendEmailCodeBtn.textContent = 'Sending...';
            
            setTimeout(function() {
                sendEmailCodeBtn.textContent = 'Code Sent';
                alert('Email verification code sent. For demo purposes, use code: 123456');
                
                startResendCountdown(sendEmailCodeBtn);
            }, 1500);
        }
        
        // Send mobile code if mobile number exists
        if (sendMobileCodeBtn && mobile) {
            sendMobileCodeBtn.disabled = true;
            sendMobileCodeBtn.textContent = 'Sending...';
            
            setTimeout(function() {
                sendMobileCodeBtn.textContent = 'Code Sent';
                alert('SMS verification code sent. For demo purposes, use code: 654321');
                
                startResendCountdown(sendMobileCodeBtn);
            }, 2000);
        }
    }
    
    // Start countdown for resend buttons
    function startResendCountdown(button) {
        let countdown = 60;
        const countdownInterval = setInterval(function() {
            countdown--;
            button.textContent = `Resend (${countdown}s)`;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                button.textContent = 'Resend Code';
                button.disabled = false;
            }
        }, 1000);
    }
    
    // Handle send verification code button
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function() {
            // Validate email first
            if (!validateEmail(loginEmail.value)) {
                showValidationError(loginEmail, 'Please enter a valid email address');
                return;
            }
            
            // Check if MetaMask is connected
            if (!isMetaMaskConnected || !connectedAccount) {
                showValidationError(loginEmail, 'Please connect your MetaMask wallet first');
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-danger">Please connect your MetaMask wallet before continuing.</div>';
                }
                return;
            }
            
            // Simulate sending code (in a real app, this would call your API)
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = 'Sending...';
            
            setTimeout(function() {
                sendCodeBtn.textContent = 'Code Sent';
                alert('Verification code sent to your email. Check your inbox.\n\nFor demo purposes, use code: 123456');
                
                startResendCountdown(sendCodeBtn);
            }, 2000);
        });
    }
    
    // Handle SSO with Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            // Check if MetaMask is connected first
            if (!isMetaMaskConnected || !connectedAccount) {
                alert('Please connect your MetaMask wallet before using SSO.');
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-danger">Please connect your MetaMask wallet before continuing.</div>';
                }
                return;
            }
            
            // In a real application, this would redirect to Google OAuth
            alert('Redirecting to Google for authentication...');
            
            // Simulate successful SSO login after 2 seconds
            setTimeout(function() {
                loginSuccessful({
                    name: 'Google User',
                    email: 'google.user@example.com',
                    userType: getUserTypeForWallet(connectedAccount),
                    walletAddress: connectedAccount
                });
                
                // Redirect to appropriate dashboard
                redirectLoggedInUser();
            }, 2000);
        });
    }
    
    // Handle SSO with Microsoft
    if (microsoftLoginBtn) {
        microsoftLoginBtn.addEventListener('click', function() {
            // Check if MetaMask is connected first
            if (!isMetaMaskConnected || !connectedAccount) {
                alert('Please connect your MetaMask wallet before using SSO.');
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-danger">Please connect your MetaMask wallet before continuing.</div>';
                }
                return;
            }
            
            // In a real application, this would redirect to Microsoft OAuth
            alert('Redirecting to Microsoft for authentication...');
            
            // Simulate successful SSO login after 2 seconds
            setTimeout(function() {
                loginSuccessful({
                    name: 'Microsoft User',
                    email: 'microsoft.user@example.com',
                    userType: getUserTypeForWallet(connectedAccount),
                    walletAddress: connectedAccount
                });
                
                // Redirect to appropriate dashboard
                redirectLoggedInUser();
            }, 2000);
        });
    }
    
    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset validation
            registerForm.classList.remove('was-validated');
            
            // Check if MetaMask is connected
            if (!isMetaMaskConnected || !connectedAccount) {
                alert('Please connect your MetaMask wallet before registering.');
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-danger">Please connect your MetaMask wallet before continuing.</div>';
                }
                return;
            }
            
            // Validate form
            let isValid = true;
            
            if (!registerName.value.trim()) {
                showValidationError(registerName, 'Name is required');
                isValid = false;
            }
            
            if (!validateEmail(registerEmail.value)) {
                showValidationError(registerEmail, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!validateMobile(registerMobile.value)) {
                showValidationError(registerMobile, 'Please enter a valid 10-digit mobile number');
                isValid = false;
            }
            
            if (registerPassword.value.length < 8) {
                showValidationError(registerPassword, 'Password must be at least 8 characters');
                isValid = false;
            }
            
            if (confirmPassword.value !== registerPassword.value) {
                showValidationError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }
            
            if (!producerType.checked && !consumerType.checked) {
                document.querySelector('[name="user-type"]').parentElement.classList.add('was-validated');
                isValid = false;
            }
            
            if (!termsAgree.checked) {
                termsAgree.classList.add('is-invalid');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Show verification sections for both email and mobile
            if (emailVerificationSection) emailVerificationSection.style.display = 'block';
            if (mobileVerificationSection) mobileVerificationSection.style.display = 'block';
            
            // Send verification codes
            sendVerificationCodes(registerEmail.value, registerMobile.value);
            
            // Change the register button's text and behavior
            const registerSubmitBtn = registerForm.querySelector('button[type="submit"]');
            if (registerSubmitBtn) {
                registerSubmitBtn.textContent = 'Verify & Complete Registration';
                registerSubmitBtn.classList.add('verification-mode');
                
                // Add a new event listener for the verification process
                if (!registerSubmitBtn.hasVerificationListener) {
                    registerSubmitBtn.hasVerificationListener = true;
                    registerSubmitBtn.addEventListener('click', function(e) {
                        if (registerSubmitBtn.classList.contains('verification-mode')) {
                            e.preventDefault();
                            
                            // Verify both codes
                            const emailCode = emailVerificationCode ? emailVerificationCode.value : '';
                            const mobileCode = mobileVerificationCode ? mobileVerificationCode.value : '';
                            
                            if (emailCode !== '123456') {
                                alert('Invalid email verification code. For demo, use: 123456');
                                return;
                            }
                            
                            if (mobileCode !== '654321') {
                                alert('Invalid mobile verification code. For demo, use: 654321');
                                return;
                            }
                            
                            // Register the user with their wallet address
                            const userType = producerType.checked ? 'producer' : 'consumer';
                            
                            // Store the wallet association
                            loginSuccessful({
                                name: registerName.value,
                                email: registerEmail.value,
                                mobile: registerMobile.value,
                                userType: userType,
                                walletAddress: connectedAccount
                            });
                            
                            // Register on the blockchain if needed (for real implementation)
                            // This would call contract.methods.registerProducer or registerConsumer
                            
                            alert('Registration successful! You will be redirected to your dashboard.');
                            redirectLoggedInUser();
                        }
                    });
                }
            }
        });
    }
    
    // Helper function to determine user type based on wallet
    function getUserTypeForWallet(walletAddress) {
        // This would normally query the blockchain
        // For demo, we'll use a simple check based on the last character
        const lastChar = walletAddress.slice(-1).toLowerCase();
        return parseInt(lastChar, 16) % 2 === 0 ? 'producer' : 'consumer';
    }
    
    // Redirect to appropriate dashboard based on user type
    function redirectLoggedInUser() {
        const user = getCurrentUser();
        if (!user) return;
        
        if (user.userType === 'producer') {
            window.location.href = 'producer.html';
        } else {
            window.location.href = 'consumer.html';
        }
    }
    
    // Update dashboard UI elements
    function updateDashboardUI(user) {
        if (!user) return;
        
        if (userStatus) {
            userStatus.textContent = `Logged in as: ${user.name} (${user.userType})`;
        }
        
        // Show the wallet address if available
        if (walletInfo && user.walletAddress) {
            const shortenedAddress = `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(38)}`;
            walletInfo.textContent = `Wallet: ${shortenedAddress}`;
        }
    }
    
    // Record successful login
    function loginSuccessful(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    // Email validation regex
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Mobile validation regex (10 digits)
    function validateMobile(mobile) {
        const re = /^[0-9]{10}$/;
        return re.test(String(mobile));
    }
    
    // Show validation error
    function showValidationError(element, message) {
        element.classList.add('is-invalid');
        
        let feedbackElement = element.parentElement.querySelector('.invalid-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'invalid-feedback';
            element.parentElement.appendChild(feedbackElement);
        }
        
        feedbackElement.textContent = message;
    }
});

// Check if user is logged in
export function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user details
export function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Logout and clear session
export function logout() {
    localStorage.removeItem('currentUser');
    // Don't clear MetaMask connection status here
}

// Get user's wallet address
export function getUserWalletAddress() {
    const user = getCurrentUser();
    return user ? user.walletAddress : null;
}

// Check if wallet matches the stored user
export function isWalletMatched() {
    const user = getCurrentUser();
    const connectedAccount = localStorage.getItem('lastConnectedAccount');
    return user && user.walletAddress && user.walletAddress === connectedAccount;
} 