/* ============================================
   ICE-DARK BASKET SCRIPT (Nothing Phone Style)
   Preserved all functionality with enhanced UX
   ============================================ */

/* Set values + misc */
var promoCode;
var promoPrice;
var fadeTime = 150; // Smooth fade transitions

/* DOM Elements Cache for better performance */
const DOM = {
    basketProducts: '.basket-product',
    quantityInputs: '.quantity input',
    quantityFields: '.quantity-field',
    removeButtons: '.remove button',
    promoBtn: '.promo-code-cta',
    promoInput: '#promo-code',
    summaryPromo: '.summary-promo',
    promoValue: '.promo-value',
    totalValue: '.total-value',
    basketSubtotal: '#basket-subtotal',
    basketTotal: '#basket-total',
    checkoutCta: '.checkout-cta',
    totalItems: '.total-items',
    subtotalElements: '.subtotal'
};

/* Assign actions with event delegation for dynamically added elements */
$(document).on('change', DOM.quantityInputs, function() {
    updateQuantity(this);
});

$(document).on('click', DOM.removeButtons, function() {
    removeItem(this);
});

$(document).ready(function() {
    updateSumItems();
    updateCartUI(); // Initialize UI enhancements
});

/* Enhanced UI Updates for Nothing Phone Style */
function updateCartUI() {
    // Add smooth hover effects to cart items
    $(DOM.basketProducts).each(function() {
        $(this).css({
            'transition': 'all 0.3s ease',
            'border-radius': '20px'
        });
    });
    
    // Update total items badge animation
    const totalItems = parseInt($(DOM.totalItems).text()) || 0;
    if (totalItems === 0) {
        $(DOM.checkoutCta).fadeOut(fadeTime);
    } else {
        $(DOM.checkoutCta).fadeIn(fadeTime);
    }
}

/* Check if discount code is valid using AJAX */
$('.promo-code-cta').click(function() {
    promoCode = $('#promo-code').val();
    
    // Validate promo code input
    if (!promoCode || promoCode.trim() === '') {
        showNotification('لطفا کد تخفیف را وارد کنید', 'warning');
        return;
    }
    
    // Show loading state on button
    const $btn = $(this);
    const originalText = $btn.text();
    $btn.text('در حال بررسی...').prop('disabled', true);
    
    const data = {};
    
    $.ajax({
        type: "GET",
        url: '/customer/rest/discount-code/?code=' + encodeURIComponent(promoCode),
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function(data) {
            console.log('Promo code validation successful');
            
            if (data && data.length != 0) {
                promoPrice = data[0]['amount'];
                console.log('Promo price:', promoPrice);
                
                // If there is a valid promoCode, show promo section
                if (promoPrice) {
                    // Animate promo section appearance
                    $(DOM.summaryPromo).removeClass('hide').hide().fadeIn(fadeTime);
                    $(DOM.promoValue).text(promoPrice);
                    
                    // Add success animation
                    $(DOM.promoValue).css({
                        'color': '#B9E6FF',
                        'transition': 'color 0.3s ease'
                    });
                    
                    recalculateCart(true);
                    showNotification('کد تخفیف با موفقیت اعمال شد!', 'success');
                }
            } else {
                // Invalid promo code
                promoPrice = 0;
                showNotification('این کد تخفیف معتبر نیست!', 'error');
                
                // Hide promo section with animation
                $(DOM.summaryPromo).fadeOut(fadeTime, function() {
                    $(this).addClass('hide');
                });
            }
        },
        error: function(xhr) {
            console.log(xhr.status + ": " + xhr.responseText);
            showNotification('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.', 'error');
            promoPrice = 0;
        },
        complete: function() {
            // Restore button state
            $btn.text(originalText).prop('disabled', false);
        }
    });
});

/* Enhanced notification system (Nothing Phone Style) */
function showNotification(message, type = 'info') {
    // Remove existing notification if present
    $('.ice-notification').remove();
    
    const colors = {
        success: '#B9E6FF',
        error: '#FF6B6B',
        warning: '#E0F2FE',
        info: '#8E8E93'
    };
    
    const notification = $(`
        <div class="ice-notification" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #121212;
            border: 1px solid ${colors[type]};
            border-radius: 16px;
            padding: 12px 24px;
            color: #FFFFFF;
            font-family: 'Shabnam', sans-serif;
            z-index: 10000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
        ">
            ${message}
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

/* Add animation keyframes dynamically */
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
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .price-updated {
            animation: pulse 0.3s ease;
        }
    </style>
`);

/* Recalculate cart */
function recalculateCart(onlyTotal) {
    let subtotal = 0;
    
    /* Sum up row totals */
    $(DOM.basketProducts).each(function() {
        const subtotalText = $(this).children(DOM.subtotalElements).text();
        const subtotalValue = parseInt(subtotalText) || 0;
        subtotal += subtotalValue;
    });
    
    /* Calculate totals */
    let total = subtotal;
    
    // Apply promo discount if valid
    let promoPriceValue = parseInt($(DOM.promoValue).text()) || 0;
    
    if (promoPriceValue && promoPriceValue > 0) {
        if (subtotal >= 10000) {
            const discountAmount = (promoPriceValue * total) / 100;
            total = total - discountAmount;
            total = Math.round(total); // Round to nearest integer
            
            // Update promo display with discount info
            $(DOM.promoValue).html(`${promoPriceValue}% <span style="font-size: 0.7rem;">(تخفیف)</span>`);
        } else {
            showNotification('برای استفاده از کد تخفیف باید مبلغ سفارشتان بیش از 10 هزار تومان باشد.', 'warning');
            $(DOM.summaryPromo).fadeOut(fadeTime, function() {
                $(this).addClass('hide');
            });
            promoPriceValue = 0;
        }
    }
    
    /* Format numbers with commas */
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    /* If switch for update only total, update only total display */
    if (onlyTotal) {
        /* Update total display with animation */
        $(DOM.totalValue).fadeOut(fadeTime, function() {
            $(DOM.basketTotal).html(formatPrice(total));
            $(DOM.totalValue).fadeIn(fadeTime);
        });
    } else {
        /* Update summary display */
        $('.final-value').fadeOut(fadeTime, function() {
            $(DOM.basketSubtotal).html(formatPrice(subtotal));
            $(DOM.basketTotal).html(formatPrice(total));
            
            if (total == 0 || subtotal == 0) {
                $(DOM.checkoutCta).fadeOut(fadeTime);
                $(DOM.basketSubtotal).parent().parent().find('.subtotal-title').text('سبد خرید خالی است');
            } else {
                $(DOM.checkoutCta).fadeIn(fadeTime);
            }
            $('.final-value').fadeIn(fadeTime);
        });
    }
    
    // Update total items badge
    updateSumItems();
    
    // Add animation to price elements
    $(DOM.totalValue).addClass('price-updated');
    setTimeout(() => {
        $(DOM.totalValue).removeClass('price-updated');
    }, 300);
}

/* Update quantity */
function updateQuantity(quantityInput) {
    /* Calculate line price */
    let productRow = $(quantityInput).closest('.basket-product');
    let priceText = productRow.children('.price').text();
    let price = parseInt(priceText) || 0;
    let quantity = parseInt($(quantityInput).val()) || 0;
    
    // Validate quantity range
    const maxQuantity = parseInt($(quantityInput).attr('max')) || 999;
    const minQuantity = parseInt($(quantityInput).attr('min')) || 1;
    
    if (quantity > maxQuantity) {
        quantity = maxQuantity;
        $(quantityInput).val(maxQuantity);
        showNotification(`حداکثر تعداد مجاز ${maxQuantity} عدد است`, 'warning');
    }
    
    if (quantity < minQuantity) {
        quantity = minQuantity;
        $(quantityInput).val(minQuantity);
    }
    
    let linePrice = price * quantity;
    
    /* Update line price display and recalc cart totals */
    productRow.children(DOM.subtotalElements).each(function() {
        $(this).fadeOut(fadeTime, function() {
            $(this).text(linePrice);
            recalculateCart();
            $(this).fadeIn(fadeTime);
        });
    });
    
    productRow.find('.item-quantity').text(quantity);
    updateSumItems();
    
    // Add animation to updated row
    productRow.css({
        'background-color': '#1a1a1a',
        'transition': 'background-color 0.3s ease'
    });
    
    setTimeout(() => {
        productRow.css('background-color', '');
    }, 300);
}

/* Update total items count */
function updateSumItems() {
    let sumItems = 0;
    $(DOM.quantityInputs).each(function() {
        let val = parseInt($(this).val());
        if (!isNaN(val)) {
            sumItems += val;
        }
    });
    
    const itemsText = sumItems === 1 ? 'محصول' : 'محصول';
    $(DOM.totalItems).text(`${sumItems} ${itemsText}`);
    
    // Update basket icon badge if exists
    if ($('.cart-badge').length) {
        $('.cart-badge').text(sumItems);
        if (sumItems === 0) {
            $('.cart-badge').fadeOut();
        } else {
            $('.cart-badge').fadeIn();
        }
    }
}

/* Remove item from cart */
function removeItem(removeButton) {
    /* Remove row from DOM and recalc cart total */
    let productRow = $(removeButton).closest('.basket-product');
    
    // Add fade out animation
    productRow.css({
        'transform': 'translateX(-20px)',
        'opacity': '0',
        'transition': 'all 0.3s ease'
    });
    
    setTimeout(() => {
        productRow.slideUp(fadeTime, function() {
            productRow.remove();
            recalculateCart();
            updateSumItems();
            updateCartUI();
            
            // Show notification
            showNotification('محصول از سبد خرید حذف شد', 'info');
            
            // If cart is empty, show empty state
            if ($(DOM.basketProducts).length === 0) {
                $('.basket').append(`
                    <div class="empty-cart-message" style="
                        text-align: center;
                        padding: 60px 20px;
                        background-color: #121212;
                        border-radius: 20px;
                        margin: 20px 0;
                    ">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.3 5.1 16.3H17M17 13L19 19M17 13H7M17 19C17 20.1 16.1 21 15 21C13.9 21 13 20.1 13 19C13 17.9 13.9 17 15 17C16.1 17 17 17.9 17 19ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z" 
                                  stroke="#E0F2FE" stroke-width="1.5" fill="none"/>
                        </svg>
                        <h3 style="color: #FFFFFF; margin-top: 20px;">سبد خرید شما خالی است</h3>
                        <p style="color: #8E8E93;">برای ادامه خرید به صفحه محصولات بروید</p>
                        <a href="/products/" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">مشاهده محصولات</a>
                    </div>
                `);
                $('.summary-total-items').hide();
            }
        });
    }, 150);
}

/* Setup CSRF Token for all AJAX requests */
$(function() {
    $.ajaxSetup({
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val() || getCookie('csrftoken')
        }
    });
});

/* Helper function to get CSRF token from cookies */
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

/* Send data to be saved in session with debounce */
let debounceTimer;
$('.quantity-field').on('change', function() {
    clearTimeout(debounceTimer);
    
    const $this = $(this);
    const newQuantity = $this.val();
    const productId = $this.attr('id');
    
    debounceTimer = setTimeout(() => {
        const data = {};
        
        $.ajax({
            url: "/order/update-session/",
            type: "POST",
            data: {
                new_quantity: newQuantity,
                product_id: productId,
            },
            success: function(response) {
                console.log("Session updated successfully");
                // Optional: update UI based on response
                if (response && response.new_total) {
                    $('#basket-total').text(response.new_total);
                }
            },
            error: function(xhr) {
                console.log(xhr.status + ": " + xhr.responseText);
                // Don't show alert to avoid disturbing user
                console.error("Failed to update session");
            }
        });
    }, 500); // 500ms debounce
});

/* Export functions for external use if needed */
window.basketFunctions = {
    recalculateCart,
    updateQuantity,
    removeItem,
    updateSumItems
};