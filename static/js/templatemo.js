/* ============================================
   ICE-DARK PRODUCT SCRIPTS (Nothing Phone Style)
   Enhanced product interactions with modern UX
   ============================================ */

'use strict';

$(document).ready(function() {
    
    // ============================================
    // ENHANCED NOTIFICATION SYSTEM
    // ============================================
    
    /**
     * Show notification message (Nothing Phone Style)
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
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
    
    // ============================================
    // ACCORDION (Category Menu)
    // ============================================
    
    // Hide all sub-menus initially
    var all_panels = $('.templatemo-accordion > li > ul').hide();
    
    // Add custom classes for styling
    $('.templatemo-accordion > li > a').each(function() {
        $(this).addClass('accordion-toggle');
    });
    
    // Accordion click handler with enhanced animation
    $('.templatemo-accordion > li > a').click(function(e) {
        e.preventDefault();
        console.log('Accordion toggled');
        
        var target = $(this).next('ul');
        var parentItem = $(this).parent('li');
        
        // Animate the clicked panel
        if (!target.hasClass('active')) {
            // Close all panels with smooth animation
            all_panels.each(function() {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active').slideUp(300);
                    $(this).parent('li').removeClass('expanded');
                }
            });
            
            // Open the target panel
            target.addClass('active').slideDown(400, function() {
                // Scroll to make the opened menu visible if needed
                const offset = target.offset();
                if (offset && offset.top < $(window).scrollTop()) {
                    $('html, body').animate({
                        scrollTop: offset.top - 50
                    }, 300);
                }
            });
            parentItem.addClass('expanded');
            
            // Add visual feedback
            $(this).addClass('active-accordion');
            setTimeout(() => {
                $(this).removeClass('active-accordion');
            }, 200);
        } else {
            // Close the active panel
            target.removeClass('active').slideUp(300);
            parentItem.removeClass('expanded');
        }
        
        return false;
    });
    
    // Optional: Open first accordion item by default
    // $('.templatemo-accordion > li:first-child > a').click();
    
    // ============================================
    // PRODUCT DETAIL - IMAGE GALLERY
    // ============================================
    
    // Product image click handler - change main image
    $('.product-links-wap a').click(function(e) {
        e.preventDefault();
        
        var $this = $(this);
        var this_src = $this.children('img').attr('src');
        var $mainImage = $('#product-detail');
        
        if (this_src && $mainImage.length) {
            // Add fade effect when changing image
            $mainImage.fadeOut(150, function() {
                $mainImage.attr('src', this_src);
                $mainImage.fadeIn(150);
            });
            
            // Add active state to thumbnail
            $('.product-links-wap a').removeClass('active-thumbnail');
            $this.addClass('active-thumbnail');
            
            console.log('Product image changed to:', this_src);
        }
        
        return false;
    });
    
    // ============================================
    // QUANTITY CONTROLS (- and + buttons)
    // ============================================
    
    // Get max quantity from DOM
    var maxQuantity = parseInt($("#count").html()) || 999;
    var minQuantity = 1;
    
    // Decrease quantity button
    $('#btn-minus').click(function(e) {
        e.preventDefault();
        
        var currentVal = parseInt($("#var-value").html());
        var newVal = (currentVal <= minQuantity) ? minQuantity : currentVal - 1;
        
        if (newVal !== currentVal) {
            // Update display with animation
            updateQuantityDisplay(newVal);
            
            // Add haptic feedback style
            $(this).addClass('btn-pressed');
            setTimeout(() => {
                $(this).removeClass('btn-pressed');
            }, 150);
        } else {
            // Show notification when at minimum
            showNotification('تعداد محصول نمی‌تواند کمتر از ۱ باشد', 'warning');
            $(this).addClass('btn-disabled');
            setTimeout(() => {
                $(this).removeClass('btn-disabled');
            }, 300);
        }
        
        return false;
    });
    
    // Increase quantity button
    $('#btn-plus').click(function(e) {
        e.preventDefault();
        
        var currentVal = parseInt($("#var-value").html());
        var newVal = currentVal + 1;
        
        if (newVal <= maxQuantity) {
            // Update display with animation
            updateQuantityDisplay(newVal);
            
            // Add haptic feedback style
            $(this).addClass('btn-pressed');
            setTimeout(() => {
                $(this).removeClass('btn-pressed');
            }, 150);
        } else {
            // Show notification when exceeding max quantity
            showNotification(`حداکثر تعداد مجاز برای این محصول ${maxQuantity} عدد می‌باشد.`, 'error');
            
            // Add error animation to button
            $(this).addClass('btn-error');
            setTimeout(() => {
                $(this).removeClass('btn-error');
            }, 300);
        }
        
        return false;
    });
    
    /**
     * Update quantity display with animation
     * @param {number} newVal - New quantity value
     */
    function updateQuantityDisplay(newVal) {
        // Animate the quantity badge
        var $quantityBadge = $("#var-value");
        var $quantityInput = $("#product-quanity");
        
        $quantityBadge.addClass('quantity-updated');
        $quantityBadge.html(newVal);
        $quantityInput.val(newVal);
        
        // Remove animation class after completion
        setTimeout(() => {
            $quantityBadge.removeClass('quantity-updated');
        }, 300);
        
        // Trigger change event for any listeners
        $quantityInput.trigger('change');
    }
    
    // ============================================
    // SIZE SELECTOR BUTTONS
    // ============================================
    
    // Size button click handler
    $('.btn-size').click(function(e) {
        e.preventDefault();
        
        var $this = $(this);
        var this_val = $this.html();
        
        // Update hidden input
        $("#product-size").val(this_val);
        
        // Update button styles
        $(".btn-size").removeClass('btn-secondary active-size');
        $(".btn-size").addClass('btn-outline-primary');
        
        $this.removeClass('btn-outline-primary');
        $this.addClass('btn-secondary active-size');
        
        // Add selection animation
        $this.addClass('size-selected');
        setTimeout(() => {
            $this.removeClass('size-selected');
        }, 200);
        
        // Show selection feedback
        console.log('Size selected:', this_val);
        
        return false;
    });
    
    // ============================================
    // ADD TO CART BUTTON ENHANCEMENT
    // ============================================
    
    // Enhance add to cart button with loading state
    $('button[type="submit"][name="submit"][value="addtocard"]').click(function(e) {
        var $btn = $(this);
        var originalText = $btn.html();
        var quantity = parseInt($("#var-value").html()) || 1;
        var maxAvailable = parseInt($("#count").html()) || 0;
        
        // Validate quantity before submission
        if (quantity > maxAvailable) {
            e.preventDefault();
            showNotification(`تعداد انتخاب شده (${quantity}) از موجودی انبار (${maxAvailable}) بیشتر است.`, 'error');
            return false;
        }
        
        // Add loading state
        $btn.html(`
            <span class="btn-loading-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; animation: spin 0.8s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.4 31.4"/>
                </svg>
                در حال افزودن...
            </span>
        `).prop('disabled', true);
        
        // Re-enable after 1 second (will be interrupted by form submission if successful)
        setTimeout(() => {
            if ($btn.prop('disabled')) {
                $btn.html(originalText).prop('disabled', false);
            }
        }, 1000);
    });
    
    // ============================================
    // ANIMATION STYLES
    // ============================================
    
    // Add CSS animations to document
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
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .accordion-toggle {
                transition: all 0.3s ease;
            }
            
            .accordion-toggle.active-accordion {
                color: #E0F2FE !important;
                padding-right: 5px;
            }
            
            .expanded > a {
                color: #E0F2FE !important;
            }
            
            .templatemo-accordion > li > ul {
                background-color: rgba(18, 18, 18, 0.8);
                border-radius: 12px;
                margin-top: 8px;
                padding: 8px 0;
            }
            
            .templatemo-accordion > li > ul li {
                padding: 6px 20px;
                transition: all 0.2s ease;
            }
            
            .templatemo-accordion > li > ul li:hover {
                background-color: rgba(224, 242, 254, 0.08);
                padding-right: 25px;
            }
            
            .active-thumbnail {
                border: 2px solid #E0F2FE;
                border-radius: 12px;
                transform: scale(1.02);
            }
            
            .quantity-updated {
                animation: pulse 0.3s ease;
            }
            
            .btn-pressed {
                transform: scale(0.95);
                background-color: #B9E6FF !important;
                color: #000000 !important;
            }
            
            .btn-error {
                animation: shake 0.5s ease;
                background-color: #FF6B6B !important;
                border-color: #FF6B6B !important;
            }
            
            .btn-disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .size-selected {
                animation: pulse 0.3s ease;
            }
            
            .active-size {
                background-color: #E0F2FE !important;
                color: #000000 !important;
                border-color: #E0F2FE !important;
            }
            
            .btn-size {
                transition: all 0.2s ease;
                margin: 0 4px;
                min-width: 50px;
            }
            
            .btn-size:hover {
                transform: translateY(-2px);
            }
            
            .product-links-wap a {
                display: inline-block;
                transition: all 0.2s ease;
                border-radius: 12px;
                overflow: hidden;
            }
            
            .product-links-wap a:hover {
                transform: scale(1.05);
            }
            
            .product-links-wap img {
                transition: all 0.2s ease;
            }
        </style>
    `);
    
    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    
    // Add keyboard shortcuts for quantity controls
    $(document).on('keydown', function(e) {
        // Only if product detail page is focused
        if ($('#product-detail').length) {
            if (e.key === '-' || e.key === '_') {
                $('#btn-minus').click();
                e.preventDefault();
            } else if (e.key === '+' || e.key === '=') {
                $('#btn-plus').click();
                e.preventDefault();
            }
        }
    });
    
    // ============================================
    // TOOLTIP INITIALIZATION
    // ============================================
    
    // Add tooltips to interactive elements
    $('.btn-size').attr('title', 'انتخاب سایز');
    $('#btn-minus').attr('title', 'کاهش تعداد');
    $('#btn-plus').attr('title', 'افزایش تعداد');
    $('.product-links-wap a').attr('title', 'تغییر تصویر اصلی');
    
    // Optional: Use Bootstrap tooltips if available
    if ($.fn.tooltip) {
        $('[title]').tooltip({
            placement: 'top',
            trigger: 'hover'
        });
    }
    
    // ============================================
    // TOUCH DEVICE OPTIMIZATION
    // ============================================
    
    // Remove hover effects on touch devices
    if ('ontouchstart' in window) {
        $('.btn-size, .product-links-wap a').css('cursor', 'pointer');
    }
    
    console.log('Product scripts initialized successfully');
});