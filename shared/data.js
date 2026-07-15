/* ============================================================
   SHARED DATA - Muiz Hot Chicken
   All menu items, reviews, and shared data
   Used by iOS, Android, and Web interfaces
   ============================================================ */

'use strict';

// ===== MENU DATA =====
const MENU_DATA = [{
    category: "Most Ordered",
    items: [
        { 
            name: "Nasi Kandar Muiz Hot Chicken", 
            desc: "Nasi kandar with signature Muiz hot chicken & rich curry sauce.",
            price: 6.90, 
            img: "../images/nasikandarmuizchicken.webp" 
        },
        { 
            name: "Nasi Ayam Muiz Chicken", 
            desc: "Aromatic chicken rice with tender Muiz-style fried chicken, sambal.",
            price: 8.90, 
            img: "../images/nasiayammuizchicken.webp" 
        },
        { 
            name: "Nasi Bujang", 
            desc: "White Rice + Omelette + Soup + Sambal",
            price: 3.90, 
            img: "../images/nasibujang.webp" 
        },
        { 
            name: "Bakso", 
            desc: "Authentic Indonesian beef meatball soup with savoury broth.",
            price: 5.90, 
            img: "../images/bakso.webp" 
        },
        { 
            name: "Mee Pak Haji Ali", 
            desc: "Traditional recipe. Savoury noodles with special house blend.",
            price: 6.90, 
            img: "../images/meepakhajiali.webp" 
        }
    ]
}, {
    category: "Muiz Hot Chicken Regular Box",
    items: [
        { 
            name: "Original Regular Box", 
            desc: "2 Pieces of Muiz Hot Chicken 🍗",
            price: 10.00, 
            img: "../images/originalregularbox.webp" 
        },
        { 
            name: "Cheese Regular Box", 
            desc: "2 Pieces + Cheese Sauce",
            price: 12.00, 
            img: "../images/cheeseregularbox.webp" 
        },
        { 
            name: "Korean Spicy Regular Box", 
            desc: "2 Pieces + Korean Spicy Sauce",
            price: 13.00, 
            img: "../images/koreanspicyregularbox.webp" 
        },
        { 
            name: "Korean Cheese Regular Box", 
            desc: "2 Pieces + Cheese + Korean Spicy",
            price: 14.00, 
            img: "../images/koreancheeseregularbox.webp" 
        }
    ]
}, {
    category: "Muiz Hot Chicken Happy Box",
    items: [
        { 
            name: "Original Happy Box", 
            desc: "5 Pieces of Muiz Hot Chicken 🍗",
            price: 25.00, 
            img: "../images/originalhappybox.webp" 
        },
        { 
            name: "Cheese Happy Box", 
            desc: "5 Pieces + 2 Cheese Sauce",
            price: 29.00, 
            img: "../images/cheesehappybox.webp" 
        },
        { 
            name: "Korean Spicy Happy Box", 
            desc: "5 Pieces + 2 Korean Spicy",
            price: 31.00, 
            img: "../images/koreanspicyhappybox.webp" 
        },
        { 
            name: "Korean Cheese Happy Box", 
            desc: "5 Pieces + Cheese + Korean Spicy",
            price: 33.00, 
            img: "../images/koreancheesehappybox.webp" 
        }
    ]
}, {
    category: "Chicken Tenders",
    items: [
        { 
            name: "Chicken Tenders", 
            desc: "Choose flavour: Mala • Peri-Peri • Thai Lime • Charcoal",
            price: 9.90, 
            img: "../images/chickentenders.webp" 
        }
    ]
}, {
    category: "Nasi Penyet",
    items: [
        { 
            name: "Nasi Ayam Muiz Penyet", 
            desc: "Smashed chicken with sambal, served with rice.",
            price: 8.90, 
            img: "../images/nasiayammuizpenyet.webp" 
        },
        { 
            name: "Nasi Daging Penyet", 
            desc: "Smashed beef with sambal, served with rice.",
            price: 8.90, 
            img: "../images/nasidagingpenyet.webp" 
        },
        { 
            name: "Nasi Ikan Keli Penyet", 
            desc: "Smashed catfish with sambal, served with rice.",
            price: 8.90, 
            img: "../images/nasiikankelipenyet.webp" 
        },
        { 
            name: "Nasi Ikan Kembung Penyet", 
            desc: "Smashed mackerel with sambal, served with rice.",
            price: 8.90, 
            img: "../images/nasiikankembungpenyet.webp" 
        }
    ]
}, {
    category: "Nasi Goreng Kampung",
    items: [
        { 
            name: "Nasi Goreng Kampung", 
            desc: "Classic village-style fried rice",
            price: 7.50, 
            img: "../images/nasigorengkampung.webp" 
        },
        { 
            name: "Nasi Goreng Kampung Ayam", 
            desc: "With chicken",
            price: 11.90, 
            img: "../images/nasigorengkampungayam.webp" 
        },
        { 
            name: "Nasi Goreng Kampung Daging", 
            desc: "With beef",
            price: 11.90, 
            img: "../images/nasigorengkampungdaging.webp" 
        },
        { 
            name: "Nasi Goreng Kampung Seafood", 
            desc: "With seafood",
            price: 13.90, 
            img: "../images/nasigorengkampungseafood.webp" 
        }
    ]
}, {
    category: "Nasi Goreng Cina",
    items: [
        { 
            name: "Nasi Goreng Cina", 
            desc: "Classic Chinese fried rice",
            price: 6.00, 
            img: "../images/nasigorengcina.webp" 
        },
        { 
            name: "Nasi Goreng Cina Ayam", 
            desc: "With chicken",
            price: 10.90, 
            img: "../images/nasigorengcinaayam.webp" 
        },
        { 
            name: "Nasi Goreng Cina Daging", 
            desc: "With beef",
            price: 10.90, 
            img: "../images/nasigorengcinadaging.webp" 
        },
        { 
            name: "Nasi Goreng Cina Seafood", 
            desc: "With seafood",
            price: 12.90, 
            img: "../images/nasigorengcinaseafood.webp" 
        }
    ]
}, {
    category: "Nasi Goreng Tomyam",
    items: [
        { 
            name: "Nasi Goreng Tomyam Biasa", 
            desc: "Tomyam fried rice",
            price: 8.50, 
            img: "../images/nasigorengtomyambiasa.webp" 
        },
        { 
            name: "Nasi Goreng Tomyam Ayam", 
            desc: "With chicken",
            price: 12.90, 
            img: "../images/nasigorengtomyamayam.webp" 
        },
        { 
            name: "Nasi Goreng Tomyam Daging", 
            desc: "With beef",
            price: 12.90, 
            img: "../images/nasigorengtomyamdaging.webp" 
        },
        { 
            name: "Nasi Goreng Tomyam Seafood", 
            desc: "With seafood",
            price: 14.90, 
            img: "../images/nasigorengtomyamseafood.webp" 
        }
    ]
}, {
    category: "Nasi Goreng",
    items: [
        { 
            name: "Nasi Goreng Vegetarian", 
            desc: "Vegetarian fried rice with fresh vegetables.",
            price: 6.00, 
            img: "../images/nasigorengvegetarian.webp" 
        },
        { 
            name: "Nasi Goreng Biasa", 
            desc: "Classic plain fried rice.",
            price: 6.50, 
            img: "../images/nasigorengbiasa.webp" 
        },
        { 
            name: "Nasi Goreng Cili Api", 
            desc: "Spicy fried rice with bird's eye chili.",
            price: 6.50, 
            img: "../images/nasigorengciliapi.webp" 
        },
        { 
            name: "Nasi Goreng Kicap", 
            desc: "Fried rice with sweet soy sauce.",
            price: 6.80, 
            img: "../images/nasigorengkicap.webp" 
        },
        { 
            name: "Nasi Goreng Mamak", 
            desc: "Mamak-style fried rice with aromatic spices.",
            price: 7.00, 
            img: "../images/nasigorengmamak.webp" 
        },
        { 
            name: "Nasi Goreng Belacan", 
            desc: "Fried rice with shrimp paste for a savoury kick.",
            price: 7.00, 
            img: "../images/nasigorengbelacan.webp" 
        },
        { 
            name: "Nasi Goreng Ikan Bilis", 
            desc: "Fried rice with crispy anchovies.",
            price: 7.50, 
            img: "../images/nasigorengikanbilis.webp" 
        },
        { 
            name: "Nasi Goreng Sardin", 
            desc: "Fried rice with sardines in spicy sauce.",
            price: 8.50, 
            img: "../images/nasigorengsardin.webp" 
        },
        { 
            name: "Nasi Goreng Pattaya", 
            desc: "Fried rice wrapped in a thin egg omelette.",
            price: 8.50, 
            img: "../images/nasigorengpattaya.webp" 
        },
        { 
            name: "Nasi Goreng Ikan Masin", 
            desc: "Fried rice with salted fish for a savoury flavour.",
            price: 9.00, 
            img: "../images/nasigorengikanmasin.webp" 
        },
        { 
            name: "Nasi Goreng Ayam", 
            desc: "Fried rice with chicken pieces.",
            price: 9.50, 
            img: "../images/nasigorengayam.webp" 
        },
        { 
            name: "Nasi Goreng Daging", 
            desc: "Fried rice with beef pieces.",
            price: 9.80, 
            img: "../images/nasigorengdaging.webp" 
        },
        { 
            name: "Nasi Goreng Paprik", 
            desc: "Fried rice with spicy paprik sauce.",
            price: 10.50, 
            img: "../images/nasigorengpaprik.webp" 
        },
        { 
            name: "Nasi Goreng Masak Kunyit", 
            desc: "Fried rice with turmeric for a fragrant flavour.",
            price: 10.50, 
            img: "../images/nasigorengmasakkunyit.webp" 
        },
        { 
            name: "Nasi Goreng Seafood", 
            desc: "Fried rice with prawns and squid.",
            price: 12.00, 
            img: "../images/nasigorengseafood.webp" 
        },
        { 
            name: "Nasi Goreng USA", 
            desc: "Chicken or Beef",
            price: 12.50, 
            img: "../images/nasigorengusa.webp" 
        }
    ]
}, {
    category: "Ala Carte",
    items: [
        { 
            name: "Nasi Putih", 
            desc: "White rice.",
            price: 2.00, 
            img: "../images/nasiputih.webp" 
        },
        { 
            name: "Telur Mata", 
            desc: "Sunny side up egg.",
            price: 1.50, 
            img: "../images/telurmata.webp" 
        },
        { 
            name: "Telur Dadar", 
            desc: "Omelette egg.",
            price: 2.50, 
            img: "../images/telurdadar.webp" 
        },
        { 
            name: "Telur Separuh Masak", 
            desc: "Half-boiled egg.",
            price: 3.00, 
            img: "../images/telurseparuhmasak.webp" 
        },
        { 
            name: "Telur Dadar Cheese", 
            desc: "Omelette egg with cheese.",
            price: 4.50, 
            img: "../images/telurdadarcheese.webp" 
        },
        { 
            name: "Muiz Hot Chicken", 
            desc: "Signature crispy fried chicken.",
            price: 5.00, 
            img: "../images/muizhotchicken.webp" 
        },
        { 
            name: "Ikan Kembung Goreng", 
            desc: "Fried mackerel fish.",
            price: 5.50, 
            img: "../images/ikankembunggoreng.webp" 
        },
        { 
            name: "Ikan Keli Goreng", 
            desc: "Fried catfish.",
            price: 5.90, 
            img: "../images/ikankeligoreng.webp" 
        },
        { 
            name: "Ayam Masak Kunyit", 
            desc: "Chicken cooked with turmeric.",
            price: 6.90, 
            img: "../images/ayammasakkunyit.webp" 
        },
        { 
            name: "Daging Masak Kunyit", 
            desc: "Beef cooked with turmeric.",
            price: 6.90, 
            img: "../images/dagingmasakkunyit.webp" 
        },
        { 
            name: "Ayam Masak Merah", 
            desc: "Chicken cooked in spicy red sauce.",
            price: 6.90, 
            img: "../images/ayammasakmerah.webp" 
        },
        { 
            name: "Daging Masak Merah", 
            desc: "Beef cooked in spicy red sauce.",
            price: 6.90, 
            img: "../images/dagingmasakmerah.webp" 
        },
        { 
            name: "Sup Sayur", 
            desc: "Vegetable soup.",
            price: 5.00, 
            img: "../images/supsayur.webp" 
        },
        { 
            name: "Sup Ayam", 
            desc: "Chicken soup.",
            price: 8.00, 
            img: "../images/supayam.webp" 
        },
        { 
            name: "Sup Daging", 
            desc: "Beef soup.",
            price: 8.00, 
            img: "../images/supdaging.webp" 
        },
        { 
            name: "Tomyam Ayam", 
            desc: "Spicy and sour tomyam soup with chicken.",
            price: 8.90, 
            img: "../images/tomyamayam.webp" 
        },
        { 
            name: "Tomyam Daging", 
            desc: "Spicy and sour tomyam soup with beef.",
            price: 8.90, 
            img: "../images/tomyamdaging.webp" 
        },
        { 
            name: "Tomyam Seafood", 
            desc: "Spicy and sour tomyam soup with prawns and squid.",
            price: 11.90, 
            img: "../images/tomyamseafood.webp" 
        }
    ]
}];

// ===== REVIEWS =====
const REVIEWS = [
    { 
        name: "salleh akhnas", 
        text: "Cheap and worth the price... the food is delicious too" 
    },
    { 
        name: "Yana Mazlan", 
        text: "Friendly owner, the chicken muiz is unspeakably delicious, thank you." 
    },
    { 
        name: "Christina", 
        text: "The chicken is delicious and big, the service is good and friendly, you can choose the part of the chicken you want." 
    },
    { 
        name: "Siti Nur Alia", 
        text: "Muiz chicken is delicious and crispy. The cheese sauce is delicious and goes well with the muiz fried chicken." 
    },
    { 
        name: "Rocket Man", 
        text: "This is newly opened mamak restaurant next to Good Year Court 6. The foods are delicious." 
    },
    { 
        name: "azri syafiqq", 
        text: "Fast service, good ambience and amazing food" 
    },
    { 
        name: "Assila Emir", 
        text: "Chicken is very delicious, tender and crispy at the same time." 
    }
];

// ===== LOCATION DATA =====
const LOCATION_DATA = {
    name: "Restoran Pak Haji Ali & Muiz Hot Chicken",
    address: "J2-00-04, Subang Perdana Phase 3, Persiaran Mulia, Goodyear Court 6, USJ 8",
    city: "Subang Jaya",
    state: "Selangor",
    postalCode: "47610",
    country: "Malaysia",
    phone: "+60179081447",
    email: "muizhotchicken@gmail.com",
    website: "https://pakhajiali.github.io/muizhotchicken/",
    googleMaps: "https://g.page/r/CUrZw9xvAXIPEBE",
    latitude: 3.044170,
    longitude: 101.592858,
    openingHours: {
        monday: "9:00 AM – 9:00 PM",
        tuesday: "9:00 AM – 9:00 PM",
        wednesday: "9:00 AM – 9:00 PM",
        thursday: "9:00 AM – 9:00 PM",
        friday: "9:00 AM – 9:00 PM",
        saturday: "9:00 AM – 9:00 PM",
        sunday: "9:00 AM – 9:00 PM"
    }
};

// ===== SOCIAL MEDIA =====
const SOCIAL_LINKS = {
    whatsapp: "https://wa.me/60179081447",
    facebook: "https://www.facebook.com/61591075012810/",
    tiktok: "https://www.tiktok.com/@muiz.fried.chicken",
    youtube: "https://www.youtube.com/@MHCRestoranPakHajiAli",
    googleMaps: "https://g.page/r/CUrZw9xvAXIPEBE",
    review: "https://g.page/r/CUrZw9xvAXIPEBE/review"
};

// ===== DELIVERY PLATFORMS =====
const DELIVERY_LINKS = {
    grabfood: "https://r.grab.com/g/6-20260630_094247_c8be9e5df8e142aeba682bdb1ba93358_MEXMPS-1-C6D2TUKFCP2UT6",
    foodpanda: "https://www.foodpanda.my/restaurant/bn66/restoran-pak-haji-ali-and-muiz-hot-chicken-bn66",
    shopeefood: "https://shopee.com.my/universal-link/now-food/shop/20561288",
    misirakyat: "https://link.misirakyat.com/vendor/a1fc8eb6-2559-4031-b513-e5c07874a04b"
};

// ===== COMPANY INFO =====
const COMPANY_INFO = {
    name: "Restoran Pak Haji Ali & Muiz Hot Chicken",
    established: "2026-05-01",
    halal: true,
    mesti: true,
    halalCertNumber: "JAKIM-HALAL-2026-001",
    mestiCertNumber: "KKM-MESTI-2026-001",
    branches: 200,
    rating: 5,
    cuisine: ["Malaysian", "Thai", "Nasi Kandar", "Fried Chicken", "Tomyam"],
    tags: ["Halal", "Family Friendly", "Dine-in", "Takeaway", "Delivery"]
};

// ============================================================
// EXPORT (for module support if needed)
// ============================================================

// For browser script tags (global variables)
if (typeof window !== 'undefined') {
    window.MENU_DATA = MENU_DATA;
    window.REVIEWS = REVIEWS;
    window.LOCATION_DATA = LOCATION_DATA;
    window.SOCIAL_LINKS = SOCIAL_LINKS;
    window.DELIVERY_LINKS = DELIVERY_LINKS;
    window.COMPANY_INFO = COMPANY_INFO;
}

// For ES modules (if used later)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MENU_DATA,
        REVIEWS,
        LOCATION_DATA,
        SOCIAL_LINKS,
        DELIVERY_LINKS,
        COMPANY_INFO
    };
          }
