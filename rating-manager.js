// ============================================================
// RATING MANAGER v1.0
// Centralized dynamic aggregate rating for Muiz Hot Chicken
// ============================================================
(function() {

    // ============================================
    // 1. CONFIGURATION - UPDATE THESE TWO NUMBERS
    //    whenever your Google rating changes.
    // ============================================
    var CONFIG = {
        ratingValue: 5.0,    // e.g. 5.0, 4.9, 4.8
        reviewCount: 38      // Total Google reviews count
    };

    // Expose config globally for debugging or manual overrides
    window.RATING_CONFIG = CONFIG;

    // ============================================
    // 2. UPDATE LOGIC - Finds placeholders and updates them
    // ============================================
    function updateRatingDisplay() {
        var rating = CONFIG.ratingValue.toFixed(1); // always shows "5.0"
        var count = CONFIG.reviewCount;

        // ---- A. Update visible text elements (using IDs) ----
        var ratingIds = ['heroRating', 'bigRating', 'footerRating', 'ratingDisplay'];
        ratingIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.textContent = rating;
        });

        var countIds = ['heroCount', 'bigCount', 'footerCount', 'reviewCountDisplay'];
        countIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.textContent = count;
        });

        // Also update any element with data-rating attribute (alternative method)
        document.querySelectorAll('[data-rating-value]').forEach(function(el) {
            el.textContent = rating;
        });
        document.querySelectorAll('[data-rating-count]').forEach(function(el) {
            el.textContent = count;
        });

        // ---- B. Update JSON-LD Structured Data (Critical for SEO) ----
        var schemaScript = document.getElementById('ratingSchema');
        if (schemaScript) {
            try {
                var data = JSON.parse(schemaScript.textContent);
                // Update the values
                data.ratingValue = parseFloat(rating);
                data.ratingCount = count;
                data.reviewCount = count;
                // Preserve the stringify formatting
                schemaScript.textContent = JSON.stringify(data, null, 2);
            } catch (e) {
                console.warn('Rating Manager: Failed to update JSON-LD schema.', e);
            }
        }
    }

    // ============================================
    // 3. AUTO-RUN on DOM ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateRatingDisplay);
    } else {
        // DOM already loaded, run immediately
        updateRatingDisplay();
    }

    // ============================================
    // 4. MANUAL TRIGGER (exposed globally)
    //    Usage: updateRatings(4.9, 45);
    // ============================================
    window.updateRatings = function(newRating, newCount) {
        if (newRating !== undefined) CONFIG.ratingValue = newRating;
        if (newCount !== undefined) CONFIG.reviewCount = newCount;
        window.RATING_CONFIG = CONFIG;
        updateRatingDisplay();
        console.log('Ratings updated to:', CONFIG.ratingValue, '★ (', CONFIG.reviewCount, 'reviews)');
    };

})();
