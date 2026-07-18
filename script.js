/* ============================================================
   iOS-STYLE LANDING SCRIPT (Fallback to iOS)
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
    // RENDER FEATURED MENU (first 8)
    // ============================================================
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

    // ============================================================
    // RENDER FULL MENU (all categories)
    // ============================================================
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

    // ============================================================
    // RENDER REVIEWS
    // ============================================================
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
    // FEATURED MESSAGE - RANDOM HIGH SEO (100+ Messages)
    // Refreshes on every page load for maximum SEO freshness
    // ============================================================
    (function() {
        var container = document.getElementById('featuredMessageContent');
        if (!container) return;

        // 100+ SEO-optimized messages – one random on each page load
        var messages = [
            // ---- BRAND + LOCATION (HIGH SEO) ----
            { icon: '📍', text: 'Restoran Pak Haji Ali & Muiz Hot Chicken – <strong>Subang Jaya (USJ 8)</strong> – JAKIM Halal certified crispy fried chicken since 2026.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: 'The <strong>best Muiz Hot Chicken in Subang Jaya</strong> – crispy, juicy, and halal. Visit us at Goodyear Court 6, USJ 8.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🌶️', text: 'Authentic <strong>Nasi Kandar kuah banjir</strong> with a 15-spice blend – only at Restoran Pak Haji Ali & Muiz Hot Chicken in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🕌', text: '<strong>JAKIM Halal certified</strong> and MeSTI compliant – enjoy premium halal food in Subang Jaya at Restoran Pak Haji Ali.', cta: 'Learn More', link: '#about' },
            { icon: '🏆', text: '<strong>5★ rated on Google</strong> – customers love our crispy Muiz Hot Chicken and authentic Malaysian-Thai cuisine in USJ 8.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '📍', text: 'Craving the <strong>best crispy fried chicken in Subang Jaya</strong>? Muiz Hot Chicken is here – halal, juicy, and delivered hot!', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Muiz Hot Chicken USJ 8</strong> – the crispiest, juiciest halal chicken in Subang Jaya. Dine-in, takeaway, or delivery.', cta: 'View Menu', link: '#fullMenu' },
            // ---- DELIVERY AREAS (LOCAL SEO) ----
            { icon: '🛵', text: '<strong>Halal food delivery in Subang Jaya</strong> – Muiz Hot Chicken delivered to USJ 1-27, Taipan, SS12-19 & Sunway.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏙️', text: 'Best <strong>halal crispy chicken in Subang Jaya</strong> – delivered to Taipan, Subang Permai, SS15 & surrounding areas.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🌆', text: '<strong>Halal food delivery in Shah Alam</strong> – Muiz Hot Chicken delivered to Seksyen 1-32, Setia Alam & Kota Kemuning.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏗️', text: '<strong>Halal fried chicken in Klang Valley</strong> – serving KLCC, Bangsar, Damansara, Mont Kiara & Cheras.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🏙️', text: '<strong>Halal restaurant in Petaling Jaya</strong> – Muiz Hot Chicken, Nasi Kandar & Tomyam delivered to SS1-26, Damansara & Kelana Jaya.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🌇', text: '<strong>Best halal fried chicken in Klang</strong> – delivered to Bandar Klang, Bukit Tinggi & Klang Utama.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🏛️', text: '<strong>Halal food in Kuala Lumpur</strong> – Muiz Hot Chicken delivered to KLCC, Bukit Bintang & all KL areas.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🛵', text: '<strong>Halal delivery in Puchong</strong> – Muiz Hot Chicken delivered to Puchong Jaya, Bandar Puchong & Puchong Prima.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🚗', text: '<strong>Halal food in Cyberjaya</strong> – Muiz Hot Chicken, Nasi Kandar & Tomyam delivered to Cyberjaya & Putrajaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🏠', text: '<strong>Halal delivery in Sungai Buloh</strong> – Muiz Hot Chicken delivered to Bandar Baru Sungai Buloh & Bukit Rahman Putra.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏘️', text: '<strong>Halal food in Ampang</strong> – Muiz Hot Chicken delivered to Ampang Jaya, Pandan Indah & Taman Cahaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🏡', text: '<strong>Halal restaurant in Kajang</strong> – Muiz Hot Chicken delivered to Kajang Utama, Taman Kajang & Saujana Impian.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            // ---- STUDENT & UNIVERSITY SEO ----
            { icon: '🎓', text: '<strong>Student budget meals under RM15</strong> – Taylor\'s University students love our Nasi Kandar with Muiz Hot Chicken.', cta: 'View Deals', link: '#fullMenu' },
            { icon: '🎓', text: '<strong>Halal food near Sunway University</strong> – affordable student meals delivered to Sunway University campus.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '📚', text: '<strong>Monash University halal food</strong> – budget meals under RM15 delivered to Monash Malaysia campus.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🎓', text: '<strong>INTI College students</strong> – get your favourite Muiz Hot Chicken delivered to INTI Subang Jaya.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏫', text: '<strong>Best halal food near Taylor\'s Lakeside</strong> – Nasi Kandar, Muiz Hot Chicken & Tomyam delivered to Taylor\'s.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '📖', text: '<strong>Affordable halal meals for students</strong> – RM10-15 meals at Restoran Pak Haji Ali, Subang Jaya USJ 8.', cta: 'View Deals', link: '#fullMenu' },
            { icon: '🎒', text: '<strong>Student lunch specials</strong> – budget-friendly halal food near Sunway, Taylor\'s, Monash & INTI.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            // ---- MENU & FOOD SEO ----
            { icon: '🧀', text: '<strong>Muiz Hot Chicken Cheese Box</strong> – 2 pieces with creamy cheese sauce. Best halal fried chicken in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🌶️', text: '<strong>Korean Spicy Muiz Hot Chicken</strong> – crispy chicken with Korean spicy sauce. A customer favourite in USJ 8.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🎁', text: '<strong>Muiz Happy Box</strong> – 5 pieces of crispy Muiz Hot Chicken. Perfect for family gatherings in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Kandar kuah banjir</strong> – authentic northern-style nasi kandar with 15-spice blend. Best in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍤', text: '<strong>Tomyam Seafood</strong> – spicy and sour tomyam with prawns and squid. Premium halal Thai food in USJ 8.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🍚', text: '<strong>Nasi Goreng Kampung</strong> – classic village-style fried rice with chicken, beef, or seafood. Halal and delicious.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Nasi Ayam Muiz Chicken</strong> – aromatic chicken rice with tender Muiz-style fried chicken. Best in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🥘', text: '<strong>Nasi Penyet Muiz</strong> – smashed chicken with sambal. Authentic Indonesian halal food in USJ 8.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍜', text: '<strong>Mee Pak Haji Ali</strong> – traditional recipe noodles with special house blend. Halal and flavourful.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Bujang</strong> – white rice with omelette, soup, and sambal. Simple, affordable, and halal.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍲', text: '<strong>Sup Ayam & Sup Daging</strong> – hearty chicken and beef soups. Perfect for a comforting halal meal.', cta: 'View Menu', link: '#fullMenu' },
            // ---- CATERING SEO ----
            { icon: '🎉', text: '<strong>Halal catering Subang Jaya</strong> – corporate events, weddings, and student society catering. Call +6017-908 1447.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '💼', text: '<strong>Corporate halal catering</strong> – office lunch delivery in Selangor & KL. Muiz Hot Chicken, Nasi Kandar & Tomyam.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Halal wedding catering</strong> – premium Muiz Hot Chicken and Nasi Kandar spread for your special day in Selangor.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎊', text: '<strong>Student society catering</strong> – affordable halal catering from RM10/pax. Perfect for university events.', cta: 'View Packages', link: 'https://wa.me/60179081447' },
            { icon: '🎂', text: '<strong>Family gathering catering</strong> – Muiz Happy Box and Nasi Kandar platters for birthday parties and reunions.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏢', text: '<strong>Office lunch catering</strong> – halal food delivered to your office in KL, PJ, Shah Alam & Subang Jaya.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎈', text: '<strong>Birthday party catering</strong> – halal food for kids and adults. Muiz Happy Box is a crowd favourite!', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            // ---- BRAND TRUST SEO ----
            { icon: '✅', text: '<strong>200+ branches nationwide</strong> – part of Malaysia\'s trusted Muiz Hot Chicken family. Serving Subang Jaya since 2026.', cta: 'Learn More', link: '#about' },
            { icon: '🛡️', text: '<strong>MeSTI certified</strong> – food safety guaranteed by the Ministry of Health Malaysia. Dine with confidence in USJ 8.', cta: 'About Us', link: '#about' },
            { icon: '⭐', text: '<strong>5★ rated on Google</strong> – our customers love the crispy chicken, friendly service, and fast delivery in Subang Jaya.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '🕌', text: '<strong>100% Muslim-owned</strong> – serving authentic halal Malaysian cuisine with pride in Subang Jaya USJ 8.', cta: 'About Us', link: '#about' },
            { icon: '🌟', text: '<strong>Customer favourite in USJ 8</strong> – 5★ Google rating for our crispy Muiz Hot Chicken and Nasi Kandar.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '🏅', text: '<strong>Trusted halal brand</strong> – part of the Muiz Hot Chicken family with 200+ branches across Malaysia.', cta: 'Learn More', link: '#about' },
            // ---- SERVICE FEATURES SEO ----
            { icon: '📱', text: '<strong>Download our app</strong> – order Muiz Hot Chicken faster on iOS and Android. Exclusive deals available.', cta: 'Launch App', link: '#app-modal' },
            { icon: '💳', text: '<strong>All payments accepted</strong> – cash, credit card, debit card, GrabPay, and Touch \'n Go at Restoran Pak Haji Ali.', cta: 'Learn More', link: '#about' },
            { icon: '🕐', text: '<strong>Open 9am–9pm daily</strong> – breakfast, lunch, and dinner at our USJ 8 outlet. Visit us for the best halal food.', cta: 'Visit Us', link: '#map-section' },
            { icon: '📞', text: '<strong>Order halal food now</strong> – call or WhatsApp +6017-908 1447 for delivery in Subang Jaya and KL.', cta: 'Call Now', link: 'https://wa.me/60179081447' },
            { icon: '📍', text: '<strong>Visit us at Goodyear Court 6, USJ 8</strong> – the best halal restaurant in Subang Jaya. Easy parking available.', cta: 'Get Directions', link: '#map-section' },
            // ---- SPECIALTY SEO ----
            { icon: '🔥', text: '<strong>Muiz Hot Chicken delivery</strong> – get the best crispy fried chicken in Subang Jaya delivered to your door.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🌶️', text: '<strong>Spicy halal chicken</strong> – Korean Spicy Muiz Hot Chicken is a must-try for spice lovers in USJ 8.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🧀', text: '<strong>Cheese chicken box</strong> – Muiz Hot Chicken with cheese sauce. A customer favourite in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🥗', text: '<strong>Vegetarian options available</strong> – delicious vegetable dishes, soups, and sides at our halal restaurant in USJ 8.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Best halal fried chicken in Subang Jaya</strong> – crispy, juicy, and JAKIM Halal certified. Order now!', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Best Nasi Kandar in USJ 8</strong> – authentic kuah banjir with 15-spice recipe. Must-try halal food!', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🥘', text: '<strong>Best Tomyam in Subang Jaya</strong> – spicy seafood tomyam with prawns and squid. Premium halal Thai cuisine.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🔥', text: '<strong>Halal crispy chicken delivery</strong> – Muiz Hot Chicken delivered to Subang Jaya, KL, Shah Alam & Klang.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏆', text: '<strong>Top-rated halal restaurant in Subang Jaya</strong> – 5★ Google rating for food quality and service.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '🎯', text: '<strong>Student budget meals</strong> – halal food under RM15 for Taylor\'s, Sunway, Monash & INTI students.', cta: 'View Deals', link: '#fullMenu' },
            { icon: '🌿', text: '<strong>Halal vegetarian food in Subang Jaya</strong> – we offer delicious vegetarian options. JAKIM Halal certified.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Crispy Muiz Hot Chicken with cheese sauce</strong> – the ultimate halal comfort food in USJ 8, Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Kandar with Muiz Hot Chicken</strong> – authentic kuah banjir and crispy chicken. Best halal food in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' },
            // ---- PROMOTIONAL ----
            { icon: '🎁', text: '<strong>First order discount</strong> – get a special offer on your first order via WhatsApp. DM us now!', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🔥', text: '<strong>Follow us on Instagram & TikTok</strong> – exclusive deals and daily specials from Muiz Hot Chicken.', cta: 'Follow Now', link: 'https://www.instagram.com/muizhotchicken/' },
            { icon: '🎯', text: '<strong>Refer a friend and get RM5 off</strong> – share the love of Muiz Hot Chicken with your friends and family.', cta: 'Refer Now', link: 'https://wa.me/60179081447' },
            { icon: '🏅', text: '<strong>100% Muslim-owned halal restaurant</strong> – serving authentic Malaysian cuisine with pride in Subang Jaya.', cta: 'About Us', link: '#about' },
            // ---- ULTRA SEO KEYWORD BOMB ----
            { icon: '📍', text: 'Restoran Pak Haji Ali & Muiz Hot Chicken – <strong>Subang Jaya USJ 8</strong> – halal crispy chicken, Nasi Kandar, Tomyam, and more!', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Muiz Hot Chicken</strong> – the crispiest halal fried chicken in Subang Jaya. JAKIM Halal certified since 2026.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🌶️', text: '<strong>Authentic Nasi Kandar</strong> and <strong>Muiz Hot Chicken</strong> – the best halal food combo in USJ 8.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🕌', text: '<strong>JAKIM Halal</strong> and <strong>MeSTI certified</strong> – your trusted halal restaurant in Subang Jaya.', cta: 'Learn More', link: '#about' },
            { icon: '⭐', text: '<strong>5★ halal restaurant in Subang Jaya</strong> – crispy Muiz Hot Chicken, Nasi Kandar & Tomyam. Order now!', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🛵', text: '<strong>Halal food delivery</strong> – Muiz Hot Chicken delivered to Subang Jaya, KL, Shah Alam, PJ, and Klang.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🎓', text: '<strong>Student budget meals under RM15</strong> – halal food near Taylor\'s, Sunway, Monash & INTI.', cta: 'View Deals', link: '#fullMenu' },
            { icon: '🎉', text: '<strong>Halal catering</strong> – corporate, wedding, and student event catering in Selangor & KL. Call +6017-908 1447.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🧀', text: '<strong>Cheese Muiz Hot Chicken</strong> – crispy chicken with creamy cheese sauce. Best halal comfort food in USJ 8.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🌶️', text: '<strong>Korean Spicy Muiz Hot Chicken</strong> – spicy, crispy, and halal. A must-try in Subang Jaya!', cta: 'Try It', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Kandar kuah banjir</strong> – authentic 15-spice recipe. The best halal Nasi Kandar in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍤', text: '<strong>Tomyam Seafood</strong> – spicy Thai tomyam with prawns and squid. Premium halal seafood in USJ 8.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🍚', text: '<strong>Nasi Goreng Kampung</strong> – classic halal fried rice with your choice of chicken, beef, or seafood.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Nasi Ayam Muiz Chicken</strong> – aromatic chicken rice with crispy Muiz-style fried chicken. Halal and delicious.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🥘', text: '<strong>Nasi Penyet</strong> – smashed chicken or beef with sambal. Authentic Indonesian halal food in USJ 8.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍜', text: '<strong>Mee Pak Haji Ali</strong> – traditional halal noodles with a special house blend recipe.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Bujang</strong> – affordable halal meal with rice, omelette, soup, and sambal. Under RM5!', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍲', text: '<strong>Sup Ayam & Sup Daging</strong> – hearty chicken and beef soups. Perfect for a comforting halal meal.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🏙️', text: '<strong>Best halal restaurant in USJ 8</strong> – Muiz Hot Chicken, Nasi Kandar, Tomyam & more. Visit us today!', cta: 'Visit Us', link: '#map-section' },
            { icon: '📍', text: '<strong>Restoran Pak Haji Ali & Muiz Hot Chicken</strong> – Goodyear Court 6, USJ 8. The best halal food in Subang Jaya.', cta: 'Get Directions', link: '#map-section' },
            { icon: '📱', text: '<strong>Order halal food online</strong> – Muiz Hot Chicken delivery via WhatsApp, GrabFood, Foodpanda & ShopeeFood.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '💳', text: '<strong>All payment methods accepted</strong> – cash, card, GrabPay, and Touch \'n Go at Restoran Pak Haji Ali.', cta: 'Learn More', link: '#about' },
            { icon: '🕐', text: '<strong>Open 9am–9pm daily</strong> – breakfast, lunch, and dinner at our halal restaurant in Subang Jaya USJ 8.', cta: 'Visit Us', link: '#map-section' },
            { icon: '🏆', text: '<strong>Top-rated halal restaurant</strong> – 5★ Google rating for Muiz Hot Chicken and Nasi Kandar in Subang Jaya.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '🌟', text: '<strong>Join thousands of happy customers</strong> – the best halal crispy chicken in Subang Jaya is just a click away.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🎯', text: '<strong>Craving crispy chicken?</strong> Get Muiz Hot Chicken delivered to your doorstep in Subang Jaya, KL & Selangor.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '❤️', text: '<strong>Made with love and halal ingredients</strong> – every dish at Restoran Pak Haji Ali is prepared fresh daily.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '😋', text: '<strong>Still hungry?</strong> Explore our full menu of halal Malaysian, Thai, and Nasi Kandar dishes in USJ 8.', cta: 'Explore Menu', link: '#fullMenu' }
        ];

        // ----- RANDOM MESSAGE (every refresh) -----
        var randomIndex = Math.floor(Math.random() * messages.length);
        var msg = messages[randomIndex];

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
                'Best halal crispy Muiz Hot Chicken in Subang Jaya USJ 8. JAKIM Halal certified, Nasi Kandar, Tomyam & delivery.',
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

        console.log('✅ Random SEO message loaded: ' + (randomIndex + 1) + ' of ' + messages.length);
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

    console.log('🍗 iOS-style landing page loaded with random SEO messages');
})();
