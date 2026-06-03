/* ============================================
   ICE-DARK SIGNUP SCRIPT (Nothing Phone Style)
   Enhanced registration with modern UX
   ============================================ */

$(document).ready(function () {
    // ============================================
    // CSRF TOKEN SETUP
    // ============================================
    
    /**
     * Get CSRF token from cookies
     * @returns {string|null} CSRF token value
     */
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    // ============================================
    // ENHANCED NOTIFICATION SYSTEM
    // ============================================
    
    /**
     * Display styled notification messages (Nothing Phone Style)
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'danger', 'warning', 'info'
     */
    function displayMessage(message, type) {
        // Remove existing messages
        $('.ice-notification').remove();
        
        // Color mapping for different message types
        const colors = {
            success: '#B9E6FF',
            danger: '#FF6B6B',
            warning: '#E0F2FE',
            info: '#8E8E93'
        };
        
        const icons = {
            success: '✓',
            danger: '✕',
            warning: '!',
            info: 'ℹ'
        };
        
        // Create styled notification
        const notification = $(`
            <div class="ice-notification" style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #121212;
                border: 1px solid ${colors[type]};
                border-radius: 16px;
                padding: 14px 24px;
                color: #FFFFFF;
                font-family: 'Shabnam', sans-serif;
                z-index: 10000;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                animation: slideInDown 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                max-width: 90%;
                text-align: center;
            ">
                <span style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: ${colors[type]};
                    color: #000000;
                    font-weight: bold;
                    font-size: 12px;
                ">${icons[type]}</span>
                <span>${escapeHtml(message)}</span>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto remove after 5 seconds
        setTimeout(function () {
            notification.fadeOut(300, function () {
                $(this).remove();
            });
        }, 5000);
    }
    
    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    function escapeHtml(str) {
        if (!str) return '';
        return str.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // ============================================
    // LOADING INDICATOR
    // ============================================
    
    /**
     * Show loading indicator
     * @returns {jQuery} Loading indicator element
     */
    function showLoading() {
        const loadingIndicator = $(`
            <div class="loading-indicator" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #121212;
                border: 1px solid #E0F2FE;
                border-radius: 20px;
                padding: 20px 30px;
                color: #FFFFFF;
                font-family: 'Shabnam', sans-serif;
                z-index: 10001;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                min-width: 200px;
            ">
                <div class="spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #8E8E93;
                    border-top-color: #E0F2FE;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                "></div>
                <span>در حال ثبت‌نام...</span>
            </div>
        `);
        $('body').append(loadingIndicator);
        return loadingIndicator;
    }
    
    /**
     * Hide loading indicator
     * @param {jQuery} loadingIndicator - Loading indicator element to remove
     */
    function hideLoading(loadingIndicator) {
        if (loadingIndicator) {
            loadingIndicator.fadeOut(300, function() {
                $(this).remove();
            });
        }
    }
    
    // ============================================
    // FORM VALIDATION
    // ============================================
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return re.test(email);
    }
    
    /**
     * Validate Iranian phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    function isValidPhone(phone) {
        const re = /^09[0-9]{9}$/;
        return re.test(phone);
    }
    
    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    function validatePassword(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('رمز عبور باید حداقل ۸ کاراکتر باشد');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('رمز عبور باید حداقل یک حرف بزرگ داشته باشد');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('رمز عبور باید حداقل یک حرف کوچک داشته باشد');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('رمز عبور باید حداقل یک عدد داشته باشد');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Validate entire form before submission
     * @returns {boolean} True if form is valid
     */
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        // Email validation
        const email = $('#id_email').val();
        if (email && !isValidEmail(email)) {
            errors.push('لطفا یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        // Phone validation
        const phone = $('#id_phone').val();
        if (phone && !isValidPhone(phone)) {
            errors.push('لطفا یک شماره تلفن معتبر وارد کنید (مثال: 09123456789)');
            isValid = false;
        }
        
        // Password validation
        const password1 = $('#id_password1').val();
        const password2 = $('#id_password2').val();
        
        if (password1 || password2) {
            const passwordValidation = validatePassword(password1);
            if (!passwordValidation.isValid) {
                errors.push(...passwordValidation.errors);
                isValid = false;
            }
            
            if (password1 !== password2) {
                errors.push('رمز عبور و تکرار آن مطابقت ندارند');
                isValid = false;
            }
        }
        
        // Display all validation errors
        if (!isValid) {
            errors.forEach(error => {
                displayMessage(error, 'danger');
            });
        }
        
        return isValid;
    }
    
    // ============================================
    // AJAX SIGNUP FUNCTION
    // ============================================
    
    /**
     * Send signup request to server
     */
    function signup() {
        // Remove previous messages
        $('.ice-notification').remove();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        // Show loading indicator
        const loadingIndicator = showLoading();
        
        // Prepare form data
        const formData = {
            email: $('#id_email').val(),
            phone: $('#id_phone').val(),
            first_name: $('#id_first_name').val(),
            last_name: $('#id_last_name').val(),
            gender: $('#id_gender').val(),
            password1: $('#id_password1').val(),
            password2: $('#id_password2').val(),
        };
        
        $.ajax({
            url: "/rest-auth/registration/",
            type: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: formData,
            success: function (json) {
                console.log('Signup successful:', json);
                hideLoading(loadingIndicator);
                
                // Show success message
                displayMessage(
                    "لینک فعالسازی به ایمیل شما ارسال شد. لطفاً برای تکمیل ثبت‌نام، ایمیل خود را بررسی کنید.",
                    "success"
                );
                
                // Clear the form
                $('#signup_form')[0].reset();
                
                // Remove any existing validation highlights
                $('.error-field').removeClass('error-field');
                
                // Optional: Redirect to login page after 3 seconds
                setTimeout(function() {
                    window.location.href = '/accounts/login/';
                }, 3000);
            },
            error: function (xhr, errmsg, err) {
                console.error('Signup error:', xhr.status, errmsg);
                hideLoading(loadingIndicator);
                
                // Parse error responses
                const errors = xhr.responseJSON;
                if (errors) {
                    // Handle different error formats
                    for (const field in errors) {
                        if (errors.hasOwnProperty(field)) {
                            const fieldErrors = errors[field];
                            if (Array.isArray(fieldErrors)) {
                                fieldErrors.forEach(error => {
                                    displayMessage(error, "danger");
                                });
                            } else if (typeof fieldErrors === 'string') {
                                displayMessage(fieldErrors, "danger");
                            } else if (typeof fieldErrors === 'object') {
                                for (const key in fieldErrors) {
                                    displayMessage(`${field}: ${fieldErrors[key]}`, "danger");
                                }
                            }
                        }
                    }
                } else if (xhr.responseText) {
                    // Handle plain text error
                    displayMessage(xhr.responseText, "danger");
                } else {
                    displayMessage("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.", "danger");
                }
                
                // Highlight fields with errors
                highlightErrorFields(errors);
            }
        });
    }
    
    /**
     * Highlight form fields that contain errors
     * @param {Object} errors - Error object from server
     */
    function highlightErrorFields(errors) {
        // Remove existing highlights
        $('.error-field').removeClass('error-field');
        
        if (errors) {
            for (const field in errors) {
                const $field = $(`#id_${field}`);
                if ($field.length) {
                    $field.addClass('error-field');
                    
                    // Add shake animation
                    $field.css('animation', 'shake 0.5s ease');
                    setTimeout(() => {
                        $field.css('animation', '');
                    }, 500);
                }
            }
        }
    }
    
    // ============================================
    // REAL-TIME VALIDATION
    // ============================================
    
    /**
     * Initialize real-time validation for form fields
     */
    function initRealTimeValidation() {
        // Email validation on blur
        $('#id_email').on('blur', function() {
            const email = $(this).val();
            if (email && !isValidEmail(email)) {
                $(this).addClass('error-field');
                showFieldError($(this), 'ایمیل معتبر وارد کنید');
            } else {
                $(this).removeClass('error-field');
                removeFieldError($(this));
            }
        });
        
        // Phone validation on blur
        $('#id_phone').on('blur', function() {
            const phone = $(this).val();
            if (phone && !isValidPhone(phone)) {
                $(this).addClass('error-field');
                showFieldError($(this), 'شماره تلفن معتبر وارد کنید (مثال: 09123456789)');
            } else {
                $(this).removeClass('error-field');
                removeFieldError($(this));
            }
        });
        
        // Password strength indicator
        $('#id_password1').on('input', function() {
            const password = $(this).val();
            const strength = checkPasswordStrength(password);
            
            // Remove existing strength indicator
            $('.password-strength').remove();
            
            if (password.length > 0) {
                const strengthText = ['ضعیف', 'متوسط', 'قوی', 'بسیار قوی'];
                const strengthColor = ['#FF6B6B', '#E0F2FE', '#B9E6FF', '#59ab6e'];
                
                $(this).after(`
                    <div class="password-strength" style="
                        font-size: 12px;
                        margin-top: 5px;
                        color: ${strengthColor[strength]};
                    ">
                        قدرت رمز عبور: ${strengthText[strength]}
                    </div>
                `);
            }
        });
        
        // Confirm password validation
        $('#id_password2').on('input', function() {
            const password1 = $('#id_password1').val();
            const password2 = $(this).val();
            
            removeFieldError($(this));
            
            if (password2.length > 0 && password1 !== password2) {
                $(this).addClass('error-field');
                showFieldError($(this), 'رمز عبور مطابقت ندارد');
            } else {
                $(this).removeClass('error-field');
            }
        });
        
        // Clear error on focus
        $('input, select').on('focus', function() {
            $(this).removeClass('error-field');
            removeFieldError($(this));
        });
    }
    
    /**
     * Show error message below a field
     * @param {jQuery} $field - Field element
     * @param {string} message - Error message
     */
    function showFieldError($field, message) {
        const errorId = `error-${$field.attr('id')}`;
        if ($(`#${errorId}`).length === 0) {
            $field.after(`
                <div id="${errorId}" class="field-error" style="
                    font-size: 12px;
                    margin-top: 5px;
                    color: #FF6B6B;
                ">
                    ${escapeHtml(message)}
                </div>
            `);
        }
    }
    
    /**
     * Remove error message below a field
     * @param {jQuery} $field - Field element
     */
    function removeFieldError($field) {
        const errorId = `error-${$field.attr('id')}`;
        $(`#${errorId}`).remove();
    }
    
    /**
     * Check password strength
     * @param {string} password - Password to check
     * @returns {number} Strength level (0-3)
     */
    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(3, Math.floor(strength / 2));
    }
    
    // ============================================
    // ANIMATION STYLES
    // ============================================
    
    // Add CSS animations to document
    $('head').append(`
        <style>
            @keyframes slideInDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .error-field {
                border-color: #FF6B6B !important;
                animation: shake 0.5s ease;
            }
            
            .form-control {
                transition: all 0.3s ease;
            }
            
            .form-control:focus {
                border-color: #E0F2FE;
                box-shadow: 0 0 0 3px rgba(224, 242, 254, 0.1);
            }
        </style>
    `);
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    // Initialize real-time validation
    initRealTimeValidation();
    
    // Form submission handler
    $('#signup_form').on('submit', function (event) {
        event.preventDefault();
        console.log('Signup form submitted');
        signup();
    });
    
    // Add floating label effect
    $('.form-group input, .form-group select').each(function() {
        const $input = $(this);
        if ($input.val() && $input.val().trim() !== '') {
            $input.siblings('label').addClass('floating');
        }
        
        $input.on('focus', function() {
            $(this).siblings('label').addClass('floating');
        });
        
        $input.on('blur', function() {
            if (!$input.val() || $input.val().trim() === '') {
                $(this).siblings('label').removeClass('floating');
            }
        });
    });
    
    console.log('Signup script initialized');
});