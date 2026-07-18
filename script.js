/* ============================================================
   MAIN SCRIPT - Landing Page with Full Menu
   Restoran Pak Haji Ali & Muiz Hot Chicken - Subang Jaya (USJ 8)
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    // THEME TOGGLE
    // ============================================================
    (function() {
        var saved = localStorage.getItem('muiz-theme') || 'light';
        var toggle = document.getElementById('themeToggle');
        var icon = document.getElementById('themeIcon');
        var color = document.getElementById('themeColor');

        function apply(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('muiz-theme', theme);
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            color.content = '#000000';
        }

        apply(saved);

        toggle.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            apply(current === 'light' ? 'dark' : 'light');
        });
    })();

    // ============================================================
// APP BANNER & MODAL (No localStorage persistence)
// ============================================================
(function() {
    var banner = document.getElementById('appBanner');
    var closeBtn = document.getElementById('appBannerClose');
    var launchBtn = document.getElementById('appBannerBtn');
    var modal = document.getElementById('appModal');
    var modalOverlay = document.getElementById('appModalOverlay');
    var modalClose = document.getElementById('appModalClose');

    // Close banner (hides only for current session)
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            banner.style.display = 'none';
        });
    }

    // Open modal on launch button click
    if (launchBtn) {
        launchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Save platform preference when user clicks a platform card
    document.querySelectorAll('.app-modal-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var platform = this.dataset.platform;
            if (platform) {
                localStorage.setItem('preferred-platform', platform);
            }
        });
    });
})();
    // ============================================================
    // RENDER FEATURED MENU (Top 8 Items)
    // ============================================================
    (function() {
        var grid = document.getElementById('featuredGrid');
        if (!grid || !window.MENU_DATA) return;

        var items = [];
        MENU_DATA.forEach(function(category) {
            category.items.forEach(function(item) {
                if (items.length < 8) {
                    items.push(item);
                }
            });
        });

        if (items.length === 0) return;

        grid.innerHTML = items.map(function(item) {
            return '<div class="featured-item" data-name="' + escapeHtml(item.name) + '" data-price="' + item.price + '" data-img="' + item.img + '" data-desc="' + escapeHtml(item.desc) + '">' +
                '<img src="' + item.img + '" alt="' + escapeHtml(item.name) + '" loading="lazy" />' +
                '<h4>' + escapeHtml(item.name) + '</h4>' +
                '<div class="price">RM' + item.price.toFixed(2) + '</div>' +
                '<button class="add-btn" onclick="addToCart(\'' + escapeHtml(item.name) + '\', ' + item.price + ', \'' + item.img + '\', \'' + escapeHtml(item.desc) + '\')">+ Add</button>' +
                '</div>';
        }).join('');

        grid.querySelectorAll('.featured-item').forEach(function(el) {
            el.addEventListener('click', function(e) {
                if (e.target.closest('.add-btn')) return;
                alert('🍗 ' + this.dataset.name + '\n' + this.dataset.desc + '\nPrice: RM' + parseFloat(this.dataset.price).toFixed(2));
            });
        });
    })();

    // ============================================================
    // RENDER FULL MENU (All Categories & Items)
    // ============================================================
    (function() {
        var grid = document.getElementById('fullMenuGrid');
        if (!grid || !window.MENU_DATA) return;

        var html = '';

        MENU_DATA.forEach(function(category) {
            html += '<div class="menu-category">';
            html += '<h3 class="menu-category-title">' + escapeHtml(category.category) + '</h3>';
            html += '<div class="menu-category-grid">';

            category.items.forEach(function(item) {
                html += '<div class="menu-category-item" data-name="' + escapeHtml(item.name) + '" data-price="' + item.price + '" data-img="' + item.img + '" data-desc="' + escapeHtml(item.desc) + '">';
                html += '<img src="' + item.img + '" alt="' + escapeHtml(item.name) + '" loading="lazy" />';
                html += '<div class="menu-item-info">';
                html += '<h4>' + escapeHtml(item.name) + '</h4>';
                html += '<p class="menu-item-desc">' + escapeHtml(item.desc) + '</p>';
                html += '<div class="menu-item-bottom">';
                html += '<span class="menu-item-price">RM' + item.price.toFixed(2) + '</span>';
                html += '<button class="add-btn-small" onclick="addToCart(\'' + escapeHtml(item.name) + '\', ' + item.price + ', \'' + item.img + '\', \'' + escapeHtml(item.desc) + '\')">+ Add</button>';
                html += '</div></div></div>';
            });

            html += '</div></div>';
        });

        grid.innerHTML = html;

        grid.querySelectorAll('.menu-category-item').forEach(function(el) {
            el.addEventListener('click', function(e) {
                if (e.target.closest('.add-btn-small')) return;
                alert('🍗 ' + this.dataset.name + '\n' + this.dataset.desc + '\nPrice: RM' + parseFloat(this.dataset.price).toFixed(2));
            });
        });
    })();

    // ============================================================
    // RENDER REVIEWS
    // ============================================================
    (function() {
        var grid = document.getElementById('reviewsGrid');
        if (!grid || !window.REVIEWS) return;

        grid.innerHTML = REVIEWS.map(function(r) {
            return '<div class="review-item">' +
                '<div class="avatar">' + escapeHtml(r.name.charAt(0)) + '</div>' +
                '<div class="name">' + escapeHtml(r.name) + '</div>' +
                '<div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>' +
                '<div class="text">"' + escapeHtml(r.text) + '"</div>' +
                '</div>';
        }).join('');
    })();

    // ============================================================
    // CART FUNCTION (Simple version for landing page)
    // ============================================================
    window.addToCart = function(name, price, img, desc) {
        alert('🍗 Added to cart: ' + name + '\nPrice: RM' + price.toFixed(2) + '\n\n💡 Tip: Use the App Interface for full cart management!');
    };

    // ============================================================
    // HELPERS
    // ============================================================
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ============================================================
    // SERVICE WORKER
    // ============================================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(function(reg) {
                    console.log('✅ Service Worker registered');
                })
                .catch(function(err) {
                    console.log('❌ Service Worker registration failed:', err);
                });
        });
    }

    console.log('🍗 Main landing page loaded');
})();
