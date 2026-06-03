/* ============================================
   ICE-DARK PAGINATION & PRODUCT LIST (Nothing Phone Style)
   Enhanced product display with modern UI
   ============================================ */

// Global variables for better state management
let currentPageUrl = null;
let isLoading = false;
let currentCategory = null;

/**
 * Main pagination function - Fetches and displays products
 * @param {string} url - API endpoint URL for fetching products
 * @param {boolean} append - Whether to append products (for infinite scroll) or replace
 */
function pagination_func(url = '/rest/products_list', append = false) {
    
    // Prevent multiple simultaneous requests
    if (isLoading) {
        console.log('Loading in progress, please wait...');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator();
    isLoading = true;
    
    const data = {};
    
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function(data) {
            console.log('Products fetched successfully');
            
            let next_page = data['links']['next'];
            let previous_page = data['links']['previous'];
            let products = data['results'];
            
            // Store current page URL for state management
            currentPageUrl = url;
            
            // Clear or append content
            if (!append) {
                $('#product_card').html("");
                $('#pagination').html("");
                
                // Add fade out animation for existing content
                $('#product_card').css('opacity', '0');
                setTimeout(() => {
                    $('#product_card').css('opacity', '1');
                }, 150);
            }
            
            // Display products with enhanced card design
            if (products && products.length > 0) {
                for (let product of products) {
                    let product_card = createProductCard(product);
                    $('#product_card').append(product_card);
                }
            } else {
                // Show empty state
                showEmptyState();
            }
            
            // Generate pagination buttons
            generatePaginationButtons(previous_page, next_page);
            
            // Initialize product card animations
            initializeProductCards();
            
            // Hide loading indicator
            hideLoadingIndicator();
            isLoading = false;
            
            // Scroll to top smoothly when navigating pages (not for append)
            if (!append) {
                $('html, body').animate({
                    scrollTop: $('#product_card').offset().top - 100
                }, 300);
            }
        },
        error: function(e) {
            console.log("ERROR : ", e);
            showErrorMessage('خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.');
            hideLoadingIndicator();
            isLoading = false;
        }
    });
}

/**
 * Creates an enhanced product card HTML with Nothing Phone styling
 * @param {Object} product - Product data object
 * @returns {string} HTML string for product card
 */
function createProductCard(product) {
    // Calculate discount if available (example logic)
    const originalPrice = product.price;
    const discountedPrice = product.discounted_price || originalPrice;
    const hasDiscount = discountedPrice < originalPrice;
    const discountPercent = hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
    
    // Format price with commas
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Generate rating stars
    const rating = product.rate || 0;
    const starsHtml = generateRatingStars(rating);
    
    // Get product image URL with fallback
    const imageUrl = product.image && product.image[0] ? product.image[0]["image"] : '/static/img/placeholder.jpg';
    
    // Create enhanced product card
    return `
        <div class="col-md-4 col-sm-6 mb-4 product-card-wrapper">
            <div class="card product-wap shadow-sm">
                <div class="card product-image-container">
                    <img class="card-img img-fluid product-image" 
                         alt="${escapeHtml(product.title)}" 
                         src="${escapeHtml(imageUrl)}"
                         loading="lazy">
                    <div class="card-img-overlay product-overlay d-flex align-items-center justify-content-center">
                        <ul class="list-unstyled">
                            <li>
                                <a class="btn btn-primary view-product-btn" href="/products/${product.slug}">
                                    مشاهده
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill ms-1" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card-body">
                    <a href="/products/${product.slug}" class="h3 text-decoration-none product-title">${escapeHtml(product.title)}</a>
                    
                    <div class="product-rating mb-2">
                        ${starsHtml}
                        <span class="rating-count text-muted">(${rating})</span>
                    </div>
                    
                    <div class="product-price">
                        ${hasDiscount ? `
                            <span class="price-old">${formatPrice(originalPrice)} تومان</span>
                            <span class="price-current">${formatPrice(discountedPrice)} تومان</span>
                            <span class="discount-badge">-${discountPercent}%</span>
                        ` : `
                            <span class="price-current">${formatPrice(originalPrice)} تومان</span>
                        `}
                    </div>
                    
                    ${product.count > 0 ? `
                        <div class="stock-status in-stock">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#B9E6FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            موجود در انبار
                        </div>
                    ` : `
                        <div class="stock-status out-of-stock">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            ناموجود
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates HTML for rating stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string for stars
 */
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#E0F2FE" class="bi bi-star-fill me-1" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
        `;
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#E0F2FE" class="bi bi-star-half me-1" viewBox="0 0 16 16">
                <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
            </svg>
        `;
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#8E8E93" class="bi bi-star me-1" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.576-2.906 2.77a.565.565 0 0 0-.163.505l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
            </svg>
        `;
    }
    
    return starsHtml;
}

/**
 * Generates pagination buttons with improved UI
 * @param {string} previous_page - Previous page URL
 * @param {string} next_page - Next page URL
 */
function generatePaginationButtons(previous_page, next_page) {
    const paginationContainer = $('#pagination');
    
    // Add container class for styling
    paginationContainer.addClass('pagination-buttons');
    
    // Helper to create button with animation
    const createButton = (text, url, direction, isDisabled = false) => {
        if (isDisabled || !url) {
            return `<button class="pagination-btn disabled" disabled>
                        <span>${text}</span>
                    </button>`;
        }
        return `<button class="pagination-btn" onclick="pagination_func('${url}'); return false;">
                    <span>${text}</span>
                </button>`;
    };
    
    let buttonsHtml = '';
    
    // Previous button (right arrow for RTL)
    buttonsHtml += createButton('‹', previous_page, 'prev', !previous_page);
    
    // Page indicator
    if (currentPageUrl) {
        const pageMatch = currentPageUrl.match(/[?&]page=(\d+)/);
        const currentPage = pageMatch ? parseInt(pageMatch[1]) : 1;
        buttonsHtml += `<span class="page-indicator">صفحه ${currentPage}</span>`;
    }
    
    // Next button (left arrow for RTL)
    buttonsHtml += createButton('›', next_page, 'next', !next_page);
    
    paginationContainer.html(buttonsHtml);
}

/**
 * Initialize product card animations and interactions
 */
function initializeProductCards() {
    // Add hover animations to product cards
    $('.product-wap').each(function() {
        $(this).css({
            'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            'cursor': 'pointer'
        });
        
        // Make entire card clickable
        $(this).on('click', function(e) {
            if (!$(e.target).closest('.view-product-btn').length) {
                const productLink = $(this).find('.product-title').attr('href');
                if (productLink) {
                    window.location.href = productLink;
                }
            }
        });
    });
    
    // Add fade-in animation to new cards
    $('.product-card-wrapper').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        });
        
        setTimeout(() => {
            $(this).css({
                'opacity': '1',
                'transform': 'translateY(0)',
                'transition': 'all 0.4s ease'
            });
        }, index * 50);
    });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    if ($('#loading-indicator').length === 0) {
        const loader = `
            <div id="loading-indicator" class="loading-indicator">
                <div class="spinner"></div>
                <p>در حال بارگذاری محصولات...</p>
            </div>
        `;
        $('#product_card').before(loader);
    }
    $('#loading-indicator').fadeIn(200);
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    $('#loading-indicator').fadeOut(200, function() {
        $(this).remove();
    });
}

/**
 * Show empty state when no products found
 */
function showEmptyState() {
    const emptyState = `
        <div class="empty-state">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L9 18L4 13" stroke="#E0F2FE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="#8E8E93" stroke-width="1.5"/>
            </svg>
            <h3>محصولی یافت نشد</h3>
            <p>لطفاً دسته‌بندی دیگری را انتخاب کنید</p>
        </div>
    `;
    $('#product_card').html(emptyState);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const errorDiv = `
        <div class="error-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>${escapeHtml(message)}</p>
            <button onclick="location.reload()" class="btn btn-primary">تلاش مجدد</button>
        </div>
    `;
    $('#product_card').html(errorDiv);
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

/**
 * Filter products by category
 * @param {string} category - Category name
 */
function filterByCategory(category) {
    currentCategory = category;
    const url = category && category !== 'undefined' 
        ? `/rest/products_list?category=${encodeURIComponent(category)}`
        : '/rest/products_list';
    pagination_func(url);
}

/**
 * Sort products
 * @param {string} sortBy - Sort criteria
 */
function sortProducts(sortBy) {
    let url = currentPageUrl || '/rest/products_list';
    url += (url.includes('?') ? '&' : '?') + `ordering=${sortBy}`;
    pagination_func(url);
}

// Initialize on page load
$(document).ready(function() {
    pagination_func();
    
    // Add category filter event listeners
    $('input[name="option"]').on('change', function() {
        const category = $(this).val();
        filterByCategory(category);
    });
    
    // Add sort event listener
    $('select.form-control').on('change', function() {
        const sortValue = $(this).val();
        let sortParam = '';
        switch(sortValue) {
            case 'ارزان‌ترین':
                sortParam = 'price';
                break;
            case 'گران‌ترین':
                sortParam = '-price';
                break;
            case 'جدیدترین':
                sortParam = '-created_at';
                break;
            case 'پربازدیدترین':
                sortParam = '-views';
                break;
            default:
                sortParam = '-created_at';
        }
        sortProducts(sortParam);
    });
});