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
    const metamaskSection = document.getElementById('metamask-section');
    const connectMetamaskBtn = document.getElementById('connect-metamask');
    
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
    
    // SSO status indicator
    let ssoInProgress = false;
    
    // Authentication state variables
    let userAuthenticated = false;
    let pendingUser = null;
    
    // Check if we're on the login page or dashboard pages
    const isLoginPage = window.location.pathname.includes('login.html') || 
                        window.location.pathname === '/' || 
                        window.location.pathname.endsWith('index.html');
    const isProducerPage = window.location.pathname.includes('producer.html');
    const isConsumerPage = window.location.pathname.includes('consumer.html');
    const isDashboardPage = isProducerPage || isConsumerPage;
    
    // For dashboard pages, we still need MetaMask
    if (isDashboardPage && (!isMetaMaskConnected || !connectedAccount)) {
        // Not connected to MetaMask, redirect to login
        window.location.href = 'login.html?metamask=required';
        return;
    }
    
    // Show MetaMask warning if parameter is present
    if (isLoginPage && window.location.search.includes('metamask=required')) {
        if (metamaskWarning) {
            metamaskWarning.style.display = 'block';
            metamaskWarning.innerHTML = '<div class="alert alert-warning">Please connect your MetaMask wallet before accessing the dashboard.</div>';
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
            
            // Check that the code is correct (in this demo we accept 123456)
            if (verificationCode.value !== '123456') {
                showValidationError(verificationCode, 'Invalid verification code. Please try again.');
                return;
            }
            
            // Authenticate the user
            userAuthenticated = true;
            
            // Store pending user data (will be finalized after MetaMask connection)
            pendingUser = {
                name: 'Test User',
                email: loginEmail.value,
                userType: 'unknown', // Will be determined after MetaMask connection
                authenticated: true
            };
            
            // Show successful login message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success mt-3';
            successAlert.innerHTML = 'Login successful! Now please connect your MetaMask wallet to continue.';
            loginForm.appendChild(successAlert);
            
            // Hide the login form elements
            loginForm.querySelectorAll('input, button').forEach(element => {
                if (element.type !== 'submit') {
                    element.disabled = true;
                }
            });
            
            // Hide the login button and show a completion message
            const loginButton = loginForm.querySelector('button[type="submit"]');
            if (loginButton) {
                loginButton.style.display = 'none';
            }
            
            // Show and highlight the MetaMask section
            if (metamaskSection) {
                metamaskSection.classList.add('border', 'border-primary');
                metamaskSection.scrollIntoView({ behavior: 'smooth' });
                
                // Add pulsing effect to the connect button
                if (connectMetamaskBtn) {
                    connectMetamaskBtn.classList.add('btn-lg');
                    connectMetamaskBtn.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
                }
            }
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
    
    // Handle MetaMask connection after authentication
    if (connectMetamaskBtn) {
        connectMetamaskBtn.addEventListener('click', function() {
            // Check if user is authenticated first
            if (!userAuthenticated && !pendingUser) {
                alert('Please login or register first before connecting your wallet.');
                return;
            }
            
            // Connect to MetaMask
            if (window.ethereum) {
                window.ethereum.request({ method: 'eth_requestAccounts' })
                    .then(function(accounts) {
                        if (accounts.length > 0) {
                            // Store the connected account
                            const connectedAddress = accounts[0];
                            localStorage.setItem('lastConnectedAccount', connectedAddress);
                            window.isMetaMaskConnected = true;
                            
                            // Update UI
                            if (metamaskStatus) {
                                metamaskStatus.style.display = 'block';
                                metamaskStatus.textContent = `Connected: ${connectedAddress.substring(0, 6)}...${connectedAddress.substring(38)}`;
                            }
                            
                            if (connectMetamaskBtn) {
                                connectMetamaskBtn.disabled = true;
                                connectMetamaskBtn.textContent = 'Connected';
                                connectMetamaskBtn.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
                            }
                            
                            // Complete user registration with the wallet address
                            if (pendingUser) {
                                // Determine user type based on wallet (this is simplified)
                                pendingUser.userType = getUserTypeForWallet(connectedAddress);
                                pendingUser.walletAddress = connectedAddress;
                                
                                // Store in localStorage
                                loginSuccessful(pendingUser);
                                
                                // Show success message and redirect
                                if (metamaskWarning) {
                                    metamaskWarning.style.display = 'block';
                                    metamaskWarning.innerHTML = '<div class="alert alert-success">Wallet connected successfully! Redirecting to your dashboard...</div>';
                                }
                                
                                // Redirect to appropriate dashboard after a short delay
                                setTimeout(redirectLoggedInUser, 2000);
                            }
                        }
                    })
                    .catch(function(error) {
                        console.error(error);
                        if (metamaskWarning) {
                            metamaskWarning.style.display = 'block';
                            metamaskWarning.innerHTML = `<div class="alert alert-danger">Error connecting to MetaMask: ${error.message}</div>`;
                        }
                    });
            } else {
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-warning">MetaMask is not installed. Please install MetaMask to continue.</div>';
                }
            }
        });
    }
    
    // Handle SSO with Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            // Prevent multiple clicks during SSO process
            if (ssoInProgress) {
                return;
            }
            
            // Set SSO in progress
            ssoInProgress = true;
            googleLoginBtn.disabled = true;
            googleLoginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';
            
            // In a real application, this would redirect to Google OAuth
            // For this demo, we'll simulate the OAuth flow
            
            // Create a simple modal to simulate the Google login popup
            const ssoModal = document.createElement('div');
            ssoModal.className = 'modal fade';
            ssoModal.id = 'ssoModal';
            ssoModal.setAttribute('tabindex', '-1');
            ssoModal.setAttribute('aria-hidden', 'true');
            
            ssoModal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="20" height="20" class="me-2">
                                Sign in with Google
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="google-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="google-email" value="google.user@example.com" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="google-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="google-password" value="********" readonly>
                            </div>
                            <div class="alert alert-info">
                                <small>This is a demo simulation of Google SSO. In a real application, you would be redirected to Google's secure login page.</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="simulate-google-auth">Sign In</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(ssoModal);
            
            // Show the modal
            const modalInstance = new bootstrap.Modal(ssoModal);
            modalInstance.show();
            
            // Handle simulated auth
            document.getElementById('simulate-google-auth').addEventListener('click', function() {
                // Hide the modal
                modalInstance.hide();
                
                // Show loading message
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-info">Authenticating with Google...</div>';
                }
                
                // Simulate SSO success after delay
                setTimeout(function() {
                    // Set user as authenticated
                    userAuthenticated = true;
                    
                    // Store pending user info
                    pendingUser = {
                        name: 'Google User',
                        email: 'google.user@example.com',
                        userType: 'unknown', // To be determined after MetaMask connection
                        ssoProvider: 'google',
                        authenticated: true
                    };
                    
                    // Show success message
                    if (metamaskWarning) {
                        metamaskWarning.style.display = 'block';
                        metamaskWarning.innerHTML = '<div class="alert alert-success">Successfully authenticated with Google! Now please connect your MetaMask wallet to continue.</div>';
                    }
                    
                    // Show and highlight the MetaMask section
                    if (metamaskSection) {
                        metamaskSection.classList.add('border', 'border-primary');
                        metamaskSection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Add pulsing effect to the connect button
                        if (connectMetamaskBtn) {
                            connectMetamaskBtn.classList.add('btn-lg');
                            connectMetamaskBtn.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
                        }
                    }
                    
                    // Disable the login/register tabs and forms
                    const authTabs = document.getElementById('authTabs');
                    if (authTabs) {
                        authTabs.querySelectorAll('button').forEach(button => {
                            button.disabled = true;
                        });
                    }
                    
                    document.querySelectorAll('#login-form, #register-form').forEach(form => {
                        form.querySelectorAll('input, button').forEach(element => {
                            element.disabled = true;
                        });
                    });
                }, 2000);
            });
            
            // Reset state when modal is closed or canceled
            ssoModal.addEventListener('hidden.bs.modal', function() {
                resetSSOState(googleLoginBtn);
                // Remove modal from DOM after it's hidden
                ssoModal.remove();
            });
        });
    }
    
    // Handle SSO with Microsoft
    if (microsoftLoginBtn) {
        microsoftLoginBtn.addEventListener('click', function() {
            // Prevent multiple clicks during SSO process
            if (ssoInProgress) {
                return;
            }
            
            // Set SSO in progress
            ssoInProgress = true;
            microsoftLoginBtn.disabled = true;
            microsoftLoginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';
            
            // In a real application, this would redirect to Microsoft OAuth
            // For this demo, we'll simulate the OAuth flow
            
            // Create a simple modal to simulate the Microsoft login popup
            const ssoModal = document.createElement('div');
            ssoModal.className = 'modal fade';
            ssoModal.id = 'ssoModal';
            ssoModal.setAttribute('tabindex', '-1');
            ssoModal.setAttribute('aria-hidden', 'true');
            
            ssoModal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" width="20" height="20" class="me-2">
                                Sign in with Microsoft
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="microsoft-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="microsoft-email" value="microsoft.user@example.com" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="microsoft-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="microsoft-password" value="********" readonly>
                            </div>
                            <div class="alert alert-info">
                                <small>This is a demo simulation of Microsoft SSO. In a real application, you would be redirected to Microsoft's secure login page.</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="simulate-microsoft-auth">Sign In</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(ssoModal);
            
            // Show the modal
            const modalInstance = new bootstrap.Modal(ssoModal);
            modalInstance.show();
            
            // Handle simulated auth
            document.getElementById('simulate-microsoft-auth').addEventListener('click', function() {
                // Hide the modal
                modalInstance.hide();
                
                // Show loading message
                if (metamaskWarning) {
                    metamaskWarning.style.display = 'block';
                    metamaskWarning.innerHTML = '<div class="alert alert-info">Authenticating with Microsoft...</div>';
                }
                
                // Simulate SSO success after delay
                setTimeout(function() {
                    // Set user as authenticated
                    userAuthenticated = true;
                    
                    // Store pending user info
                    pendingUser = {
                        name: 'Microsoft User',
                        email: 'microsoft.user@example.com',
                        userType: 'unknown', // To be determined after MetaMask connection
                        ssoProvider: 'microsoft',
                        authenticated: true
                    };
                    
                    // Show success message
                    if (metamaskWarning) {
                        metamaskWarning.style.display = 'block';
                        metamaskWarning.innerHTML = '<div class="alert alert-success">Successfully authenticated with Microsoft! Now please connect your MetaMask wallet to continue.</div>';
                    }
                    
                    // Show and highlight the MetaMask section
                    if (metamaskSection) {
                        metamaskSection.classList.add('border', 'border-primary');
                        metamaskSection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Add pulsing effect to the connect button
                        if (connectMetamaskBtn) {
                            connectMetamaskBtn.classList.add('btn-lg');
                            connectMetamaskBtn.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
                        }
                    }
                    
                    // Disable the login/register tabs and forms
                    const authTabs = document.getElementById('authTabs');
                    if (authTabs) {
                        authTabs.querySelectorAll('button').forEach(button => {
                            button.disabled = true;
                        });
                    }
                    
                    document.querySelectorAll('#login-form, #register-form').forEach(form => {
                        form.querySelectorAll('input, button').forEach(element => {
                            element.disabled = true;
                        });
                    });
                }, 2000);
            });
            
            // Reset state when modal is closed or canceled
            ssoModal.addEventListener('hidden.bs.modal', function() {
                resetSSOState(microsoftLoginBtn);
                // Remove modal from DOM after it's hidden
                ssoModal.remove();
            });
        });
    }
    
    // Reset SSO button state
    function resetSSOState(button) {
        ssoInProgress = false;
        if (button) {
            button.disabled = false;
            if (button.id === 'google-login') {
                button.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" class="sso-icon">Google';
            } else if (button.id === 'microsoft-login') {
                button.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" class="sso-icon">Microsoft';
            }
        }
    }
    
    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset validation
            registerForm.classList.remove('was-validated');
            
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
                            
                            // Set user as authenticated
                            userAuthenticated = true;
                            
                            // Determine user type from radio button
                            const userType = producerType.checked ? 'producer' : 'consumer';
                            
                            // Store pending user data (will be finalized after MetaMask connection)
                            pendingUser = {
                                name: registerName.value,
                                email: registerEmail.value,
                                mobile: registerMobile.value,
                                userType: userType,
                                authenticated: true,
                                registrationDate: new Date().toISOString()
                            };
                            
                            // Show success message
                            const successAlert = document.createElement('div');
                            successAlert.className = 'alert alert-success mt-3';
                            successAlert.innerHTML = 'Registration successful! Now please connect your MetaMask wallet to continue.';
                            registerForm.appendChild(successAlert);
                            
                            // Hide or disable the form elements
                            registerForm.querySelectorAll('input, button').forEach(element => {
                                element.disabled = true;
                            });
                            
                            // Show and highlight the MetaMask section
                            if (metamaskSection) {
                                metamaskSection.classList.add('border', 'border-primary');
                                metamaskSection.scrollIntoView({ behavior: 'smooth' });
                                
                                // Add pulsing effect to the connect button
                                if (connectMetamaskBtn) {
                                    connectMetamaskBtn.classList.add('btn-lg');
                                    connectMetamaskBtn.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
                                }
                            }
                            
                            // Disable the login/register tabs
                            const authTabs = document.getElementById('authTabs');
                            if (authTabs) {
                                authTabs.querySelectorAll('button').forEach(button => {
                                    button.disabled = true;
                                });
                            }
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