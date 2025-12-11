// Sign Up Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const signupBtn = document.querySelector('.login-btn');

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Clear errors
    function clearErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        nameInput.style.borderColor = '#e0e0e0';
        emailInput.style.borderColor = '#e0e0e0';
        passwordInput.style.borderColor = '#e0e0e0';
        confirmPasswordInput.style.borderColor = '#e0e0e0';
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
    nameInput.addEventListener('blur', function() {
        const name = nameInput.value.trim();
        if (name === '') {
            showError(nameInput, nameError, 'Name is required');
        } else if (name.length < 3) {
            showError(nameInput, nameError, 'Name must be at least 3 characters');
        } else {
            nameError.textContent = '';
            showSuccess(nameInput);
        }
    });

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

    confirmPasswordInput.addEventListener('blur', function() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword === '') {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
        } else {
            confirmPasswordError.textContent = '';
            showSuccess(confirmPasswordInput);
        }
    });

    // Clear errors on input
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', function() {
            const errorId = this.id.replace('signup', '').replace('confirm', '') + 'Error';
            const errorElement = document.getElementById(errorId === 'NameError' ? 'nameError' : 
                                                          errorId === 'EmailError' ? 'emailError' :
                                                          errorId === 'PasswordError' ? 'passwordError' : 'confirmPasswordError');
            if (errorElement && errorElement.textContent) {
                errorElement.textContent = '';
                this.style.borderColor = '#e0e0e0';
            }
        });
    });

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        let isValid = true;
        
        // Validate name
        if (name === '') {
            showError(nameInput, nameError, 'Name is required');
            isValid = false;
        } else if (name.length < 3) {
            showError(nameInput, nameError, 'Name must be at least 3 characters');
            isValid = false;
        }
        
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
        
        // Validate confirm password
        if (confirmPassword === '') {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
            isValid = false;
        }
        
        // If form is valid, save user and redirect
        if (isValid) {
            // Show loading state
            signupBtn.innerHTML = '<span>Creating Account...</span>';
            signupBtn.disabled = true;
            signupBtn.style.opacity = '0.7';
            signupBtn.style.cursor = 'not-allowed';
            
            // Save user to localStorage (for demo)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const newUser = {
                id: Date.now(),
                name: name,
                password: password,
                email: email,
                created: new Date().toLocaleString(),
                updated: null
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Simulate API call
            setTimeout(() => {
                signupBtn.innerHTML = '<span>✓ Account Created!</span>';
                signupBtn.style.background = '#27ae60';
                
                // Redirect to login page after 1 second (no alert message)
                setTimeout(() => {
                    window.location.href = '../HTML/index.html';
                }, 1000);
            }, 1500);
        }
    });

    // Toggle password visibility for signup password
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    if (toggleSignupPassword) {
        function updateAriaLabel() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            toggleSignupPassword.setAttribute('aria-label', isPassword ? 'Show password' : 'Hide password');
        }
        updateAriaLabel();
        
        toggleSignupPassword.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isPassword = passwordInput.getAttribute('type') === 'password';
            if (isPassword) {
                passwordInput.setAttribute('type', 'text');
                this.classList.add('show-password');
            } else {
                passwordInput.setAttribute('type', 'password');
                this.classList.remove('show-password');
            }
            updateAriaLabel();
        });
        toggleSignupPassword.setAttribute('role', 'button');
        toggleSignupPassword.setAttribute('tabindex', '0');
    }

    // Toggle password visibility for confirm password
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmPassword) {
        function updateAriaLabelConfirm() {
            const isPassword = confirmPasswordInput.getAttribute('type') === 'password';
            toggleConfirmPassword.setAttribute('aria-label', isPassword ? 'Show password' : 'Hide password');
        }
        updateAriaLabelConfirm();
        
        toggleConfirmPassword.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isPassword = confirmPasswordInput.getAttribute('type') === 'password';
            if (isPassword) {
                confirmPasswordInput.setAttribute('type', 'text');
                this.classList.add('show-password');
            } else {
                confirmPasswordInput.setAttribute('type', 'password');
                this.classList.remove('show-password');
            }
            updateAriaLabelConfirm();
        });
        toggleConfirmPassword.setAttribute('role', 'button');
        toggleConfirmPassword.setAttribute('tabindex', '0');
    }
});

