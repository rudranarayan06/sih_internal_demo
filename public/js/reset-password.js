// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get('token');

// Check if token exists
if (!resetToken) {
    alert('Invalid reset link');
    window.location.href = 'profile.html';
}

// DOM Elements
const resetForm = document.getElementById('resetForm');
const toast = document.getElementById('toast');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
    resetForm.addEventListener('submit', handleResetPassword);
});

// Handle reset password form submission
async function handleResetPassword(e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Validation
    if (newPassword !== confirmNewPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn, true);

    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: resetToken,
                password: newPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Password reset successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);
        } else {
            showToast(data.message || 'Password reset failed', 'error');
        }
    } catch (error) {
        console.error('Reset password error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showButtonLoading(submitBtn, false);
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target.closest('button').querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show button loading state
function showButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        button.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Enhanced password validation
function validatePassword(password) {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasLetter && hasNumber;
}

// Real-time password validation
document.addEventListener('input', function (e) {
    if (e.target.id === 'newPassword') {
        const isValid = validatePassword(e.target.value);
        e.target.style.borderColor = isValid ? 'var(--success-color)' : 'var(--danger-color)';
    }

    if (e.target.id === 'confirmNewPassword') {
        const password = document.getElementById('newPassword').value;
        const isMatching = e.target.value === password;
        e.target.style.borderColor = isMatching ? 'var(--success-color)' : 'var(--danger-color)';
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Escape key to clear forms
    if (e.key === 'Escape') {
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    }
});