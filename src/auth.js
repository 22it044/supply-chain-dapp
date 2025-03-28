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
    
    // Check if we're on the login page or dashboard pages
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname === '/';
    const isProducerPage = window.location.pathname.includes('producer.html');
    const isConsumerPage = window.location.pathname.includes('consumer.html');
    const isDashboardPage = isProducerPage || isConsumerPage;
    
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
        // On login page, check if already authenticated
        if (isUserLoggedIn()) {
            // Already logged in, redirect to appropriate dashboard
            redirectLoggedInUser();
            return;
        }
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
                return;
            }
            
            // Verify the code
            if (!verificationCode.value || verificationCode.value.length !== 6) {
                showValidationError(verificationCode, 'Please enter the 6-digit verification code');
                return;
            }
            
            // Simulate verification (in a real app, this would call your API)
            // Mock successful login
            loginSuccessful({
                name: 'Test User',
                email: loginEmail.value,
                userType: 'producer' // You could determine this from your backend
            });
            
            // Redirect to appropriate dashboard
            redirectLoggedInUser();
        });
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
                alert('Verification code sent to your email/mobile. Check your inbox.\n\nFor demo purposes, use code: 123456');
                
                // Start countdown for resend button (60 seconds)
                let countdown = 60;
                const countdownInterval = setInterval(function() {
                    countdown--;
                    sendCodeBtn.textContent = `Resend (${countdown}s)`;
                    
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        sendCodeBtn.textContent = 'Resend Code';
                        sendCodeBtn.disabled = false;
                    }
                }, 1000);
            }, 2000);
        });
    }
    
    // Handle SSO with Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            // In a real application, this would redirect to Google OAuth
            alert('Redirecting to Google for authentication...');
            
            // Simulate successful SSO login after 2 seconds
            setTimeout(function() {
                loginSuccessful({
                    name: 'Google User',
                    email: 'google.user@example.com',
                    userType: 'consumer' // In a real app, this could be stored in your backend
                });
                
                // Redirect to appropriate dashboard
                redirectLoggedInUser();
            }, 2000);
        });
    }
    
    // Handle SSO with Microsoft
    if (microsoftLoginBtn) {
        microsoftLoginBtn.addEventListener('click', function() {
            // In a real application, this would redirect to Microsoft OAuth
            alert('Redirecting to Microsoft for authentication...');
            
            // Simulate successful SSO login after 2 seconds
            setTimeout(function() {
                loginSuccessful({
                    name: 'Microsoft User',
                    email: 'microsoft.user@example.com',
                    userType: 'producer' // In a real app, this could be stored in your backend
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
            
            // Form is valid, show verification alert
            alert('A verification email and SMS have been sent to your registered email and mobile number. Please verify to complete registration.');
            
            // For demo purposes, simulate successful registration after 3 seconds
            setTimeout(function() {
                const userType = producerType.checked ? 'producer' : 'consumer';
                
                loginSuccessful({
                    name: registerName.value,
                    email: registerEmail.value,
                    userType: userType
                });
                
                // Redirect to appropriate dashboard
                redirectLoggedInUser();
            }, 3000);
        });
    }
    
    // Redirect logged in user to appropriate dashboard
    function redirectLoggedInUser() {
        const user = getCurrentUser();
        if (!user) return;
        
        if (user.userType === 'producer') {
            window.location.href = 'producer.html';
        } else {
            window.location.href = 'consumer.html';
        }
    }
    
    // Update dashboard UI with user info
    function updateDashboardUI(user) {
        if (!isDashboardPage) return;
        
        // Update UI to show logged in state
        if (userStatus) userStatus.textContent = `Welcome, ${user.name}`;
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        
        // Show MetaMask elements after login
        if (metamaskStatus) metamaskStatus.style.display = 'inline-block';
        if (walletInfo) walletInfo.style.display = 'inline-block';
        if (connectButton) connectButton.style.display = 'inline-block';
        
        // Show logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-outline-danger btn-sm ms-2';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', logout);
        
        if (userStatus && userStatus.parentElement) {
            userStatus.parentElement.appendChild(logoutBtn);
        }
    }
    
    // Utility function for successful login
    function loginSuccessful(user) {
        // Store user info in localStorage (in a real app, use a more secure method)
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // If on dashboard page, update UI
        if (isDashboardPage) {
            updateDashboardUI(user);
        }
        
        // Dispatch event for other scripts to know a user has logged in
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }
    
    // Validation utility functions
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validateMobile(mobile) {
        const re = /^[0-9]{10}$/;
        return re.test(String(mobile));
    }
    
    function showValidationError(element, message) {
        element.classList.add('is-invalid');
        
        // Update feedback message if provided
        const feedback = element.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }
});

// Export functions for use in other modules
export function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
} 