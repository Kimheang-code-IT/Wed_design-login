// Forgot Password Handler
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('recoverEmail');
    const emailError = document.getElementById('emailError');
    const passwordResult = document.getElementById('passwordResult');
    const recoveredPassword = document.getElementById('recoveredPassword');
    const recoverBtn = document.querySelector('.login-btn');

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Clear errors
    function clearErrors() {
        emailError.textContent = '';
        emailInput.style.borderColor = '#e0e0e0';
    }

    // Show error
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.style.borderColor = '#e74c3c';
    }

    // Show success
    function showSuccess(input) {
        input.style.borderColor = '#27ae60';
    }

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        if (email === '') {
            showError(emailInput, emailError, 'Email is required');
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
        } else {
            emailError.textContent = '';
            showSuccess(emailInput);
        }
    });

    // Clear errors on input
    emailInput.addEventListener('input', function() {
        if (emailError.textContent) {
            emailError.textContent = '';
            emailInput.style.borderColor = '#e0e0e0';
        }
        // Hide password result when user starts typing
        passwordResult.style.display = 'none';
    });

    // Form submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        const email = emailInput.value.trim();
        let isValid = true;
        
        // Validate email
        if (email === '') {
            showError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        }
        
        // If form is valid, check for user
        if (isValid) {
            // Show loading state
            recoverBtn.innerHTML = '<span>Searching...</span>';
            recoverBtn.disabled = true;
            recoverBtn.style.opacity = '0.7';
            recoverBtn.style.cursor = 'not-allowed';
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user by email
            const user = users.find(u => 
                u.email && u.email.toLowerCase() === email.toLowerCase()
            );
            
            // Simulate API call
            setTimeout(() => {
                if (user) {
                    // User found - show password
                    recoverBtn.innerHTML = '<span>✓ Password Found!</span>';
                    recoverBtn.style.background = '#27ae60';
                    
                    // Display password
                    recoveredPassword.textContent = user.password;
                    passwordResult.style.display = 'block';
                    
                    // Scroll to result
                    passwordResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        recoverBtn.innerHTML = '<span>Recover Password</span>';
                        recoverBtn.disabled = false;
                        recoverBtn.style.opacity = '1';
                        recoverBtn.style.cursor = 'pointer';
                        recoverBtn.style.background = '#667eea';
                    }, 2000);
                } else {
                    // User not found
                    recoverBtn.innerHTML = '<span>Recover Password</span>';
                    recoverBtn.disabled = false;
                    recoverBtn.style.opacity = '1';
                    recoverBtn.style.cursor = 'pointer';
                    recoverBtn.style.background = '#667eea';
                    
                    showError(emailInput, emailError, 'Email not found. Please check your email address.');
                    passwordResult.style.display = 'none';
                }
            }, 1500);
        }
    });
});

