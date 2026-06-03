/* ============================================
   ICE-DARK PROFILE SCRIPTS (Nothing Phone Style)
   Enhanced profile management with modern UX
   ============================================ */

// ============================================
// PROFILE EDIT FUNCTIONS
// ============================================

/**
 * Enable edit mode for profile form
 * @returns {boolean} false to prevent default behavior
 */
function handleEdit() {
    const fieldset = document.getElementById("myFieldset");
    const editBtn = document.getElementById('edit');
    const saveBtn = document.getElementById('save');
    const cancelBtn = document.getElementById('cancel');
    
    if (!fieldset || !editBtn || !saveBtn || !cancelBtn) {
        console.error('Required elements not found');
        showNotification('خطا در بارگذاری فرم', 'error');
        return false;
    }
    
    // Enable form fields
    fieldset.disabled = false;
    
    // Add visual feedback for editable fields
    $(fieldset).find('input, select, textarea').each(function() {
        $(this).css({
            'transition': 'all 0.3s ease',
            'border-color': '#E0F2FE'
        }).addClass('editable-field');
    });
    
    // Toggle buttons with animation
    editBtn.hidden = true;
    saveBtn.hidden = false;
    cancelBtn.hidden = false;
    
    // Add fade-in animation to buttons
    $(saveBtn).hide().fadeIn(200);
    $(cancelBtn).hide().fadeIn(200);
    
    // Scroll to form smoothly
    $('html, body').animate({
        scrollTop: $(fieldset).offset().top - 100
    }, 300);
    
    showNotification('حالت ویرایش فعال شد', 'info');
    return false;
}

/**
 * Cancel edit mode and reset form
 * @returns {boolean} false to prevent default behavior
 */
function handleSaveCancel() {
    const fieldset = document.getElementById("myFieldset");
    const editBtn = document.getElementById('edit');
    const saveBtn = document.getElementById('save');
    const cancelBtn = document.getElementById('cancel');
    
    if (!fieldset || !editBtn || !saveBtn || !cancelBtn) {
        console.error('Required elements not found');
        return false;
    }
    
    // Disable form fields
    fieldset.disabled = true;
    
    // Remove visual feedback
    $(fieldset).find('input, select, textarea').each(function() {
        $(this).css('border-color', '').removeClass('editable-field');
    });
    
    // Reset form to original values (reload original data)
    resetFormToOriginal();
    
    // Toggle buttons with animation
    $(saveBtn).fadeOut(200, function() {
        saveBtn.hidden = true;
    });
    $(cancelBtn).fadeOut(200, function() {
        cancelBtn.hidden = true;
    });
    editBtn.hidden = false;
    $(editBtn).hide().fadeIn(200);
    
    showNotification('ویرایش لغو شد', 'info');
    return false;
}

/**
 * Reset form to original values from server
 */
function resetFormToOriginal() {
    // Fetch original user data
    $.ajax({
        url: "/rest-auth/user/",
        type: "GET",
        success: function(data) {
            $('#id_email').val(data.email);
            $('#id_phone').val(data.phone);
            $('#id_first_name').val(data.first_name);
            $('#id_last_name').val(data.last_name);
            $('#id_gender').val(data.gender);
        },
        error: function() {
            console.log('Could not fetch original data');
        }
    });
}

/**
 * Send updated profile data to server
 */
function edit_detail() {
    // Show loading state
    const saveBtn = $('#save');
    const originalText = saveBtn.text();
    saveBtn.text('در حال ذخیره...').prop('disabled', true);
    
    // Get form data
    const formData = {
        email: $('#id_email').val(),
        phone: $('#id_phone').val(),
        first_name: $('#id_first_name').val(),
        last_name: $('#id_last_name').val(),
        gender: $('#id_gender').val()
    };
    
    // Validate email
    if (formData.email && !isValidEmail(formData.email)) {
        showNotification('لطفا یک ایمیل معتبر وارد کنید', 'error');
        saveBtn.text(originalText).prop('disabled', false);
        return;
    }
    
    // Validate phone number (Iranian format)
    if (formData.phone && !isValidPhone(formData.phone)) {
        showNotification('لطفا یک شماره تلفن معتبر وارد کنید', 'error');
        saveBtn.text(originalText).prop('disabled', false);
        return;
    }
    
    $.ajax({
        url: "/rest-auth/user/",
        type: "PUT",
        data: formData,
        success: function(json) {
            console.log(json);
            console.log("success");
            showNotification('اطلاعات شما با موفقیت ویرایش شد.', 'success');
            handleSaveCancel();
            
            // Update displayed username if needed
            updateUserDisplay(formData);
        },
        error: function(xhr) {
            console.log(xhr.status + ": " + xhr.responseText);
            let errorMsg = 'خطا در ویرایش اطلاعات';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.errors) {
                    errorMsg = Object.values(response.errors).flat().join('\n');
                }
            } catch(e) {}
            showNotification(errorMsg, 'error');
        },
        complete: function() {
            saveBtn.text(originalText).prop('disabled', false);
        }
    });
}

// ============================================
// PASSWORD CHANGE FUNCTIONS
// ============================================

/**
 * Change user password
 */
function change_password() {
    // Show loading state
    const submitBtn = $('#change-pass button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.text('در حال تغییر...').prop('disabled', true);
    
    const password1 = $('#id_password1').val();
    const password2 = $('#id_password2').val();
    
    // Validate passwords
    if (!password1 || !password2) {
        showNotification('لطفا هر دو فیلد رمز عبور را پر کنید', 'error');
        submitBtn.text(originalText).prop('disabled', false);
        return;
    }
    
    if (password1 !== password2) {
        showNotification('رمز عبور و تکرار آن مطابقت ندارند', 'error');
        submitBtn.text(originalText).prop('disabled', false);
        return;
    }
    
    if (password1.length < 8) {
        showNotification('رمز عبور باید حداقل ۸ کاراکتر باشد', 'error');
        submitBtn.text(originalText).prop('disabled', false);
        return;
    }
    
    $.ajax({
        url: "/rest-auth/password/change/",
        type: "POST",
        data: {
            new_password1: password1,
            new_password2: password2,
        },
        success: function(json) {
            console.log(json);
            console.log("success");
            showNotification('رمز عبور شما با موفقیت تغییر کرد.', 'success');
            
            // Clear password fields
            $('#id_password1, #id_password2').val('');
        },
        error: function(xhr) {
            console.log(xhr.status + ": " + xhr.responseText);
            let errorMsg = 'خطا در تغییر رمز عبور';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.new_password1) {
                    errorMsg = response.new_password1.join('\n');
                } else if (response.new_password2) {
                    errorMsg = response.new_password2.join('\n');
                }
            } catch(e) {}
            showNotification(errorMsg, 'error');
        },
        complete: function() {
            submitBtn.text(originalText).prop('disabled', false);
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
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
 * Update user display in navbar
 * @param {Object} userData - Updated user data
 */
function updateUserDisplay(userData) {
    const displayName = userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}`
        : userData.email || userData.phone;
    
    if (displayName && $('.dropdown-header b').length) {
        $('.dropdown-header b').text(displayName);
    }
}

/**
 * Enhanced notification system (Nothing Phone Style)
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.ice-notification').remove();
    
    const colors = {
        success: '#B9E6FF',
        error: '#FF6B6B',
        warning: '#E0F2FE',
        info: '#8E8E93'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'ℹ'
    };
    
    const notification = $(`
        <div class="ice-notification" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #121212;
            border: 1px solid ${colors[type]};
            border-radius: 16px;
            padding: 14px 24px;
            color: #FFFFFF;
            font-family: 'Shabnam', sans-serif;
            z-index: 10000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
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
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

/**
 * Escape HTML to prevent XSS
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

/**
 * Add floating label effect to form inputs
 */
function initFloatingLabels() {
    $('.form-group input, .form-group select, .form-group textarea').each(function() {
        const $input = $(this);
        const $label = $input.closest('.form-group').find('label');
        
        if ($input.val() && $input.val().trim() !== '') {
            $label.addClass('floating');
        }
        
        $input.on('focus', function() {
            $label.addClass('floating');
        });
        
        $input.on('blur', function() {
            if (!$input.val() || $input.val().trim() === '') {
                $label.removeClass('floating');
            }
        });
    });
}

/**
 * Add form validation styles
 */
function initFormValidation() {
    $('input, select, textarea').on('invalid', function(e) {
        $(this).addClass('error-field');
        setTimeout(() => {
            $(this).removeClass('error-field');
        }, 2000);
    });
}

// ============================================
// ANIMATION STYLES
// ============================================

// Add animation keyframes to document
$('head').append(`
    <style>
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
        
        @keyframes fadeInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .editable-field {
            animation: fadeInUp 0.3s ease;
        }
        
        .error-field {
            border-color: #FF6B6B !important;
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .floating {
            transform: translateY(-10px);
            font-size: 12px;
            color: #E0F2FE;
        }
        
        .form-group {
            transition: all 0.3s ease;
        }
        
        .btn-loading {
            position: relative;
            pointer-events: none;
            opacity: 0.7;
        }
        
        .btn-loading:after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            top: 50%;
            left: 10px;
            margin-top: -8px;
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.6s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
`);

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Setup CSRF Token for all AJAX requests
 */
$(function() {
    $.ajaxSetup({
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val() || getCsrfToken()
        }
    });
    
    // Initialize UI enhancements
    initFloatingLabels();
    initFormValidation();
});

/**
 * Get CSRF token from cookies
 * @returns {string} CSRF token
 */
function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === ('csrftoken=')) {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Profile form submit handler
 */
$('#details').on('submit', function(event){
    event.preventDefault();
    console.log("Profile form submitted!");
    edit_detail();
});

/**
 * Password change form submit handler
 */
$('#change-pass').on('submit', function(event){
    event.preventDefault();
    console.log("Password change form submitted!");
    change_password();
});

/**
 * Add real-time validation for password fields
 */
$(document).ready(function() {
    // Password strength indicator
    $('#id_password1').on('input', function() {
        const password = $(this).val();
        const strength = checkPasswordStrength(password);
        
        // Remove existing indicator
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
                    قدرت رمز: ${strengthText[strength]}
                </div>
            `);
        }
    });
    
    // Confirm password match
    $('#id_password2').on('input', function() {
        const password1 = $('#id_password1').val();
        const password2 = $(this).val();
        
        if (password2.length > 0) {
            if (password1 !== password2) {
                $(this).css('border-color', '#FF6B6B');
                $('.password-match-error').remove();
                $(this).after(`
                    <div class="password-match-error" style="
                        font-size: 12px;
                        margin-top: 5px;
                        color: #FF6B6B;
                    ">
                        رمز عبور مطابقت ندارد
                    </div>
                `);
            } else {
                $(this).css('border-color', '#B9E6FF');
                $('.password-match-error').remove();
            }
        } else {
            $(this).css('border-color', '');
            $('.password-match-error').remove();
        }
    });
});

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {number} Strength level (0-3)
 */
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(3, Math.floor(strength / 2));
}

// Export functions for global access
window.profileFunctions = {
    handleEdit,
    handleSaveCancel,
    edit_detail,
    change_password,
    showNotification
};