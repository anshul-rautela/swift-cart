/**
 * AURA LUXE E-COMMERCE CLIENT APPLICATION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const API_BASE = '/api';
    let sessionId = localStorage.getItem('aura_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        localStorage.setItem('aura_session_id', sessionId);
    }

    let currentCategory = 'ALL';
    let currentSearch = '';
    let currentSort = 'featured';
    let appliedPromoCode = '';
    let cartData = null;
    let selectedPaymentMethod = 'CREDIT_CARD';
    let activeProductForModal = null;

    // --- DOM Elements ---
    const productGrid = document.getElementById('product-grid');
    const categoryContainer = document.getElementById('category-pills-container');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const sortSelect = document.getElementById('sort-select');
    const productCountLabel = document.getElementById('product-count-label');

    // Cart Drawer
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBadgeCount = document.getElementById('cart-badge-count');
    const cartNavTotal = document.getElementById('cart-nav-total');
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const discountRow = document.getElementById('discount-row');
    const cartTax = document.getElementById('cart-tax');
    const cartGrandTotal = document.getElementById('cart-grand-total');
    const promoInput = document.getElementById('promo-input');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoMessage = document.getElementById('promo-message');
    const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');

    // Product Modal
    const productModalOverlay = document.getElementById('product-modal-overlay');
    const closeProductModalBtn = document.getElementById('close-product-modal');
    const productModalContent = document.getElementById('product-modal-content');

    // Checkout Modal
    const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
    const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
    const shippingForm = document.getElementById('shipping-form');
    const toPaymentStepBtn = document.getElementById('to-payment-step-btn');
    const paymentStepPanel = document.getElementById('payment-step-panel');
    const paymentLoadingPanel = document.getElementById('payment-loading-panel');
    const confirmationStepPanel = document.getElementById('confirmation-step-panel');
    const backToShippingBtn = document.getElementById('back-to-shipping-btn');
    const paymentForm = document.getElementById('payment-form');
    const checkoutPayAmount = document.getElementById('checkout-pay-amount');
    const processingStatusText = document.getElementById('processing-status-text');
    const orderReceiptContent = document.getElementById('order-receipt-content');
    const finishOrderBtn = document.getElementById('finish-order-btn');

    // Card Input Live Preview
    const cardNumberInput = document.getElementById('card-number-input');
    const cardExpiryInput = document.getElementById('card-expiry-input');
    const cardNumDisplay = document.getElementById('card-num-display');
    const cardHolderDisplay = document.getElementById('card-holder-display');
    const cardExpDisplay = document.getElementById('card-exp-display');
    const custNameInput = document.getElementById('cust-name');

    // Orders Modal
    const myOrdersBtn = document.getElementById('my-orders-btn');
    const ordersModalOverlay = document.getElementById('orders-modal-overlay');
    const closeOrdersModalBtn = document.getElementById('close-orders-modal');
    const lookupOrderInput = document.getElementById('lookup-order-input');
    const lookupOrderBtn = document.getElementById('lookup-order-btn');
    const ordersListContainer = document.getElementById('orders-list-container');

    // Hero Actions
    const heroShopBtn = document.getElementById('hero-shop-btn');
    const applyPromoHeroBtn = document.getElementById('apply-promo-hero-btn');

    // --- Initialization ---
    init();

    async function init() {
        setupEventListeners();
        await loadCategories();
        await loadProducts();
        await refreshCart();
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Search & Filter
        let searchDebounceTimer;
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            clearSearchBtn.hidden = !currentSearch;
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => loadProducts(), 300);
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearch = '';
            clearSearchBtn.hidden = true;
            loadProducts();
        });

        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            loadProducts();
        });

        // Cart Drawer Toggles
        cartToggleBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);

        // Promo Code
        applyPromoBtn.addEventListener('click', handleApplyPromo);
        applyPromoHeroBtn.addEventListener('click', () => {
            promoInput.value = 'AURA20';
            handleApplyPromo();
            openCart();
        });

        // Hero CTA
        heroShopBtn.addEventListener('click', () => {
            document.querySelector('.catalog-header-bar').scrollIntoView({ behavior: 'smooth' });
        });

        // Modal Close Handlers
        closeProductModalBtn.addEventListener('click', () => closeModal(productModalOverlay));
        closeCheckoutModalBtn.addEventListener('click', () => closeModal(checkoutModalOverlay));
        closeOrdersModalBtn.addEventListener('click', () => closeModal(ordersModalOverlay));

        productModalOverlay.addEventListener('click', (e) => {
            if (e.target === productModalOverlay) closeModal(productModalOverlay);
        });
        checkoutModalOverlay.addEventListener('click', (e) => {
            if (e.target === checkoutModalOverlay) closeModal(checkoutModalOverlay);
        });
        ordersModalOverlay.addEventListener('click', (e) => {
            if (e.target === ordersModalOverlay) closeModal(ordersModalOverlay);
        });

        // Checkout Flow Stepper
        proceedCheckoutBtn.addEventListener('click', () => {
            if (!cartData || !cartData.items || cartData.items.length === 0) {
                showToast('Your shopping bag is empty!', 'warning');
                return;
            }
            closeCart();
            openCheckoutModal();
        });

        toPaymentStepBtn.addEventListener('click', () => {
            if (!shippingForm.checkValidity()) {
                shippingForm.reportValidity();
                return;
            }
            showCheckoutStep(2);
        });

        backToShippingBtn.addEventListener('click', () => {
            showCheckoutStep(1);
        });

        // Payment Method Tabs
        document.querySelectorAll('.pay-method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPaymentMethod = btn.dataset.method;

                const ccFields = document.getElementById('credit-card-fields');
                const upiFields = document.getElementById('upi-fields');
                const cardPreview = document.getElementById('card-preview');

                if (selectedPaymentMethod === 'CREDIT_CARD' || selectedPaymentMethod === 'ONE_CLICK') {
                    ccFields.style.display = 'grid';
                    upiFields.style.display = 'none';
                    cardPreview.style.display = 'flex';
                } else {
                    ccFields.style.display = 'none';
                    upiFields.style.display = 'block';
                    cardPreview.style.display = 'none';
                }
            });
        });

        // Live Card Format & Preview
        cardNumberInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 16);
            let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = formatted;
            cardNumDisplay.textContent = formatted || '•••• •••• •••• 4242';
        });

        cardExpiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 3) {
                val = val.substring(0, 2) + '/' + val.substring(2);
            }
            e.target.value = val;
            cardExpDisplay.textContent = val || '12/28';
        });

        custNameInput.addEventListener('input', (e) => {
            cardHolderDisplay.textContent = e.target.value.toUpperCase() || 'ALEX MORGAN';
        });

        // Submit Payment & Simulation
        paymentForm.addEventListener('submit', handlePaymentSubmit);

        finishOrderBtn.addEventListener('click', () => {
            closeModal(checkoutModalOverlay);
            refreshCart();
        });

        // Orders History Lookup
        myOrdersBtn.addEventListener('click', () => {
            openModal(ordersModalOverlay);
            loadSessionOrders();
        });

        lookupOrderBtn.addEventListener('click', () => {
            const num = lookupOrderInput.value.trim();
            if (num) fetchSingleOrder(num);
        });
    }

    // --- API & Data Loading ---

    async function loadCategories() {
        try {
            const res = await fetch(`${API_BASE}/products/categories`);
            if (!res.ok) return;
            const categories = await res.json();
            
            categoryContainer.innerHTML = `
                <button class="pill-btn active" data-category="ALL"><i class="fa-solid fa-border-all"></i> All Products</button>
            ` + categories.map(cat => `
                <button class="pill-btn" data-category="${cat}">${getCategoryIcon(cat)} ${cat}</button>
            `).join('');

            // Add click events to dynamic pill buttons
            document.querySelectorAll('.pill-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentCategory = btn.dataset.category;
                    loadProducts();
                });
            });
        } catch (err) {
            console.error('Failed loading categories', err);
        }
    }

    async function loadProducts() {
        productGrid.innerHTML = `
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        `;

        try {
            let url = `${API_BASE}/products?sortBy=${currentSort}`;
            if (currentCategory !== 'ALL') url += `&category=${encodeURIComponent(currentCategory)}`;
            if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;

            const res = await fetch(url);
            const products = await res.json();

            renderProductGrid(products);
        } catch (err) {
            console.error('Failed loading products', err);
            productGrid.innerHTML = `<div class="cart-empty-state"><p class="text-danger">Failed to load catalog from server.</p></div>`;
        }
    }

    function renderProductGrid(products) {
        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div class="cart-empty-state" style="grid-column: 1 / -1; padding: 4rem 1rem;">
                    <i class="fa-solid fa-box-open cart-empty-icon"></i>
                    <h3>No Products Found</h3>
                    <p>Try adjusting your search criteria or category filter.</p>
                </div>
            `;
            productCountLabel.textContent = '0 items found';
            return;
        }

        productCountLabel.textContent = `Showing ${products.length} product${products.length > 1 ? 's' : ''}`;

        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image-box">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                    ${product.tag ? `<span class="tag-badge ${product.tag}">${product.tag}</span>` : ''}
                    <button class="quick-view-overlay-btn" onclick="window.openProductDetail(${product.id})" title="Quick View">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category-label">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${renderStars(product.rating)}
                        <span class="review-count-text">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price-bar">
                        <div class="price-display">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-cart-btn" onclick="window.handleAddToCart(${product.id}, event)" title="Add to Bag">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- Cart Actions ---

    async function refreshCart() {
        try {
            let url = `${API_BASE}/cart?sessionId=${sessionId}`;
            if (appliedPromoCode) url += `&promoCode=${appliedPromoCode}`;

            const res = await fetch(url);
            cartData = await res.json();
            renderCartUI();
        } catch (err) {
            console.error('Error fetching cart summary', err);
        }
    }

    function renderCartUI() {
        if (!cartData) return;

        const count = cartData.itemCount || 0;
        cartBadgeCount.textContent = count;
        cartDrawerCount.textContent = `(${count})`;
        cartNavTotal.textContent = `$${cartData.total ? cartData.total.toFixed(2) : '0.00'}`;
        checkoutPayAmount.textContent = `$${cartData.total ? cartData.total.toFixed(2) : '0.00'}`;

        if (!cartData.items || cartData.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-bag-shopping cart-empty-icon"></i>
                    <h3>Your bag is empty</h3>
                    <p>Explore our luxury collection and add items to your cart.</p>
                </div>
            `;
            cartSubtotal.textContent = '$0.00';
            cartTax.textContent = '$0.00';
            cartGrandTotal.textContent = '$0.00';
            discountRow.style.display = 'none';
            return;
        }

        cartItemsContainer.innerHTML = cartData.items.map(item => `
            <div class="cart-item-card">
                <img src="${item.product.imageUrl}" alt="${item.product.name}" class="cart-item-thumb">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.product.name}</h4>
                    <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
                    <div class="cart-item-stepper">
                        <button class="step-btn" onclick="window.updateCartQty(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="item-qty-val">${item.quantity}</span>
                        <button class="step-btn" onclick="window.updateCartQty(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="window.removeCartItem(${item.id})" title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');

        cartSubtotal.textContent = `$${cartData.subtotal.toFixed(2)}`;
        cartTax.textContent = `$${cartData.tax.toFixed(2)}`;
        cartGrandTotal.textContent = `$${cartData.total.toFixed(2)}`;

        if (cartData.discount && cartData.discount > 0) {
            discountRow.style.display = 'flex';
            cartDiscount.textContent = `-$${cartData.discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    window.handleAddToCart = async function(productId, event) {
        if (event) event.stopPropagation();

        try {
            const res = await fetch(`${API_BASE}/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: productId,
                    quantity: 1,
                    sessionId: sessionId
                })
            });

            if (res.ok) {
                cartBadgeCount.classList.add('bounce');
                setTimeout(() => cartBadgeCount.classList.remove('bounce'), 400);
                showToast('Item added to your shopping bag!', 'success');
                await refreshCart();
            } else {
                const err = await res.json();
                showToast(err.message || 'Failed to add item', 'danger');
            }
        } catch (err) {
            console.error('Add to cart error', err);
            showToast('Connection error', 'danger');
        }
    };

    window.updateCartQty = async function(cartItemId, newQty) {
        try {
            const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQty })
            });

            if (res.ok) {
                await refreshCart();
            }
        } catch (err) {
            console.error('Update cart qty error', err);
        }
    };

    window.removeCartItem = async function(cartItemId) {
        try {
            const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Item removed from bag', 'info');
                await refreshCart();
            }
        } catch (err) {
            console.error('Remove cart item error', err);
        }
    };

    function handleApplyPromo() {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'AURA20' || code === 'SAVE20' || code === 'WELCOME10') {
            appliedPromoCode = code;
            promoMessage.innerHTML = `<span class="text-success"><i class="fa-solid fa-check-circle"></i> Promo code '${code}' applied!</span>`;
            showToast(`Promo code '${code}' applied!`, 'success');
            refreshCart();
        } else if (!code) {
            appliedPromoCode = '';
            promoMessage.textContent = '';
            refreshCart();
        } else {
            promoMessage.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-exclamation"></i> Invalid promo code</span>`;
            showToast('Invalid promo code. Try AURA20', 'warning');
        }
    }

    // --- Product Detail & Review Modal ---

    window.openProductDetail = async function(productId) {
        try {
            const res = await fetch(`${API_BASE}/products/${productId}`);
            if (!res.ok) return;
            activeProductForModal = await res.json();

            // Load reviews
            const reviewsRes = await fetch(`${API_BASE}/products/${productId}/reviews`);
            const reviews = await reviewsRes.json();

            renderProductModal(activeProductForModal, reviews);
            openModal(productModalOverlay);
        } catch (err) {
            console.error('Error opening product modal', err);
        }
    };

    function renderProductModal(product, reviews) {
        productModalContent.innerHTML = `
            <div class="product-detail-layout">
                <div class="detail-img-box">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="detail-info-box">
                    <span class="product-category-label">${product.category}</span>
                    <h2 class="hero-title" style="font-size: 1.8rem; margin-bottom: 0.5rem;">${product.name}</h2>
                    <div class="product-rating" style="margin-bottom: 1rem;">
                        ${renderStars(product.rating)}
                        <span style="color: #fff; font-weight: 700; margin-left: 0.5rem;">${product.rating}</span>
                        <span class="review-count-text">(${reviews.length} reviews)</span>
                    </div>

                    <div class="price-display" style="margin-bottom: 1.5rem;">
                        <span class="current-price" style="font-size: 2rem;">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price" style="font-size: 1.2rem;">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>

                    <p style="color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>

                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span>Availability:</span>
                            <span class="text-success" style="font-weight: 700;"><i class="fa-solid fa-circle-check"></i> ${product.stockQuantity} Units In Stock</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary btn-block" onclick="window.handleAddToCart(${product.id}); window.closeModal(document.getElementById('product-modal-overlay'));">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
                        </button>
                    </div>
                </div>
            </div>

            <div class="reviews-section">
                <h3 style="margin-bottom: 1.2rem;"><i class="fa-solid fa-star"></i> Customer Reviews & Ratings</h3>
                
                <!-- Review Form -->
                <form id="add-review-form" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); padding: 1.2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem; font-size: 1rem;">Write a Product Review</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <input type="text" id="reviewer-name-input" placeholder="Your Name" required class="input-field" style="padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: 6px; color: #fff;">
                        <select id="reviewer-rating-input" style="padding: 0.6rem; background: #111827; border: 1px solid var(--border-glass); border-radius: 6px; color: #fff;">
                            <option value="5">★★★★★ (5 Stars)</option>
                            <option value="4">★★★★☆ (4 Stars)</option>
                            <option value="3">★★★☆☆ (3 Stars)</option>
                            <option value="2">★★☆☆☆ (2 Stars)</option>
                            <option value="1">★☆☆☆☆ (1 Star)</option>
                        </select>
                    </div>
                    <textarea id="reviewer-comment-input" placeholder="Share details of your experience with this product..." rows="3" required style="width: 100%; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: 6px; color: #fff; margin-bottom: 1rem; font-family: inherit;"></textarea>
                    <button type="submit" class="btn btn-secondary"><i class="fa-solid fa-paper-plane"></i> Submit Review</button>
                </form>

                <div class="reviews-list">
                    ${reviews.length === 0 ? '<p style="color: var(--text-dim);">No reviews yet. Be the first to review this product!</p>' : reviews.map(r => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">${r.reviewerName}</span>
                                <span style="color: var(--accent-gold); font-size: 0.85rem;">${renderStars(r.rating)}</span>
                            </div>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">${r.comment}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('add-review-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewer-name-input').value.trim();
            const rating = parseInt(document.getElementById('reviewer-rating-input').value);
            const comment = document.getElementById('reviewer-comment-input').value.trim();

            try {
                const res = await fetch(`${API_BASE}/products/${product.id}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewerName: name, rating, comment })
                });

                if (res.ok) {
                    showToast('Review submitted successfully!', 'success');
                    openProductDetail(product.id);
                    loadProducts(); // Refresh catalog ratings
                }
            } catch (err) {
                console.error('Error submitting review', err);
            }
        });
    }

    // --- Payment Simulation & Checkout Flow ---

    function openCheckoutModal() {
        showCheckoutStep(1);
        openModal(checkoutModalOverlay);
    }

    function showCheckoutStep(stepNumber) {
        [shippingForm, paymentStepPanel, paymentLoadingPanel, confirmationStepPanel].forEach(p => p.classList.remove('active'));
        [document.getElementById('step-indicator-1'), document.getElementById('step-indicator-2'), document.getElementById('step-indicator-3')].forEach(s => s.classList.remove('active'));

        if (stepNumber === 1) {
            shippingForm.classList.add('active');
            document.getElementById('step-indicator-1').classList.add('active');
        } else if (stepNumber === 2) {
            paymentStepPanel.classList.add('active');
            document.getElementById('step-indicator-2').classList.add('active');
        } else if (stepNumber === 3) {
            confirmationStepPanel.classList.add('active');
            document.getElementById('step-indicator-3').classList.add('active');
        }
    }

    async function handlePaymentSubmit(e) {
        e.preventDefault();

        // Show Processing Screen with 3D Simulation Steps
        paymentStepPanel.classList.remove('active');
        paymentLoadingPanel.classList.add('active');

        const statusMessages = [
            'Encrypting payment token via AES-256...',
            'Connecting to Banking Gateway Sandbox...',
            'Verifying 3D Secure Authorization...',
            'Finalizing transaction status...'
        ];

        let index = 0;
        const statusInterval = setInterval(() => {
            if (index < statusMessages.length) {
                processingStatusText.textContent = statusMessages[index];
                index++;
            }
        }, 700);

        const checkoutData = {
            sessionId: sessionId,
            customerName: document.getElementById('cust-name').value,
            customerEmail: document.getElementById('cust-email').value,
            shippingAddress: document.getElementById('cust-address').value,
            city: document.getElementById('cust-city').value,
            zipCode: document.getElementById('cust-zip').value,
            paymentMethod: selectedPaymentMethod,
            promoCode: appliedPromoCode,
            cardNumber: cardNumberInput.value,
            cardExpiry: cardExpiryInput.value,
            cardCvv: document.getElementById('card-cvv-input').value
        };

        try {
            // Wait 2.8s for simulation experience
            await new Promise(r => setTimeout(r, 2800));
            clearInterval(statusInterval);

            const res = await fetch(`${API_BASE}/checkout/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkoutData)
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                renderOrderReceipt(responseData, checkoutData);
                showCheckoutStep(3);
                showToast('Payment Verified & Order Confirmed!', 'success');
            } else {
                paymentLoadingPanel.classList.remove('active');
                paymentStepPanel.classList.add('active');
                showToast(responseData.message || 'Payment simulation failed', 'danger');
            }
        } catch (err) {
            clearInterval(statusInterval);
            paymentLoadingPanel.classList.remove('active');
            paymentStepPanel.classList.add('active');
            showToast('Gateway Connection Error', 'danger');
        }
    }

    function renderOrderReceipt(response, checkoutData) {
        orderReceiptContent.innerHTML = `
            <div class="receipt-row">
                <span>Order Reference:</span>
                <span style="font-weight: 700; color: var(--primary); font-family: monospace;">${response.orderNumber}</span>
            </div>
            <div class="receipt-row">
                <span>Transaction ID:</span>
                <span style="font-family: monospace;">${response.transactionId}</span>
            </div>
            <div class="receipt-row">
                <span>Customer:</span>
                <span>${checkoutData.customerName}</span>
            </div>
            <div class="receipt-row">
                <span>Destination:</span>
                <span>${checkoutData.shippingAddress}, ${checkoutData.city}</span>
            </div>
            <div class="receipt-row">
                <span>Payment Method:</span>
                <span>${response.paymentMethod}</span>
            </div>
            <div class="receipt-row bold">
                <span>Total Amount Paid:</span>
                <span class="text-success">$${response.amountPaid.toFixed(2)}</span>
            </div>
        `;
    }

    // --- Orders History Lookup ---

    async function loadSessionOrders() {
        try {
            const res = await fetch(`${API_BASE}/orders?sessionId=${sessionId}`);
            const orders = await res.json();

            if (!orders || orders.length === 0) {
                ordersListContainer.innerHTML = `<p style="color: var(--text-dim); text-align: center; padding: 2rem 0;">No previous orders found for this session.</p>`;
                return;
            }

            ordersListContainer.innerHTML = orders.map(order => renderOrderCard(order)).join('');
        } catch (err) {
            console.error('Error fetching session orders', err);
        }
    }

    async function fetchSingleOrder(orderNumber) {
        try {
            const res = await fetch(`${API_BASE}/orders/${orderNumber}`);
            if (res.ok) {
                const order = await res.json();
                ordersListContainer.innerHTML = renderOrderCard(order);
            } else {
                ordersListContainer.innerHTML = `<p style="color: var(--accent-danger); text-align: center; padding: 2rem 0;">No order found matching "${orderNumber}"</p>`;
            }
        } catch (err) {
            console.error('Error fetching single order', err);
        }
    }

    function renderOrderCard(order) {
        return `
            <div class="order-item-card">
                <div class="order-card-header">
                    <span>Order #${order.orderNumber}</span>
                    <span class="status-pill ${order.paymentStatus}">${order.paymentStatus}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    Date: ${new Date(order.createdAt).toLocaleDateString()} | Txn: ${order.transactionId || 'N/A'}
                </div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #fff;">
                    Total: $${order.totalAmount.toFixed(2)} (${order.items.length} item${order.items.length > 1 ? 's' : ''})
                </div>
            </div>
        `;
    }

    // --- Helper Functions & Modals ---

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    }
    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    function openModal(modalEl) {
        modalEl.classList.add('active');
    }
    window.closeModal = function(modalEl) {
        modalEl.classList.remove('active');
    };

    function renderStars(rating) {
        const fullStars = Math.floor(rating || 5);
        const hasHalf = (rating % 1) >= 0.5;
        let html = '';
        for (let i = 0; i < fullStars; i++) html += '<i class="fa-solid fa-star"></i>';
        if (hasHalf) html += '<i class="fa-solid fa-star-half-stroke"></i>';
        const empty = 5 - fullStars - (hasHalf ? 1 : 0);
        for (let i = 0; i < empty; i++) html += '<i class="fa-regular fa-star"></i>';
        return html;
    }

    function getCategoryIcon(category) {
        switch (category) {
            case 'Audio & Sound': return '<i class="fa-solid fa-headphones"></i>';
            case 'Smart Devices': return '<i class="fa-solid fa-mobile-screen"></i>';
            case 'Accessories': return '<i class="fa-solid fa-bag-shopping"></i>';
            case 'Home & Lifestyle': return '<i class="fa-solid fa-house"></i>';
            case 'Fashion & Apparel': return '<i class="fa-solid fa-shirt"></i>';
            default: return '<i class="fa-solid fa-tag"></i>';
        }
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'warning') icon = 'fa-triangle-exclamation';
        if (type === 'danger') icon = 'fa-circle-xmark';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
});
