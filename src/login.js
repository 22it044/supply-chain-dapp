// Login page specific functionality
import './index.css';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded successfully');
    
    // Check if user is already logged in, redirect if necessary
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        redirectToDashboard(user.userType);
    }
    
    // Initialize verification code input to only accept numbers
    const verificationCodeInput = document.getElementById('verification-code');
    if (verificationCodeInput) {
        verificationCodeInput.addEventListener('input', function(e) {
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
}); 