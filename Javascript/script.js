// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form and input elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = document.querySelector('.login-btn');
    
    // Verify all elements are found
    if (!loginForm || !emailInput || !passwordInput || !emailError || !passwordError || !loginBtn) {
        console.error('Error: Some form elements are missing!');
        return;
    }
    
    console.log('✅ Login form initialized successfully!');

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Clear error messages
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.style.borderColor = '#e0e0e0';
        passwordInput.style.borderColor = '#e0e0e0';
    }

    // Show error message
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

    passwordInput.addEventListener('blur', function() {
        const password = passwordInput.value;
        if (password === '') {
            showError(passwordInput, passwordError, 'Password is required');
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
        } else {
            passwordError.textContent = '';
            showSuccess(passwordInput);
        }
    });

    // Clear errors on input
    emailInput.addEventListener('input', function() {
        if (emailError.textContent) {
            emailError.textContent = '';
            emailInput.style.borderColor = '#e0e0e0';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (passwordError.textContent) {
            passwordError.textContent = '';
            passwordInput.style.borderColor = '#e0e0e0';
        }
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let isValid = true;
        
        // Validate email
        if (email === '') {
            showError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            showError(passwordInput, passwordError, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // If form is valid, check login credentials
        if (isValid) {
            // Show loading state
            loginBtn.innerHTML = '<span>Logging in...</span>';
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';
            loginBtn.style.cursor = 'not-allowed';
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user exists with matching email and password
            const user = users.find(u => 
                u.email && u.email.toLowerCase() === email.toLowerCase() && 
                u.password === password
            );
            
            // Simulate API call (for demo purposes)
            setTimeout(() => {
                if (user) {
                    // Login successful
                    loginBtn.innerHTML = '<span>✓ Login Successful!</span>';
                    loginBtn.style.background = '#27ae60';
                    
                    // Save current user to session
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }));
                    
                    // Redirect to home after 1 second (no alert message)
                    setTimeout(() => {
                        window.location.href = '../HTML/home.html';
                    }, 1000);
                } else {
                    // Login failed
                    loginBtn.innerHTML = '<span>Login</span>';
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                    loginBtn.style.cursor = 'pointer';
                    loginBtn.style.background = '#667eea';
                    
                    showError(emailInput, emailError, 'Invalid email or password');
                    showError(passwordInput, passwordError, 'Invalid email or password');
                    
                    // Clear password field
                    passwordInput.value = '';
                }
            }, 1500);
        }
    });

    // Add smooth focus effects
    emailInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });

    emailInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });

    passwordInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });

    passwordInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });

    // Add enter key support
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // Add visual feedback for remember me checkbox
    const rememberCheckbox = document.getElementById('remember');
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            if (this.checked) {
                console.log('Remember me checked');
            }
        });
    }

    // Toggle password visibility with proper icon logic
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        // Function to update aria-label based on current state
        function updateAriaLabel() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            togglePassword.setAttribute('aria-label', isPassword ? 'Show password' : 'Hide password');
        }
        
        // Initialize aria-label
        updateAriaLabel();
        
        togglePassword.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isPassword = passwordInput.getAttribute('type') === 'password';
            
            // Toggle password visibility
            if (isPassword) {
                // Show password - change to text input
                passwordInput.setAttribute('type', 'text');
                // Show closed eye icon (click to hide)
                this.classList.add('show-password');
            } else {
                // Hide password - change to password input
                passwordInput.setAttribute('type', 'password');
                // Show open eye icon (click to show)
                this.classList.remove('show-password');
            }
            
            // Update aria-label
            updateAriaLabel();
        });
        
        // Add keyboard support (Enter or Space key on icon)
        togglePassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make it accessible
        togglePassword.setAttribute('role', 'button');
        togglePassword.setAttribute('tabindex', '0');
    }
}); // End of DOMContentLoaded
