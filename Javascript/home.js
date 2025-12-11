// User Management System
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const addNewBtn = document.getElementById('addNewBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userModal = document.getElementById('userModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const userForm = document.getElementById('userForm');
    const tableBody = document.getElementById('tableBody');
    const modalTitle = document.getElementById('modalTitle');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userPasswordInput = document.getElementById('userPassword');

    // Load users from localStorage or initialize empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let editingUserId = null;

    // Initialize - display users
    displayUsers();

    // Logout button with confirmation
    logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const confirmed = await swalConfirm('Logout?', 'Are you sure you want to logout?', 'question');
        if (confirmed) {
            // Clear session
            sessionStorage.removeItem('currentUser');
            // Redirect to login page
            window.location.href = '../HTML/index.html';
        }
    });

    // Open modal for adding new user
    addNewBtn.addEventListener('click', function() {
        editingUserId = null;
        modalTitle.textContent = 'Add New User';
        userForm.reset();
        openModal();
    });

    // Close modal
    closeModal.addEventListener('click', closeModalFunc);
    cancelBtn.addEventListener('click', closeModalFunc);

    // Close modal when clicking outside
    userModal.addEventListener('click', function(e) {
        if (e.target === userModal) {
            closeModalFunc();
        }
    });

    // Handle form submission
    userForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = userNameInput.value.trim();
        const email = userEmailInput.value.trim();
        const password = userPasswordInput.value;

        if (!name || !email || !password) {
            await swalAlert('Error', 'Please fill in all fields', 'warning');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            await swalAlert('Error', 'Please enter a valid email address', 'warning');
            return;
        }

        // Check for duplicate email (excluding current user if editing)
        const existingUser = users.find(u => 
            u.email && u.email.toLowerCase() === email.toLowerCase() && 
            u.id !== editingUserId
        );
        
        if (existingUser) {
            await swalAlert('Error', 'This email is already registered. Please use a different email.', 'warning');
            return;
        }

        // Show confirmation dialog
        const action = editingUserId !== null ? 'update' : 'add';
        const confirmTitle = editingUserId !== null ? 'Update User?' : 'Add New User?';
        const confirmText = editingUserId !== null 
            ? `Are you sure you want to update this user?\n\nName: ${name}\nEmail: ${email}`
            : `Are you sure you want to add this new user?\n\nName: ${name}\nEmail: ${email}`;
        
        const confirmed = await swalConfirm(confirmTitle, confirmText, 'question');
        if (!confirmed) {
            return;
        }

        if (editingUserId !== null) {
            // Update existing user
            users = users.map(user => {
                if (user.id === editingUserId) {
                    return {
                        ...user,
                        name: name,
                        email: email,
                        password: password,
                        updated: new Date().toLocaleString()
                    };
                }
                return user;
            });
        } else {
            // Add new user
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                created: new Date().toLocaleString(),
                updated: null
            };
            users.push(newUser);
        }

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Refresh table
        displayUsers();
        
        // Close modal
        closeModalFunc();
        
        // Show success message
        const successMessage = editingUserId !== null 
            ? 'User updated successfully! ✓' 
            : 'User added successfully! ✓';
        showNotification(successMessage);
    });

    // Display users in table
    function displayUsers() {
        if (users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <p>No users found</p>
                        <p style="font-size: 14px; margin-top: 5px;">Click "Add New User" to get started</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = users.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.email || 'N/A')}</td>
                <td>${escapeHtml(user.password)}</td>
                <td>${user.created}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-update" onclick="editUser(${user.id})">
                            Update
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteUser(${user.id})">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Edit user
    window.editUser = function(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            editingUserId = userId;
            modalTitle.textContent = 'Update User';
            userNameInput.value = user.name;
            userEmailInput.value = user.email || '';
            userPasswordInput.value = user.password;
            openModal();
        }
    };

    // Delete user
    window.deleteUser = async function(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            const confirmText = `Are you sure you want to delete this user?\n\nName: ${user.name}\nEmail: ${user.email || 'N/A'}\n\nThis action cannot be undone!`;
            const confirmed = await swalConfirm('Delete User?', confirmText, 'warning');
            if (confirmed) {
                users = users.filter(u => u.id !== userId);
                localStorage.setItem('users', JSON.stringify(users));
                displayUsers();
                showNotification('User deleted successfully! ✓');
            }
        }
    };

    // Open modal
    function openModal() {
        userModal.classList.add('show');
        userNameInput.focus();
    }

    // Close modal
    function closeModalFunc() {
        userModal.classList.remove('show');
        editingUserId = null;
        userForm.reset();
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Custom SweetAlert-like Dialog Functions
    function showSwal(options) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('swalOverlay');
            const modal = document.getElementById('swalModal');
            const icon = document.getElementById('swalIcon');
            const title = document.getElementById('swalTitle');
            const text = document.getElementById('swalText');
            const buttons = document.getElementById('swalButtons');

            // Set icon
            if (options.icon) {
                icon.className = 'swal-icon ' + options.icon;
                icon.style.display = 'flex';
            } else {
                icon.style.display = 'none';
            }

            // Set title
            if (options.title) {
                title.textContent = options.title;
                title.style.display = 'block';
            } else {
                title.style.display = 'none';
            }

            // Set text
            if (options.text) {
                text.textContent = options.text;
                text.style.display = 'block';
            } else {
                text.style.display = 'none';
            }

            // Clear buttons
            buttons.innerHTML = '';

            // Add buttons
            if (options.showCancelButton !== false) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'swal-btn swal-btn-cancel';
                cancelBtn.textContent = options.cancelButtonText || 'Cancel';
                cancelBtn.onclick = () => {
                    hideSwal();
                    resolve(false);
                };
                buttons.appendChild(cancelBtn);
            }

            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'swal-btn swal-btn-confirm';
            confirmBtn.textContent = options.confirmButtonText || 'OK';
            confirmBtn.onclick = () => {
                hideSwal();
                resolve(true);
            };
            buttons.appendChild(confirmBtn);

            // Close on overlay click (only if allowOutsideClick is true)
            const handleOverlayClick = (e) => {
                if (e.target === overlay && options.allowOutsideClick !== false) {
                    hideSwal();
                    resolve(false);
                }
            };
            overlay.onclick = handleOverlayClick;

            // Prevent modal click from closing
            modal.onclick = (e) => {
                e.stopPropagation();
            };

            // Show overlay
            overlay.classList.add('show');
        });
    }

    function hideSwal() {
        const overlay = document.getElementById('swalOverlay');
        overlay.classList.remove('show');
    }

    // Custom alert function
    function swalAlert(title, text, icon = 'success') {
        return showSwal({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: false,
            confirmButtonText: 'OK'
        });
    }

    // Custom confirm function
    function swalConfirm(title, text, icon = 'question') {
        return showSwal({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });
    }

    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 25px;
            border-radius: 3px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add CSS animations for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

