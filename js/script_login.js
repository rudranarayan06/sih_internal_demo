// Global state
let currentUser = null;
let isAuthenticated = false;

// API Base URL
const API_BASE_URL = window.location.origin + '/api';

// DOM Elements
const authPage = document.getElementById('auth-page');
const profilePage = document.getElementById('profile-page');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toast = document.getElementById('toast');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('mindmash_user');
    const savedToken = localStorage.getItem('mindmash_token');

    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        // Verify token is still valid
        verifyToken().then(valid => {
            if (valid) {
                showProfilePage();
            } else {
                logout();
                showAuthPage();
            }
        });
    } else {
        showAuthPage();
    }

    // Form event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
});

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn, true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store user data and token
            currentUser = data.user;
            isAuthenticated = true;
            localStorage.setItem('mindmash_user', JSON.stringify(data.user));
            localStorage.setItem('mindmash_token', data.token);

            showToast('Login successful! Welcome back!', 'success');
            showProfilePage();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showButtonLoading(submitBtn, false);
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        university: document.getElementById('university').value,
        academicYear: document.getElementById('academicYear').value,
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.university || !formData.academicYear || !formData.password) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (formData.password.length < 8) {
        showToast('Password should be at least 8 characters long', 'error');
        return;
    }

    if (!formData.email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn, true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            // Store user data and token
            currentUser = data.user;
            isAuthenticated = true;
            localStorage.setItem('mindmash_user', JSON.stringify(data.user));
            localStorage.setItem('mindmash_token', data.token);

            showToast('Account created successfully! Welcome to MindMesh!', 'success');
            showProfilePage();
        } else {
            if (data.errors && data.errors.length > 0) {
                showToast(data.errors[0].msg, 'error');
            } else {
                showToast(data.message || 'Registration failed', 'error');
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showButtonLoading(submitBtn, false);
    }
}

// Token verification function
async function verifyToken() {
    try {
        const token = localStorage.getItem('mindmash_token');
        if (!token) return false;

        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// Forgot password function
async function forgotPassword() {
    const email = prompt('Enter your email address:');
    if (!email) return;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            // For demo purposes, show the reset URL
            if (data.resetUrl) {
                const useResetLink = confirm(`Password reset token generated!\n\nFor demo purposes, would you like to open the reset password page now?\n\n(In production, this would be sent via email)`);
                if (useResetLink) {
                    window.open(data.resetUrl, '_blank');
                }
            } else {
                showToast('Password reset token generated successfully!', 'success');
            }
        } else {
            showToast(data.message || 'Failed to generate reset token', 'error');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// UI Functions
function switchToLogin() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    clearForms();
}

function switchToSignup() {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    clearForms();
}

function clearForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
}

function showAuthPage() {
    authPage.style.display = 'block';
    profilePage.style.display = 'none';
}

function showProfilePage() {
    if (!currentUser) return;

    authPage.style.display = 'none';
    profilePage.style.display = 'block';

    updateProfileUI();
}

function updateProfileUI() {
    if (!currentUser) return;

    // Update user info
    const initials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    document.getElementById('userInitials').textContent = initials;
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.firstName}!`;
    document.getElementById('userMeta').textContent = `${currentUser.university} • ${currentUser.academicYear}`;
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('mindmash_user');
    localStorage.removeItem('mindmash_token');
    showToast('You have been logged out successfully', 'success');
    showAuthPage();
    switchToLogin();
}

// Tab Functions
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Utility Functions
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

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showSettings() {
    showToast('Settings feature coming soon!', 'success');
}

// Demo Functions for Dashboard
function joinSession() {
    showToast('Joining session...', 'success');
}

function editProfile() {
    showToast('Profile editing feature coming soon!', 'success');
}

// Add some demo interactivity
document.addEventListener('click', function (e) {
    // Handle button clicks in dashboard
    if (e.target.matches('.btn-primary.small')) {
        e.preventDefault();
        joinSession();
    }

    if (e.target.matches('.btn-secondary') || e.target.closest('.btn-secondary')) {
        e.preventDefault();
        editProfile();
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add some animations on scroll for dashboard elements
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.stat-card, .activity-card');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', handleScrollAnimations);

// Add focus trap for better accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Enhanced form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 letter, 1 number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
}

// Real-time form validation
document.addEventListener('input', function (e) {
    if (e.target.type === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid ? 'var(--success-color)' : 'var(--danger-color)';
    }

    if (e.target.id === 'signupPassword') {
        const isValid = validatePassword(e.target.value);
        e.target.style.borderColor = isValid ? 'var(--success-color)' : 'var(--danger-color)';
    }

    if (e.target.id === 'confirmPassword') {
        const password = document.getElementById('signupPassword').value;
        const isMatching = e.target.value === password;
        e.target.style.borderColor = isMatching ? 'var(--success-color)' : 'var(--danger-color)';
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + L for logout
    if ((e.ctrlKey || e.metaKey) && e.key === 'l' && isAuthenticated) {
        e.preventDefault();
        logout();
    }

    // Escape key to close any modals or reset forms
    if (e.key === 'Escape') {
        clearForms();
    }
});

// Performance optimization: Debounce function for search/filter features
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Theme toggle (future feature)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('mindmash_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('mindmash_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Add print styles for dashboard
function printDashboard() {
    window.print();
}

// Initialize app features
function initializeApp() {
    initializeTheme();

    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-heart"></i>
            <h2>MindMash</h2>
            <p>Loading your wellness dashboard...</p>
        </div>
    `;

    // Remove loading screen after content is loaded
    setTimeout(() => {
        if (document.getElementById('loading-screen')) {
            document.getElementById('loading-screen').remove();
        }
    }, 1000);
}

// Call initialization
initializeApp();