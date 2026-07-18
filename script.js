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
    // FEATURED MESSAGE - RANDOM HYPER SEO (100 Messages)
    // 50 Catering Messages + 50 General/Brand Messages
    // Refreshes on every page load for maximum SEO freshness
    // ============================================================
    (function() {
        var container = document.getElementById('featuredMessageContent');
        if (!container) return;

        // 100 SEO-optimized messages – one random on each page load
        var messages = [

            // ============================================================
            // 50 CATERING MESSAGES (HYPER LOCAL SEO)
            // ============================================================

            // ---- SUBANG JAYA CATERING ----
            { icon: '🎉', text: '<strong>Halal catering in Subang Jaya</strong> – Restoran Pak Haji Ali serves corporate events, weddings & student societies. Call +6017-908 1447.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '💼', text: '<strong>Corporate catering Subang Jaya</strong> – office lunch delivery for companies in USJ 8, Taipan & SS15. Muiz Hot Chicken & Nasi Kandar.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding catering Subang Jaya</strong> – premium halal wedding catering with Muiz Hot Chicken, Nasi Kandar & Tomyam. Contact us!', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎊', text: '<strong>Student society catering Subang Jaya</strong> – affordable halal catering from RM10/pax for Taylor\'s, Sunway & Monash events.', cta: 'View Packages', link: 'https://wa.me/60179081447' },
            { icon: '🎂', text: '<strong>Birthday catering Subang Jaya</strong> – Muiz Happy Box and Nasi Kandar platters for parties in USJ 8. Call +6017-908 1447.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- PETALING JAYA CATERING ----
            { icon: '🏢', text: '<strong>Corporate catering Petaling Jaya</strong> – halal office lunch delivery in SS1-26, Damansara & Kelana Jaya. Muiz Hot Chicken.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding catering Petaling Jaya</strong> – halal wedding food delivery in PJ. Muiz Hot Chicken, Nasi Kandar & Tomyam.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎉', text: '<strong>Event catering Petaling Jaya</strong> – halal catering for corporate functions, family days & gatherings in PJ.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- SHAH ALAM CATERING ----
            { icon: '🏢', text: '<strong>Corporate catering Shah Alam</strong> – halal office lunch delivery in Seksyen 1-32, Setia Alam & Kota Kemuning. Order now!', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding catering Shah Alam</strong> – halal wedding food delivery in Shah Alam. Premium Muiz Hot Chicken & Nasi Kandar.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎉', text: '<strong>Event catering Shah Alam</strong> – halal catering for corporate events, family gatherings & student events.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- KLANG CATERING ----
            { icon: '🏢', text: '<strong>Corporate catering Klang</strong> – halal office lunch delivery in Bandar Klang, Bukit Tinggi & Klang Utama. Muiz Hot Chicken.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding catering Klang</strong> – halal wedding food delivery in Klang. Premium catering with Muiz Hot Chicken.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎉', text: '<strong>Event catering Klang</strong> – halal catering for corporate functions, family days & gatherings in Klang.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- KUALA LUMPUR CATERING ----
            { icon: '🏛️', text: '<strong>Corporate catering Kuala Lumpur</strong> – halal office lunch delivery in KLCC, Bangsar, Damansara & Mont Kiara. Order now!', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding catering Kuala Lumpur</strong> – halal wedding food delivery in KL. Premium Muiz Hot Chicken & Nasi Kandar.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎉', text: '<strong>Event catering Kuala Lumpur</strong> – halal catering for corporate events, family gatherings & parties in KL.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- PUCHONG CATERING ----
            { icon: '🏢', text: '<strong>Corporate catering Puchong</strong> – halal office lunch delivery in Puchong Jaya, Bandar Puchong & Puchong Prima.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding catering Puchong</strong> – halal wedding food delivery in Puchong. Premium Muiz Hot Chicken & Nasi Kandar.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎉', text: '<strong>Event catering Puchong</strong> – halal catering for corporate events, family gatherings & student events.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- CYBERJAYA CATERING ----
            { icon: '🏢', text: '<strong>Corporate catering Cyberjaya</strong> – halal office lunch delivery in Cyberjaya & Putrajaya. Order now!', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎉', text: '<strong>Event catering Cyberjaya</strong> – halal catering for corporate events, family gatherings & student events.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- CATERING PACKAGES ----
            { icon: '🍗', text: '<strong>Muiz Hot Chicken catering package</strong> – crispy fried chicken for events in Subang Jaya, KL & Selangor. Call +6017-908 1447.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🍛', text: '<strong>Nasi Kandar catering package</strong> – authentic kuah banjir for weddings & corporate events in Selangor & KL.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🍤', text: '<strong>Tomyam catering package</strong> – spicy seafood tomyam for events in Subang Jaya, PJ, Shah Alam & KL.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🎁', text: '<strong>Muiz Happy Box catering</strong> – 5-piece crispy chicken boxes perfect for corporate events & parties. Call now!', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🥘', text: '<strong>Nasi Penyet catering</strong> – smashed chicken with sambal for events in Selangor & KL. Halal certified.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },

            // ---- CATERING FEATURES ----
            { icon: '✅', text: '<strong>Halal certified catering</strong> – all our catering is JAKIM Halal certified. Trusted for events in Subang Jaya & KL.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🛡️', text: '<strong>MeSTI certified catering</strong> – food safety guaranteed for your corporate events, weddings & family gatherings.', cta: 'Learn More', link: '#about' },
            { icon: '⭐', text: '<strong>5★ rated catering service</strong> – our customers love our halal catering for events in Selangor & KL.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '📍', text: '<strong>Catering in Subang Jaya USJ 8</strong> – we deliver halal catering to Goodyear Court 6, Taipan & SS15.', cta: 'Get Directions', link: '#map-section' },
            { icon: '🕌', text: '<strong>100% Muslim-owned catering</strong> – serving authentic halal Malaysian cuisine for events in Selangor & KL.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },

            // ---- CATERING SPECIALTIES ----
            { icon: '🎓', text: '<strong>Student society catering</strong> – affordable halal catering packages for university events in Subang Jaya & KL.', cta: 'View Packages', link: 'https://wa.me/60179081447' },
            { icon: '💼', text: '<strong>Office lunch catering</strong> – halal lunch delivery for corporate events in KL, PJ, Shah Alam & Subang Jaya.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '👰', text: '<strong>Wedding lunch & dinner catering</strong> – premium halal wedding catering with Muiz Hot Chicken & Nasi Kandar.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🎂', text: '<strong>Birthday party catering</strong> – halal food for kids and adults. Muiz Happy Box is a crowd favourite!', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏠', text: '<strong>Home gathering catering</strong> – halal food delivery for family reunions & home parties in Subang Jaya & KL.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- CATERING QUANTITY ----
            { icon: '📞', text: '<strong>Catering for 20-500 pax</strong> – we cater events of all sizes in Subang Jaya, KL, Shah Alam & Selangor.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '📋', text: '<strong>Custom halal catering menu</strong> – we create bespoke menus for weddings, corporate events & parties. Call now!', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🍗', text: '<strong>Muiz Hot Chicken bulk catering</strong> – order crispy fried chicken in bulk for events in Selangor & KL.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🍛', text: '<strong>Nasi Kandar buffet catering</strong> – authentic kuah banjir buffet for weddings & corporate events.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '🥘', text: '<strong>Malaysian-Thai fusion catering</strong> – Tomyam, Nasi Goreng & Muiz Hot Chicken for events in Selangor & KL.', cta: 'Order Now', link: 'https://wa.me/60179081447' },

            // ---- FAST CATERING ----
            { icon: '⚡', text: '<strong>Fast catering delivery</strong> – get halal food delivered to your event in Subang Jaya, KL & Selangor within hours.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🕐', text: '<strong>24-hour catering notice</strong> – we accept last-minute catering orders in Selangor & KL. Call +6017-908 1447.', cta: 'Contact Us', link: 'https://wa.me/60179081447' },
            { icon: '📍', text: '<strong>Goodyear Court 6 catering</strong> – we deliver halal catering to all events in USJ 8, Subang Jaya.', cta: 'Get Directions', link: '#map-section' },

            // ============================================================
            // 50 GENERAL BRAND + MENU MESSAGES
            // ============================================================

            // ---- BRAND ----
            { icon: '🍗', text: '<strong>Best Muiz Hot Chicken in Subang Jaya</strong> – crispy, juicy, and halal. Visit us at Goodyear Court 6, USJ 8.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '📍', text: 'Restoran Pak Haji Ali & Muiz Hot Chicken – <strong>Subang Jaya (USJ 8)</strong> – JAKIM Halal certified crispy fried chicken since 2026.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🌶️', text: 'Authentic <strong>Nasi Kandar kuah banjir</strong> with a 15-spice blend – only at Restoran Pak Haji Ali & Muiz Hot Chicken in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🕌', text: '<strong>JAKIM Halal certified</strong> – enjoy premium halal food in Subang Jaya at Restoran Pak Haji Ali & Muiz Hot Chicken.', cta: 'Learn More', link: '#about' },
            { icon: '⭐', text: '<strong>5★ rated on Google</strong> – customers love our crispy Muiz Hot Chicken and authentic Malaysian-Thai cuisine in USJ 8.', cta: 'Read Reviews', link: '#reviewsGrid' },

            // ---- DELIVERY AREAS ----
            { icon: '🛵', text: '<strong>Halal food delivery in Subang Jaya</strong> – Muiz Hot Chicken delivered to USJ 1-27, Taipan, SS12-19 & Sunway.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏙️', text: 'Best <strong>halal crispy chicken in Subang Jaya</strong> – delivered to Taipan, Subang Permai, SS15 & surrounding areas.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🌆', text: '<strong>Halal food delivery in Shah Alam</strong> – Muiz Hot Chicken delivered to Seksyen 1-32, Setia Alam & Kota Kemuning.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏛️', text: '<strong>Halal food in Kuala Lumpur</strong> – Muiz Hot Chicken delivered to KLCC, Bukit Bintang, Bangsar & all KL areas.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🌇', text: '<strong>Best halal fried chicken in Klang</strong> – delivered to Bandar Klang, Bukit Tinggi & Klang Utama.', cta: 'View Menu', link: '#fullMenu' },

            // ---- STUDENT MEALS ----
            { icon: '🎓', text: '<strong>Student budget meals under RM15</strong> – Taylor\'s University students love our Nasi Kandar with Muiz Hot Chicken.', cta: 'View Deals', link: '#fullMenu' },
            { icon: '🎓', text: '<strong>Halal food near Sunway University</strong> – affordable student meals delivered to Sunway University campus.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '📚', text: '<strong>Monash University halal food</strong> – budget meals under RM15 delivered to Monash Malaysia campus.', cta: 'View Menu', link: '#fullMenu' },

            // ---- MENU ITEMS ----
            { icon: '🧀', text: '<strong>Muiz Hot Chicken Cheese Box</strong> – 2 pieces with creamy cheese sauce. Best halal fried chicken in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🌶️', text: '<strong>Korean Spicy Muiz Hot Chicken</strong> – crispy chicken with Korean spicy sauce. A customer favourite in USJ 8.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🎁', text: '<strong>Muiz Happy Box</strong> – 5 pieces of crispy Muiz Hot Chicken. Perfect for family gatherings in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Kandar kuah banjir</strong> – authentic northern-style nasi kandar with 15-spice blend. Best in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍤', text: '<strong>Tomyam Seafood</strong> – spicy and sour tomyam with prawns and squid. Premium halal Thai food in USJ 8.', cta: 'Try It', link: '#fullMenu' },
            { icon: '🍚', text: '<strong>Nasi Goreng Kampung</strong> – classic village-style fried rice with chicken, beef, or seafood. Halal and delicious.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Nasi Ayam Muiz Chicken</strong> – aromatic chicken rice with tender Muiz-style fried chicken. Best in Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🥘', text: '<strong>Nasi Penyet Muiz</strong> – smashed chicken with sambal. Authentic Indonesian halal food in USJ 8.', cta: 'View Menu', link: '#fullMenu' },

            // ---- TRUST ----
            { icon: '✅', text: '<strong>200+ branches nationwide</strong> – part of Malaysia\'s trusted Muiz Hot Chicken family. Serving Subang Jaya since 2026.', cta: 'Learn More', link: '#about' },
            { icon: '🛡️', text: '<strong>MeSTI certified</strong> – food safety guaranteed by the Ministry of Health Malaysia. Dine with confidence in USJ 8.', cta: 'About Us', link: '#about' },
            { icon: '🕌', text: '<strong>100% Muslim-owned</strong> – serving authentic halal Malaysian cuisine with pride in Subang Jaya USJ 8.', cta: 'About Us', link: '#about' },

            // ---- CONVENIENCE ----
            { icon: '📱', text: '<strong>Download our app</strong> – order Muiz Hot Chicken faster on iOS and Android. Exclusive deals available.', cta: 'Launch App', link: '#app-modal' },
            { icon: '🕐', text: '<strong>Open 9am–9pm daily</strong> – breakfast, lunch, and dinner at our USJ 8 outlet. Visit us for the best halal food.', cta: 'Visit Us', link: '#map-section' },
            { icon: '📍', text: '<strong>Visit us at Goodyear Court 6, USJ 8</strong> – the best halal restaurant in Subang Jaya. Easy parking available.', cta: 'Get Directions', link: '#map-section' },
            { icon: '📞', text: '<strong>Order halal food now</strong> – call or WhatsApp +6017-908 1447 for delivery in Subang Jaya and KL.', cta: 'Call Now', link: 'https://wa.me/60179081447' },

            // ---- VEGETARIAN ----
            { icon: '🥗', text: '<strong>Vegetarian options available</strong> – delicious vegetable dishes, soups, and sides at our halal restaurant in USJ 8.', cta: 'View Menu', link: '#fullMenu' },

            // ---- SPECIALTY ----
            { icon: '🔥', text: '<strong>Halal crispy chicken delivery</strong> – Muiz Hot Chicken delivered to Subang Jaya, KL, Shah Alam & Klang.', cta: 'Order Now', link: 'https://wa.me/60179081447' },
            { icon: '🏆', text: '<strong>Top-rated halal restaurant in Subang Jaya</strong> – 5★ Google rating for food quality and service.', cta: 'Read Reviews', link: '#reviewsGrid' },
            { icon: '🌿', text: '<strong>Halal vegetarian food in Subang Jaya</strong> – we offer delicious vegetarian options. JAKIM Halal certified.', cta: 'View Menu', link: '#fullMenu' },
            { icon: '🍗', text: '<strong>Crispy Muiz Hot Chicken with cheese sauce</strong> – the ultimate halal comfort food in USJ 8, Subang Jaya.', cta: 'Order Now', link: '#fullMenu' },
            { icon: '🍛', text: '<strong>Nasi Kandar with Muiz Hot Chicken</strong> – authentic kuah banjir and crispy chicken. Best halal food in Subang Jaya.', cta: 'View Menu', link: '#fullMenu' }
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
