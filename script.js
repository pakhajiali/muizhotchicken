/* ============================================================
   iOS-STYLE LANDING SCRIPT (Fallback to iOS)
   MODIFIED: Does NOT override hardcoded menu/reviews
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    // THEME TOGGLE
    // ============================================================
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

    // ============================================================
    // APP BANNER & MODAL
    // ============================================================
    var launchBtn = document.getElementById('appBannerBtn');
    var modal = document.getElementById('appModal');
    var overlay = document.getElementById('appModalOverlay');
    var closeBtn = document.getElementById('appModalClose');

    launchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
   // ===== ACTIVE LANGUAGE LINK =====
(function() {
    var links = document.querySelectorAll('.lang-link');
    var currentPath = window.location.pathname;
    var currentLang = 'en';
    if (currentPath.startsWith('/ms/')) currentLang = 'ms';
    else if (currentPath.startsWith('/zh/')) currentLang = 'zh';
    // Juga jika path root atau /index.html -> en

    links.forEach(function(link) {
        var lang = link.dataset.lang;
        if (lang === currentLang) {
            link.classList.add('active');
        }
        // Pastikan pautan ke root berfungsi untuk en
        if (lang === 'en' && (currentPath === '/' || currentPath === '/index.html' || currentPath === '')) {
            link.classList.add('active');
        }
    });
})();

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

    // ============================================================
    // RENDER FEATURED MENU (ONLY IF EMPTY)
    // ============================================================
    var featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid && window.MENU_DATA && featuredGrid.children.length === 0) {
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

    // ============================================================
    // RENDER FULL MENU (ONLY IF EMPTY)
    // ============================================================
    var fullGrid = document.getElementById('fullMenuGrid');
    if (fullGrid && window.MENU_DATA && fullGrid.children.length === 0) {
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

    // ============================================================
    // RENDER REVIEWS (ONLY IF EMPTY)
    // ============================================================
    var reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid && window.REVIEWS && reviewsGrid.children.length === 0) {
        reviewsGrid.innerHTML = REVIEWS.map(function(r) {
            return '<div class="review-item">' +
                '<div class="avatar">' + escapeHtml(r.name.charAt(0)) + '</div>' +
                '<div class="name">' + escapeHtml(r.name) + '</div>' +
                '<div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>' +
                '<div class="text">"' + escapeHtml(r.text) + '"</div>' +
                '</div>';
        }).join('');
    }

    // ============================================================
    // ITEM DETAIL MODAL WITH FALLBACK TO iOS
    // ============================================================
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

        // ----- DETECT PLATFORM (with fallback to iOS) -----
        var currentPath = window.location.pathname;
        var platform = 'ios'; // DEFAULT FALLBACK to iOS

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
            // else: platform stays 'ios' (fallback)
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

    // ============================================================
    // FEATURED MESSAGE - Uses External MESSAGES from messages.js
    // Refreshes on every page load for maximum SEO freshness
    // ============================================================
    (function() {
        var container = document.getElementById('featuredMessageContent');
        if (!container) return;

        // Check if MESSAGES is available (loaded from messages.js)
        if (typeof MESSAGES === 'undefined') {
            console.warn('⚠️ MESSAGES not loaded. Using fallback empty array.');
            container.innerHTML = '<span class="msg-text">Welcome to Restoran Pak Haji Ali & Muiz Hot Chicken</span>';
            return;
        }

        if (!MESSAGES || MESSAGES.length === 0) {
            container.innerHTML = '<span class="msg-text">Welcome to Restoran Pak Haji Ali & Muiz Hot Chicken</span>';
            return;
        }

        // ----- RANDOM MESSAGE (every refresh) -----
        var randomIndex = Math.floor(Math.random() * MESSAGES.length);
        var msg = MESSAGES[randomIndex];

        // Build the HTML
        var html = '';
        if (msg.icon) {
            html += '<span class="msg-icon">' + msg.icon + '</span>';
        }
        if (msg.text) {
            html += '<span class="msg-text">' + msg.text + '</span>';
        }
        if (msg.cta && msg.link) {
            var isExternal = msg.link.startsWith('http://') || msg.link.startsWith('https://');
            var target = isExternal ? 'target="_blank" rel="noopener"' : '';
            html += '<a href="' + msg.link + '" class="msg-cta" ' + target + '>' + msg.cta + ' <i class="fas fa-arrow-right"></i></a>';
        }

        container.innerHTML = html;

        // ----- BONUS: Update meta description randomly for SEO -----
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            var descKeywords = [
                'Best halal crispy Muiz Hot Chicken in Subang Jaya USJ 8. JAKIM Halal certified, Nasi Kandar, Tomyam & catering.',
                'Halal fried chicken in Subang Jaya – Muiz Hot Chicken, Nasi Kandar & Malaysian-Thai cuisine. Order now!',
                'Restoran Pak Haji Ali & Muiz Hot Chicken – halal food delivery in USJ 8, Klang Valley & Selangor.',
                'Crispy Muiz Hot Chicken, Nasi Kandar kuah banjir & Tomyam in Subang Jaya. JAKIM Halal certified.',
                'Best halal restaurant in USJ 8 – Muiz Hot Chicken, Nasi Kandar, Tomyam & student budget meals.',
                'Halal food delivery in Subang Jaya, KL, Shah Alam & Klang – Muiz Hot Chicken. Order now!',
                'JAKIM Halal certified crispy Muiz Hot Chicken in Subang Jaya. Nasi Kandar, Tomyam & catering.',
                '5★ halal restaurant in Subang Jaya – Muiz Hot Chicken, Nasi Kandar & Malaysian-Thai cuisine.'
            ];
            var descIndex = Math.floor(Math.random() * descKeywords.length);
            metaDesc.content = descKeywords[descIndex];
        }

        console.log('✅ Random SEO message loaded: ' + (randomIndex + 1) + ' of ' + MESSAGES.length);
    })();

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
                .then(function(reg) { console.log('✅ SW registered'); })
                .catch(function(err) { console.log('❌ SW failed:', err); });
        });
    }

    // ============================================================
    // FEATURED VIDEO - Hide Overlay After Autoplay Starts
    // ============================================================
    (function() {
        var overlay = document.getElementById('playOverlay');
        var wrapper = document.querySelector('.video-thumbnail-wrapper');

        if (overlay && wrapper) {
            // Hide overlay after 1.5 seconds (video autoplays muted)
            setTimeout(function() {
                wrapper.classList.add('loaded');
                overlay.style.display = 'none';
            }, 1500);

            // Also hide on click (user interaction)
            overlay.addEventListener('click', function() {
                wrapper.classList.add('loaded');
                overlay.style.display = 'none';
            });
        }
    })();

    // ============================================================
    // CUSTOMER VIDEO - Overlay (No Autoplay)
    // ============================================================
    (function() {
        var overlay2 = document.getElementById('playOverlay2');
        var wrapper2 = document.querySelector('.customer-video .video-thumbnail-wrapper');

        if (overlay2 && wrapper2) {
            // Only hide on click (user interaction)
            overlay2.addEventListener('click', function() {
                wrapper2.classList.add('loaded');
                overlay2.style.display = 'none';
                
                // Load the video with autoplay when clicked
                var iframe = wrapper2.querySelector('iframe');
                if (iframe) {
                    var src = iframe.src;
                    if (!src.includes('autoplay=1')) {
                        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                    }
                }
            });
        }
    })();

    console.log('🍗 iOS-style landing page loaded with external messages');
})();
