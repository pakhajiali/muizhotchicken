/* ============================================================
   iOS-STYLE LANDING SCRIPT
   ============================================================ */

(function() {
    'use strict';

    // ----- THEME TOGGLE -----
    var saved = localStorage.getItem('muiz-theme') || 'light';
    var toggle = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('muiz-theme', theme);
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    applyTheme(saved);
    toggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'light' ? 'dark' : 'light');
    });

    // ----- APP BANNER & MODAL -----
    var launchBtn = document.getElementById('appBannerBtn');
    var modal = document.getElementById('appModal');
    var overlay = document.getElementById('appModalOverlay');
    var closeBtn = document.getElementById('appModalClose');

    launchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Save platform preference when card clicked
    document.querySelectorAll('.app-modal-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var platform = this.dataset.platform;
            if (platform) localStorage.setItem('preferred-platform', platform);
        });
    });

    // ----- RENDER FEATURED MENU (first 8) -----
    var featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid && window.MENU_DATA) {
        var items = [];
        MENU_DATA.forEach(function(cat) {
            cat.items.forEach(function(item) {
                if (items.length < 8) items.push(item);
            });
        });
        if (items.length) {
            featuredGrid.innerHTML = items.map(function(item) {
                return '<div class="featured-item" data-name="' + escapeHtml(item.name) + '" data-price="' + item.price + '" data-img="' + item.img + '" data-desc="' + escapeHtml(item.desc) + '">' +
                    '<img src="' + item.img + '" alt="' + escapeHtml(item.name) + '" loading="lazy" />' +
                    '<h4>' + escapeHtml(item.name) + '</h4>' +
                    '<div class="price">RM' + item.price.toFixed(2) + '</div>' +
                    '<button class="add-btn" onclick="openItemModal(\'' + escapeHtml(item.name) + '\', ' + item.price + ', \'' + item.img + '\', \'' + escapeHtml(item.desc) + '\')">+ Add</button>' +
                    '</div>';
            }).join('');
            featuredGrid.querySelectorAll('.featured-item').forEach(function(el) {
                el.addEventListener('click', function(e) {
                    if (e.target.closest('.add-btn')) {
                        openItemModal(this.dataset.name, this.dataset.price, this.dataset.img, this.dataset.desc);
                        return;
                    }
                    openItemModal(this.dataset.name, this.dataset.price, this.dataset.img, this.dataset.desc);
                });
            });
        }
    }

    // ----- RENDER FULL MENU (all categories) -----
    var fullGrid = document.getElementById('fullMenuGrid');
    if (fullGrid && window.MENU_DATA) {
        var html = '';
        MENU_DATA.forEach(function(cat) {
            html += '<div class="menu-category"><h3 class="menu-category-title">' + escapeHtml(cat.category) + '</h3><div class="menu-category-grid">';
            cat.items.forEach(function(item) {
                html += '<div class="menu-category-item" data-name="' + escapeHtml(item.name) + '" data-price="' + item.price + '" data-img="' + item.img + '" data-desc="' + escapeHtml(item.desc) + '">' +
                    '<img src="' + item.img + '" alt="' + escapeHtml(item.name) + '" loading="lazy" />' +
                    '<h4>' + escapeHtml(item.name) + '</h4>' +
                    '<p class="menu-item-desc">' + escapeHtml(item.desc) + '</p>' +
                    '<div class="menu-item-bottom">' +
                    '<span class="menu-item-price">RM' + item.price.toFixed(2) + '</span>' +
                    '<button class="add-btn-small" onclick="openItemModal(\'' + escapeHtml(item.name) + '\', ' + item.price + ', \'' + item.img + '\', \'' + escapeHtml(item.desc) + '\')">+ Add</button>' +
                    '</div></div>';
            });
            html += '</div></div>';
        });
        fullGrid.innerHTML = html;
        fullGrid.querySelectorAll('.menu-category-item').forEach(function(el) {
            el.addEventListener('click', function(e) {
                if (e.target.closest('.add-btn-small')) {
                    openItemModal(this.dataset.name, this.dataset.price, this.dataset.img, this.dataset.desc);
                    return;
                }
                openItemModal(this.dataset.name, this.dataset.price, this.dataset.img, this.dataset.desc);
            });
        });
    }

    // ----- RENDER REVIEWS -----
    var reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid && window.REVIEWS) {
        reviewsGrid.innerHTML = REVIEWS.map(function(r) {
            return '<div class="review-item">' +
                '<div class="avatar">' + escapeHtml(r.name.charAt(0)) + '</div>' +
                '<div class="name">' + escapeHtml(r.name) + '</div>' +
                '<div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>' +
                '<div class="text">"' + escapeHtml(r.text) + '"</div>' +
                '</div>';
        }).join('');
    }

    // ----- ITEM DETAIL MODAL (Platform-Aware) -----
    var itemModal = document.getElementById('itemModal');
    var itemOverlay = document.getElementById('itemModalOverlay');
    var itemClose = document.getElementById('itemModalClose');
    var itemImg = document.getElementById('itemModalImg');
    var itemName = document.getElementById('itemModalName');
    var itemDesc = document.getElementById('itemModalDesc');
    var itemPrice = document.getElementById('itemModalPrice');
    var itemAppBtn = document.getElementById('itemModalAppBtn');

    window.openItemModal = function(name, price, img, desc) {
        itemImg.src = img || 'images/placeholder.webp';
        itemName.textContent = name;
        itemDesc.textContent = desc || '';
        itemPrice.textContent = 'RM' + parseFloat(price).toFixed(2);

        // ----- DETECT PLATFORM (Smart) -----
        var currentPath = window.location.pathname;
        var platform = 'web'; // default fallback

        // 1. Detect from URL path
        if (currentPath.includes('/ios/')) {
            platform = 'ios';
        } else if (currentPath.includes('/android/')) {
            platform = 'android';
        } else if (currentPath.includes('/web/')) {
            platform = 'web';
        } else {
            // 2. If on landing page, check localStorage for preferred platform
            var pref = localStorage.getItem('preferred-platform');
            if (pref && ['ios', 'android', 'web'].indexOf(pref) !== -1) {
                platform = pref;
            }
        }

        // 3. Build the app link with the detected platform
        var base = currentPath.includes('/muizhotchicken/') ? '/muizhotchicken/' : '/';
        itemAppBtn.href = base + platform + '/#menu';

        // Open modal
        itemModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    function closeItemModal() {
        itemModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    itemOverlay.addEventListener('click', closeItemModal);
    itemClose.addEventListener('click', closeItemModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeItemModal();
    });

    // ----- HELPERS -----
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ----- SERVICE WORKER -----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(function(reg) { console.log('✅ SW registered'); })
                .catch(function(err) { console.log('❌ SW failed:', err); });
        });
    }

    console.log('🍗 iOS-style landing page loaded');
})();
