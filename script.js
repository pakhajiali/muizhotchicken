/* ============================================================
   iOS-STYLE LANDING SCRIPT (Fallback to iOS)
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
    // FEATURED MESSAGE - Daily Rotating (40+ Engaging Messages)
    // ============================================================
    (function() {
        var container = document.getElementById('featuredMessageContent');
        if (!container) return;

        // 40+ customer-friendly messages – one each day
        var messages = [
            // ---- CUSTOMER EXPERIENCE ----
            {
                icon: '🔥',
                text: 'Craving the <span class="highlight">crispiest fried chicken</span> in Subang Jaya? Our Muiz Hot Chicken is marinated 12 hours for perfection!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            {
                icon: '🍛',
                text: 'Want to taste <span class="highlight">authentic Nasi Kandar kuah banjir</span>? Our 15-spice recipe will blow your mind!',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            {
                icon: '🌟',
                text: 'Did you know? We\'re <span class="highlight">5★ rated on Google</span> – our customers can\'t stop coming back for more!',
                cta: 'See Reviews',
                link: '#reviewsGrid'
            },
            {
                icon: '🎯',
                text: 'Tired of boring food? Try our <span class="highlight">Korean Spicy Muiz Hot Chicken</span> – the perfect kick for spice lovers!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            {
                icon: '🏆',
                text: 'Part of the <span class="highlight">200+ branches nationwide</span> – bringing you the best halal fried chicken experience!',
                cta: 'Learn More',
                link: '#about'
            },
            {
                icon: '🎓',
                text: 'Students, we got you! <span class="highlight">Budget meals under RM15</span> – perfect for Taylor\'s, Sunway & Monash students.',
                cta: 'View Deals',
                link: '#fullMenu'
            },
            {
                icon: '🕐',
                text: 'Open <span class="highlight">9am–9pm daily</span> – come for breakfast, lunch, or dinner. We\'re always ready to serve you!',
                cta: 'Visit Us',
                link: '#map-section'
            },
            {
                icon: '🧀',
                text: 'Our <span class="highlight">Cheese Regular Box</span> is a fan favourite – 2 crispy chickens smothered in creamy cheese sauce!',
                cta: 'Try It',
                link: '#fullMenu'
            },
            {
                icon: '🤤',
                text: 'Can\'t decide? Get the <span class="highlight">Muiz Happy Box</span> – 5 pieces of crispy chicken perfect for sharing with family!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            // ---- VALUE PROPOSITIONS ----
            {
                icon: '🛡️',
                text: '100% <span class="highlight">JAKIM Halal certified</span> – you can trust every bite at Restoran Pak Haji Ali & Muiz Hot Chicken.',
                cta: 'Learn More',
                link: '#about'
            },
            {
                icon: '🚀',
                text: 'Fast <span class="highlight">halal delivery in Subang Jaya</span> – order now via WhatsApp or GrabFood and get your food hot!',
                cta: 'Order Now',
                link: 'https://wa.me/60179081447'
            },
            {
                icon: '🌶️',
                text: 'Love spicy food? Try our <span class="highlight">Tomyam Seafood</span> – the perfect balance of spicy, sour, and savoury!',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            {
                icon: '🎉',
                text: 'Planning an event? <span class="highlight">Halal catering available</span> – from corporate lunches to weddings, we\'ve got you covered!',
                cta: 'Contact Us',
                link: 'https://wa.me/60179081447'
            },
            {
                icon: '💰',
                text: 'Best value <span class="highlight">halal food in USJ 8</span> – affordable prices without compromising on taste or quality!',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            {
                icon: '👨‍🍳',
                text: 'Our chickens are <span class="highlight">marinated for 12 hours</span> with 12 secret herbs and spices – that\'s the Muiz magic!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            // ---- CONVENIENCE ----
            {
                icon: '📱',
                text: 'Download our <span class="highlight">iOS & Android app</span> for faster ordering and exclusive deals!',
                cta: 'Launch App',
                link: '#app-modal'
            },
            {
                icon: '📍',
                text: 'Find us at <span class="highlight">Goodyear Court 6, USJ 8</span> – easy parking and a cozy atmosphere waiting for you!',
                cta: 'Get Directions',
                link: '#map-section'
            },
            {
                icon: '🍽️',
                text: 'From <span class="highlight">Nasi Goreng Kampung to Tomyam Seafood</span> – there\'s something for everyone on our menu!',
                cta: 'Explore Menu',
                link: '#fullMenu'
            },
            // ---- TRUST & QUALITY ----
            {
                icon: '✅',
                text: '<span class="highlight">MeSTI certified</span> – we follow strict food safety standards so you can dine with confidence.',
                cta: 'Learn More',
                link: '#about'
            },
            {
                icon: '⭐',
                text: 'Our customers say it best – <span class="highlight">5★ Google rating</span> and hundreds of happy diners!',
                cta: 'Read Reviews',
                link: '#reviewsGrid'
            },
            {
                icon: '🕌',
                text: '100% <span class="highlight">Muslim-owned and operated</span> – serving authentic halal Malaysian cuisine with pride.',
                cta: 'About Us',
                link: '#about'
            },
            // ---- FOOD HIGHLIGHTS ----
            {
                icon: '🍗',
                text: 'Bite into <span class="highlight">crispy, juicy Muiz Hot Chicken</span> – the crunch you\'ve been craving is right here!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            {
                icon: '🥘',
                text: 'Our <span class="highlight">Nasi Kandar kuah banjir</span> is legendary – come taste why customers drive from all over Klang Valley!',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            {
                icon: '🍤',
                text: 'Seafood lovers, rejoice! Our <span class="highlight">Tomyam Seafood</span> is packed with prawns, squid, and authentic Thai flavours.',
                cta: 'Try It',
                link: '#fullMenu'
            },
            // ---- PROMOTIONS ----
            {
                icon: '🎁',
                text: 'Bring your friends and <span class="highlight">enjoy our Muiz Happy Box</span> – the perfect shareable meal for family and friends!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            {
                icon: '🔥',
                text: 'Feeling adventurous? Try our <span class="highlight">Chicken Tenders</span> with Mala, Peri-Peri, Thai Lime, or Charcoal flavours!',
                cta: 'Explore',
                link: '#fullMenu'
            },
            {
                icon: '🍚',
                text: 'Classic comfort food – <span class="highlight">Nasi Goreng Kampung</span> with your choice of chicken, beef, or seafood. Simple and delicious!',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            // ---- COMMUNITY ----
            {
                icon: '👥',
                text: 'Join thousands of satisfied customers – <span class="highlight">best halal chicken in Subang Jaya</span> is just a click away!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            {
                icon: '💬',
                text: 'Have a special request? We\'ll make it happen – <span class="highlight">customize your order</span> and enjoy your perfect meal!',
                cta: 'Contact Us',
                link: 'https://wa.me/60179081447'
            },
            {
                icon: '🏠',
                text: 'Dine-in or takeaway – <span class="highlight">we\'re your neighbourhood halal restaurant</span> in USJ 8, ready to serve you!',
                cta: 'Visit Us',
                link: '#map-section'
            },
            {
                icon: '🌿',
                text: 'Looking for <span class="highlight">vegetarian options</span>? We\'ve got delicious vegetable dishes, soups, and sides for you!',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            // ---- SPICY/EXCITING ----
            {
                icon: '🌶️',
                text: 'Think you can handle the spice? Our <span class="highlight">Korean Spicy Happy Box</span> will put your taste buds to the test!',
                cta: 'Challenge Accepted',
                link: '#fullMenu'
            },
            {
                icon: '🍗',
                text: 'Crispy on the outside, juicy on the inside – that\'s our <span class="highlight">signature Muiz Hot Chicken</span>. Get yours today!',
                cta: 'Order Now',
                link: '#fullMenu'
            },
            // ---- CONVENIENCE BOOST ----
            {
                icon: '⚡',
                text: 'Get your <span class="highlight">halal chicken delivered fast</span> – we\'re on GrabFood, Foodpanda, ShopeeFood, and Misirakyat!',
                cta: 'Order Now',
                link: 'https://wa.me/60179081447'
            },
            {
                icon: '💳',
                text: 'We accept <span class="highlight">all payment methods</span> – cash, credit card, debit card, GrabPay, and Touch \'n Go!',
                cta: 'Learn More',
                link: '#about'
            },
            // ---- EMOTIONAL CONNECTION ----
            {
                icon: '❤️',
                text: 'Made with <span class="highlight">love and halal ingredients</span> – every dish is prepared fresh, just for you.',
                cta: 'View Menu',
                link: '#fullMenu'
            },
            {
                icon: '😋',
                text: 'Still hungry? Browse our <span class="highlight">full menu</span> and find your new favourite dish!',
                cta: 'Explore Menu',
                link: '#fullMenu'
            }
        ];

        // Get today's message (based on day of year so it changes daily)
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
        var dayOfYear = Math.floor(diff / 86400000);
        var index = dayOfYear % messages.length;
        var msg = messages[index];

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

        console.log('✅ Featured message loaded: Day ' + (dayOfYear + 1) + ' of ' + messages.length);
    })();

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
