/* ============================================================
   IOS SCRIPT - Cupertino Logic
   Restoran Pak Haji Ali & Muiz Hot Chicken
   ============================================================ */

'use strict';

// ===== STATE =====
let cart = [];
let orders = [];
let currentTab = 'home';
let currentCategory = 'All';
let modalData = null;
let isModalOpen = false;

// ===== CONSTANTS =====
const FLAT_MENU = MENU_DATA.flatMap(cat => cat.items.map(item => ({
    ...item,
    category: cat.category
})));

const CATEGORIES = ['All', ...MENU_DATA.map(c => c.category)];

// ===== HELPERS =====
function fmt(price) {
    return 'RM' + price.toFixed(2);
}

function escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2200);
}

function saveCart() {
    try {
        localStorage.setItem('ios_cart', JSON.stringify(cart));
    } catch (_) {}
    updateBadges();
}

function loadCart() {
    try {
        const d = localStorage.getItem('ios_cart');
        if (d) cart = JSON.parse(d);
    } catch (_) { cart = []; }
    if (!Array.isArray(cart)) cart = [];
    updateBadges();
}

function saveOrders() {
    try {
        localStorage.setItem('ios_orders', JSON.stringify(orders));
    } catch (_) {}
}

function loadOrders() {
    try {
        const d = localStorage.getItem('ios_orders');
        if (d) orders = JSON.parse(d);
    } catch (_) { orders = []; }
    if (!Array.isArray(orders)) orders = [];
}

function updateBadges() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    
    const headerBadge = document.getElementById('headerCartBadge');
    if (headerBadge) {
        headerBadge.textContent = total;
        headerBadge.classList.toggle('show', total > 0);
    }
    
    const tabBadge = document.getElementById('tabCartBadge');
    if (tabBadge) {
        tabBadge.textContent = total;
        tabBadge.classList.toggle('show', total > 0);
    }
}

function getCartTotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function getCartItemCount() {
    return cart.reduce((s, i) => s + i.qty, 0);
}

// ===== RENDER FUNCTIONS =====

function renderHome() {
    const container = document.getElementById('pageHome');
    if (!container) return;
    
    // Featured items
    const featured = FLAT_MENU.slice(0, 8);
    const featuredHTML = featured.map(item => `
        <div class="scroll-card" 
             data-name="${escapeHtml(item.name)}" 
             data-price="${item.price}" 
             data-img="${item.img}" 
             data-desc="${escapeHtml(item.desc)}">
            <img src="${item.img}" alt="${escapeHtml(item.name)}" loading="lazy" />
            <h4>${escapeHtml(item.name)}</h4>
            <div class="price">${fmt(item.price)}</div>
            <button class="add-btn" 
                    data-name="${escapeHtml(item.name)}" 
                    data-price="${item.price}" 
                    data-img="${item.img}" 
                    data-desc="${escapeHtml(item.desc)}">
                + Add
            </button>
        </div>
    `).join('');
    
    // Reviews
    const reviewsHTML = REVIEWS.map(r => `
        <div class="review-card">
            <div class="avatar">${escapeHtml(r.name.charAt(0))}</div>
            <div class="name">${escapeHtml(r.name)}</div>
            <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <div class="text">"${escapeHtml(r.text)}"</div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="hero">
            <div class="hero-badge"><i class="fas fa-certificate"></i> JAKIM Halal</div>
            <h2>Best Crispy Chicken<br />in Subang Jaya</h2>
            <p>Est. 1 May 2026 • USJ 8 • Dine-in, takeaway &amp; delivery</p>
            <div class="hero-actions">
                <button class="btn btn-white" onclick="switchTab('menu')">
                    <i class="fas fa-utensils"></i> View Menu
                </button>
                <a href="https://wa.me/60179081447?text=Hi%2C%20I%20want%20to%20place%20an%20order%20from%20Restoran%20Pak%20Haji%20Ali%20%26%20Muiz%20Hot%20Chicken%20-%20Subang%20Jaya%20(USJ%208)." 
                   target="_blank" 
                   rel="noopener" 
                   class="btn btn-outline-white">
                    <i class="fab fa-whatsapp"></i> Order Now
                </a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat">
                <i class="fas fa-drumstick-bite"></i>
                <strong>200+</strong>
                <small>Branches</small>
            </div>
            <div class="stat">
                <i class="fas fa-star"></i>
                <strong>5★</strong>
                <small>Google Rated</small>
            </div>
            <div class="stat">
                <i class="fas fa-clock"></i>
                <strong>9am–9pm</strong>
                <small>Open Daily</small>
            </div>
        </div>
        
        <h3 class="section-title">🔥 Most Ordered</h3>
        <p class="section-sub">Customer favourites</p>
        <div class="scroll-horizontal">${featuredHTML}</div>
        
        <h3 class="section-title" style="margin-top: 16px;">💬 Customer Reviews</h3>
        <p class="section-sub">What people are saying</p>
        <div class="scroll-horizontal">${reviewsHTML}</div>
        
        <div class="about-snippet">
            <h3>Restoran <span>Pak Haji Ali</span> &amp; Muiz Hot Chicken</h3>
            <p>Established on <strong>1 May 2026</strong>, we serve <strong>JAKIM Halal</strong> certified crispy Muiz Hot Chicken, authentic Nasi Kandar, and Malaysian-Thai favourites in <strong>Subang Jaya (USJ 8)</strong>.</p>
            <p style="font-size:13px;color:var(--text-tertiary);">📍 Goodyear Court 6, Persiaran Mulia, USJ 8</p>
            <div class="tags">
                <span><i class="fas fa-certificate" style="color:var(--primary);"></i> Halal</span>
                <span><i class="fas fa-shield-halved" style="color:var(--primary);"></i> MeSTI</span>
                <span><i class="fas fa-utensils"></i> Nasi Kandar</span>
                <span><i class="fas fa-drumstick-bite"></i> Fried Chicken</span>
                <span><i class="fas fa-pepper-hot"></i> Tomyam</span>
            </div>
        </div>
        
        <div style="background:var(--card);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);margin-bottom:16px;">
            <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:28px;">✅</span>
                    <div>
                        <div style="font-weight:700;font-size:14px;color:var(--text);">JAKIM Halal &amp; MeSTI Certified</div>
                        <div style="font-size:12px;color:var(--text-tertiary);">Product &amp; premises certified</div>
                    </div>
                </div>
                <button onclick="switchTab('profile')" 
                        style="font-size:13px;font-weight:600;color:var(--primary);background:none;border:none;cursor:pointer;font-family:inherit;">
                    Learn more →
                </button>
            </div>
        </div>
    `;
    
    // Event listeners for featured cards
    container.querySelectorAll('.scroll-card').forEach(card => {
        card.addEventListener('click', function() {
            openModal({
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                img: this.dataset.img,
                desc: this.dataset.desc
            });
        });
    });
    
    container.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.scroll-card');
            openModal({
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                img: card.dataset.img,
                desc: card.dataset.desc
            });
        });
    });
}

function renderMenu() {
    const container = document.getElementById('pageMenu');
    if (!container) return;
    
    // Categories
    const categoriesHTML = CATEGORIES.map(cat => `
        <button class="${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">
            ${cat}
        </button>
    `).join('');
    
    // Items
    let items = FLAT_MENU;
    if (currentCategory !== 'All') {
        items = FLAT_MENU.filter(i => i.category === currentCategory);
    }
    
    const itemsHTML = items.map(item => `
        <div class="menu-item" 
             data-name="${escapeHtml(item.name)}" 
             data-price="${item.price}" 
             data-img="${item.img}" 
             data-desc="${escapeHtml(item.desc)}">
            <img src="${item.img}" alt="${escapeHtml(item.name)}" loading="lazy" />
            <h4>${escapeHtml(item.name)}</h4>
            <div class="desc">${escapeHtml(item.desc)}</div>
            <div class="bottom">
                <span class="price">${fmt(item.price)}</span>
                <button class="add-small" 
                        data-name="${escapeHtml(item.name)}" 
                        data-price="${item.price}" 
                        data-img="${item.img}" 
                        data-desc="${escapeHtml(item.desc)}">
                    Add
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div style="margin-bottom:4px;">
            <h2 class="section-title">Our Menu</h2>
            <p class="section-sub">Tap any item to customise</p>
        </div>
        <div class="menu-categories" id="menuCategories">${categoriesHTML}</div>
        <div class="menu-grid" id="menuGrid">
            ${items.length > 0 ? itemsHTML : '<div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-tertiary);">No items in this category</div>'}
        </div>
    `;
    
    // Category events
    container.querySelectorAll('.menu-categories button').forEach(btn => {
        btn.addEventListener('click', function() {
            currentCategory = this.dataset.cat;
            renderMenu();
        });
    });
    
    // Menu item events
    container.querySelectorAll('.menu-item').forEach(el => {
        el.addEventListener('click', function() {
            openModal({
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                img: this.dataset.img,
                desc: this.dataset.desc
            });
        });
    });
    
    container.querySelectorAll('.add-small').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const el = this.closest('.menu-item');
            openModal({
                name: el.dataset.name,
                price: parseFloat(el.dataset.price),
                img: el.dataset.img,
                desc: el.dataset.desc
            });
        });
    });
}

function renderCart() {
    const container = document.getElementById('pageCart');
    if (!container) return;
    
    const count = getCartItemCount();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <h2 class="section-title">🛒 Your Cart</h2>
            <p class="section-sub">Add items to get started</p>
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items from our menu!</p>
            </div>
        `;
        return;
    }
    
    let cartHTML = `
        <h2 class="section-title">🛒 Your Cart</h2>
        <p class="section-sub">${count} item${count > 1 ? 's' : ''} in cart</p>
        <div class="cart-list">
    `;
    
    cart.forEach((item, idx) => {
        cartHTML += `
            <div class="cart-item">
                <img src="${item.img || 'images/placeholder.webp'}" alt="${escapeHtml(item.name)}" loading="lazy" />
                <div class="info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <div class="price">${fmt(item.price)}</div>
                    ${item.request ? `<div class="request">📝 ${escapeHtml(item.request)}</div>` : ''}
                </div>
                <div class="controls">
                    <button class="qty-dec" data-idx="${idx}" aria-label="Decrease quantity">−</button>
                    <span class="qty">${item.qty}</span>
                    <button class="qty-inc" data-idx="${idx}" aria-label="Increase quantity">+</button>
                    <button class="remove" data-idx="${idx}" aria-label="Remove item">✕</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `</div>`;
    
    const total = getCartTotal();
    cartHTML += `
        <div class="cart-summary">
            <div class="row">
                <span>Subtotal</span>
                <span>${fmt(total)}</span>
            </div>
            <div class="row total">
                <span>Total</span>
                <span class="amount">${fmt(total)}</span>
            </div>
            <button class="checkout-btn" id="cartCheckoutBtn">
                <i class="fab fa-whatsapp"></i> Order via WhatsApp
            </button>
        </div>
    `;
    
    container.innerHTML = cartHTML;
    
    // Cart controls
    container.querySelectorAll('.qty-dec').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            if (cart[idx].qty > 1) {
                cart[idx].qty--;
            } else {
                cart.splice(idx, 1);
            }
            saveCart();
            renderCart();
            updateBadges();
        });
    });
    
    container.querySelectorAll('.qty-inc').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            cart[idx].qty++;
            saveCart();
            renderCart();
            updateBadges();
        });
    });
    
    container.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            cart.splice(idx, 1);
            saveCart();
            renderCart();
            updateBadges();
            toast('Item removed from cart');
        });
    });
    
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', placeOrder);
    }
}

function renderOrders() {
    const container = document.getElementById('pageOrders');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <h2 class="section-title">📦 Order History</h2>
            <p class="section-sub">Your past orders</p>
            <div class="order-empty">
                <i class="fas fa-clock-rotate-left"></i>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
            </div>
        `;
        return;
    }
    
    const ordersHTML = orders.map((order, idx) => `
        <div class="order-card">
            <div class="top">
                <span class="date">${order.date || 'Order #' + (idx + 1)}</span>
                <span class="status">✓ Completed</span>
            </div>
            <div class="items">${order.items.map(i => `${i.name} x${i.qty}`).join(' • ')}</div>
            <div class="total">${fmt(order.total)}</div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <h2 class="section-title">📦 Order History</h2>
        <p class="section-sub">${orders.length} order${orders.length > 1 ? 's' : ''} placed</p>
        ${ordersHTML}
        <button class="clear-orders-btn" id="clearOrdersBtn" onclick="clearOrderHistory()">
            <i class="fas fa-trash-can"></i> Clear All Orders
        </button>
    `;
}

// Add this function after renderOrders()
function clearOrderHistory() {
    if (orders.length === 0) return;
    
    if (confirm('Are you sure you want to clear all order history? This cannot be undone.')) {
        orders = [];
        saveOrders();
        renderOrders();
        toast('Order history cleared');
    }
}

function renderProfile() {
    const container = document.getElementById('pageProfile');
    if (!container) return;
    
    container.innerHTML = `
        <div class="profile-card">
            <div class="logo">🍗</div>
            <h2>Restoran Pak Haji Ali &amp; Muiz Hot Chicken</h2>
            <div class="sub">Subang Jaya (USJ 8)</div>
            <div class="badge-row">
                <span><i class="fas fa-certificate" style="color:var(--primary);"></i> JAKIM Halal</span>
                <span><i class="fas fa-shield-halved" style="color:var(--primary);"></i> MeSTI</span>
                <span><i class="fas fa-star" style="color:#f59e0b;"></i> 5★ Rated</span>
            </div>
        </div>
        
        <div class="profile-hours">
            <h4><i class="fas fa-clock" style="color:var(--primary);"></i> Opening Hours</h4>
            <p><i class="fas fa-calendar-day"></i> Monday – Sunday</p>
            <p><i class="fas fa-clock"></i> 9:00 AM – 9:00 PM</p>
        </div>
        
        <div class="profile-links">
            <a href="https://wa.me/60179081447?text=Hi%2C%20I%20want%20to%20place%20an%20order%20from%20Restoran%20Pak%20Haji%20Ali%20%26%20Muiz%20Hot%20Chicken%20-%20Subang%20Jaya%20(USJ%208)." 
               target="_blank" rel="noopener">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
            <a href="tel:+60179081447">
                <i class="fas fa-phone"></i> Call Us
            </a>
            <a href="https://g.page/r/CUrZw9xvAXIPEBE" target="_blank" rel="noopener">
                <i class="fas fa-map-pin"></i> Google Maps
            </a>
            <a href="https://g.page/r/CUrZw9xvAXIPEBE/review" target="_blank" rel="noopener">
                <i class="fas fa-star"></i> Leave Review
            </a>
            <a href="https://www.facebook.com/61591075012810/" target="_blank" rel="noopener">
                <i class="fab fa-facebook"></i> Facebook
            </a>
            <a href="https://www.tiktok.com/@muiz.fried.chicken" target="_blank" rel="noopener">
                <i class="fab fa-tiktok"></i> TikTok
            </a>
            <a href="https://www.youtube.com/@MHCRestoranPakHajiAli" target="_blank" rel="noopener">
                <i class="fab fa-youtube"></i> YouTube
            </a>
            <a href="https://r.grab.com/g/6-20260630_094247_c8be9e5df8e142aeba682bdb1ba93358_MEXMPS-1-C6D2TUKFCP2UT6" 
               target="_blank" rel="noopener">
                <i class="fas fa-bag-shopping"></i> GrabFood
            </a>
            <a href="https://www.foodpanda.my/restaurant/bn66/restoran-pak-haji-ali-and-muiz-hot-chicken-bn66" 
               target="_blank" rel="noopener">
                <i class="fas fa-utensils"></i> Foodpanda
            </a>
            <a href="https://shopee.com.my/universal-link/now-food/shop/20561288" target="_blank" rel="noopener">
                <i class="fas fa-store"></i> ShopeeFood
            </a>
            <a href="https://link.misirakyat.com/vendor/a1fc8eb6-2559-4031-b513-e5c07874a04b" 
               target="_blank" rel="noopener">
                <i class="fas fa-mobile-screen"></i> Misirakyat
            </a>
            // Find and replace these lines in renderProfile():
<a href="https://pakhajiali.github.io/menu/catering/" target="_blank" rel="noopener noreferrer">
    <i class="fas fa-utensils"></i> Halal Catering
</a>
<a href="https://pakhajiali.github.io/menu/company-profile.html" target="_blank" rel="noopener noreferrer">
    <i class="fas fa-file-pdf"></i> Company Profile
</a>
        </div>
        
        <div style="background:var(--card);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);font-size:13px;color:var(--text-tertiary);text-align:center;margin-bottom:16px;">
            <p><i class="fas fa-location-dot" style="color:var(--primary);"></i> J2-00-04, Subang Perdana Phase 3, Persiaran Mulia, Goodyear Court 6, USJ 8, 47610 Subang Jaya, Selangor</p>
        </div>
        
        <div style="background:var(--card);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow);font-size:12px;color:var(--text-tertiary);text-align:center;border-left:3px solid var(--primary);">
            <p><i class="fas fa-triangle-exclamation" style="color:var(--primary);"></i> <strong>Notice:</strong> We are an independent establishment at Goodyear Court 6, USJ 8. Not affiliated with Restoran Pak Ali in USJ 9.</p>
        </div>
    `;
}

// ===== MODAL FUNCTIONS =====

function openModal(product) {
    modalData = product;
    isModalOpen = true;
    
    const modal = document.getElementById('iosModal');
    document.getElementById('modalImg').src = product.img || 'images/placeholder.webp';
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalDesc').textContent = product.desc || '';
    document.getElementById('modalPrice').textContent = fmt(product.price);
    document.getElementById('modalQty').value = 1;
    document.getElementById('modalRequest').value = '';
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateModalWaLink(product);
}

function closeModal() {
    const modal = document.getElementById('iosModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalData = null;
    isModalOpen = false;
}

function updateModalWaLink(product) {
    if (!product) return;
    const qty = parseInt(document.getElementById('modalQty').value) || 1;
    const request = document.getElementById('modalRequest').value.trim();
    const total = product.price * qty;
    
    let msg = `Hi, I'd like to order: ${product.name} x${qty} (${fmt(total)}) from Restoran Pak Haji Ali & Muiz Hot Chicken - Subang Jaya (USJ 8).`;
    if (request) msg += `\n📝 Special: ${request}`;
    
    document.getElementById('modalWaBtn').href = `https://wa.me/60179081447?text=${encodeURIComponent(msg)}`;
}

function addFromModal() {
    if (!modalData) return;
    
    const qty = parseInt(document.getElementById('modalQty').value) || 1;
    const request = document.getElementById('modalRequest').value.trim();
    
    // Check if same item with same request exists
    const existing = cart.findIndex(i => i.name === modalData.name && i.request === request);
    
    if (existing !== -1) {
        cart[existing].qty += qty;
    } else {
        cart.push({
            name: modalData.name,
            price: modalData.price,
            qty: qty,
            img: modalData.img,
            request: request
        });
    }
    
    saveCart();
    renderCart();
    updateBadges();
    closeModal();
    toast(`Added ${modalData.name} x${qty} to cart`);
}

// ===== PLACE ORDER =====

function placeOrder() {
    if (cart.length === 0) {
        toast('Cart is empty');
        return;
    }
    
    const total = getCartTotal();
    
    // Build WhatsApp message
    let msg = 'Hi, I want to place an order from Restoran Pak Haji Ali & Muiz Hot Chicken - Subang Jaya (USJ 8):\n\n';
    
    cart.forEach(item => {
        msg += `🍗 ${item.name} x${item.qty} = ${fmt(item.price * item.qty)}`;
        if (item.request) msg += `\n   📝 Special: ${item.request}`;
        msg += '\n';
    });
    
    msg += `\n━━━━━━━━━━━━━━━━\nTotal: ${fmt(total)}`;
    msg += `\n\nPlease confirm my order. Thank you! 🙏`;
    
    // Save order to history
    orders.push({
        date: new Date().toLocaleString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        items: cart.map(i => ({ name: i.name, qty: i.qty })),
        total: total
    });
    saveOrders();
    renderOrders();
    
    // Clear cart
    cart = [];
    saveCart();
    renderCart();
    updateBadges();
    
    // Open WhatsApp
    window.open(`https://wa.me/60179081447?text=${encodeURIComponent(msg)}`, '_blank');
    toast('Order placed! Redirecting to WhatsApp...');
    
    // Switch to orders tab
    switchTab('orders');
}

// ===== TAB SWITCHING =====

function switchTab(tabId) {
    currentTab = tabId;
    
    // Update tab buttons
    document.querySelectorAll('.ios-tabs button').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const target = document.getElementById(`page${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    if (target) target.classList.add('active');
    
    // Render content based on tab
    switch (tabId) {
        case 'home':
            renderHome();
            break;
        case 'menu':
            renderMenu();
            break;
        case 'cart':
            renderCart();
            break;
        case 'orders':
            renderOrders();
            break;
        case 'profile':
            renderProfile();
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== INIT =====

document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadCart();
    loadOrders();
    
    // Tab click events
    document.querySelectorAll('.ios-tabs button').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Header cart button
    document.getElementById('headerCartBtn').addEventListener('click', function() {
        switchTab('cart');
    });
    
    // Modal overlay click
    document.getElementById('iosModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Modal quantity controls
    document.getElementById('modalQtyMinus').addEventListener('click', function() {
        let v = parseInt(document.getElementById('modalQty').value) || 1;
        if (v > 1) v--;
        document.getElementById('modalQty').value = v;
        if (modalData) updateModalWaLink(modalData);
    });
    
    document.getElementById('modalQtyPlus').addEventListener('click', function() {
        let v = parseInt(document.getElementById('modalQty').value) || 1;
        v++;
        document.getElementById('modalQty').value = v;
        if (modalData) updateModalWaLink(modalData);
    });
    
    document.getElementById('modalQty').addEventListener('change', function() {
        let v = parseInt(this.value) || 1;
        if (v < 1) v = 1;
        this.value = v;
        if (modalData) updateModalWaLink(modalData);
    });
    
    document.getElementById('modalRequest').addEventListener('input', function() {
        if (modalData) updateModalWaLink(modalData);
    });
    
    document.getElementById('modalAddCart').addEventListener('click', addFromModal);
    
    // Keyboard escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen) closeModal();
    });
    
    // Swipe to close modal (iOS style)
    let startY = 0;
    let isDragging = false;
    const sheet = document.querySelector('.modal-sheet');
    
    if (sheet) {
        sheet.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });
        
        sheet.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            const dy = e.touches[0].clientY - startY;
            if (dy > 60) {
                closeModal();
                isDragging = false;
            }
        }, { passive: true });
        
        sheet.addEventListener('touchend', function() {
            isDragging = false;
        }, { passive: true });
    }
    
    // Start with home
    switchTab('home');
    
    // Log
    console.log('🍗 iOS Interface loaded');
    console.log(`📦 ${getCartItemCount()} items in cart`);
    console.log(`📋 ${orders.length} orders saved`);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ Service Worker registered successfully');
            })
            .catch(function(err) {
                console.log('❌ Service Worker registration failed:', err);
            });
    });
}
