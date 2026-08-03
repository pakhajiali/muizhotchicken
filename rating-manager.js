// ============================================================
// RATING MANAGER v1.0 (Extended)
// Centralized dynamic aggregate rating for Muiz Hot Chicken
// ============================================================
(function() {

    // ============================================
    // 1. CONFIGURATION - UPDATE THESE TWO NUMBERS
    // ============================================
    var CONFIG = {
        ratingValue: 5.0,    // e.g. 5.0, 4.9, 4.8
        reviewCount: 39      // Total Google reviews count
    };

    // Expose config globally
    window.RATING_CONFIG = CONFIG;

    // ============================================
    // 2. UPDATE LOGIC
    // ============================================
    function updateAllRatings() {
        var rating = CONFIG.ratingValue.toFixed(1);
        var count = CONFIG.reviewCount;

        // --- A. Update visible elements with classes ---
        document.querySelectorAll('.dynamic-rating').forEach(function(el) {
            el.textContent = rating;
        });
        document.querySelectorAll('.dynamic-count').forEach(function(el) {
            el.textContent = count;
        });

        // --- B. Update specific IDs (backward compatibility) ---
        ['heroRating', 'bigRating', 'footerRating', 'ratingDisplay'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.textContent = rating;
        });
        ['heroCount', 'bigCount', 'footerCount', 'reviewCountDisplay'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.textContent = count;
        });

        // --- C. Update meta tags ---
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = metaDesc.content.replace(/\d+\.?\d*★?/g, rating + '★').replace(/\d+(?=\s*Google reviews)/, count);
        }
        var ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.content = ogDesc.content.replace(/\d+\.?\d*★?/g, rating + '★').replace(/\d+(?=\s*Google reviews)/, count);
        }
        var twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) {
            twDesc.content = twDesc.content.replace(/\d+\.?\d*★?/g, rating + '★').replace(/\d+(?=\s*Google reviews)/, count);
        }

        // --- D. Update JSON-LD schemas ---
        // 1) AggregateRating (already has id="ratingSchema")
        var ratingSchema = document.getElementById('ratingSchema');
        if (ratingSchema) {
            try {
                var data = JSON.parse(ratingSchema.textContent);
                data.ratingValue = parseFloat(rating);
                data.ratingCount = count;
                data.reviewCount = count;
                ratingSchema.textContent = JSON.stringify(data, null, 2);
            } catch (e) { /* ignore */ }
        }

        // 2) BlogPosting, Restaurant, WebSite – update their 'description' fields
        var schemas = document.querySelectorAll('script[type="application/ld+json"]:not(#ratingSchema)');
        schemas.forEach(function(script) {
            try {
                var json = JSON.parse(script.textContent);
                // If it has a description field with numbers, update it
                if (json.description && typeof json.description === 'string') {
                    json.description = json.description
                        .replace(/\d+\.?\d*★?/g, rating + '★')
                        .replace(/\d+(?=\s*Google reviews)/, count);
                }
                // If it's FAQPage, update the answers
                if (json.mainEntity && Array.isArray(json.mainEntity)) {
                    json.mainEntity.forEach(function(q) {
                        if (q.acceptedAnswer && q.acceptedAnswer.text) {
                            q.acceptedAnswer.text = q.acceptedAnswer.text
                                .replace(/\d+\.?\d*★?/g, rating + '★')
                                .replace(/\d+(?=\s*Google reviews)/, count);
                        }
                    });
                }
                script.textContent = JSON.stringify(json, null, 2);
            } catch (e) { /* ignore */ }
        });
    }

    // ============================================
    // 3. AUTO-RUN on DOM ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAllRatings);
    } else {
        updateAllRatings();
    }

    // ============================================
    // 4. MANUAL TRIGGER (for testing)
    // ============================================
    window.updateRatings = function(newRating, newCount) {
        if (newRating !== undefined) CONFIG.ratingValue = newRating;
        if (newCount !== undefined) CONFIG.reviewCount = newCount;
        window.RATING_CONFIG = CONFIG;
        updateAllRatings();
        console.log('Ratings updated to:', CONFIG.ratingValue, '★ (', CONFIG.reviewCount, 'reviews)');
    };

})();
