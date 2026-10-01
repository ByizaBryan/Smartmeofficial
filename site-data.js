(function () {
  const STORAGE_KEY = "smartme-admin-state-v1";

  const CATEGORIES = [
    { key: "phone", label: "Phones", description: "Smartphones for work, business, and everyday use." },
    { key: "laptop", label: "Laptops", description: "Business, student, and performance laptops with warranty." },
    { key: "tablet", label: "Tablets", description: "Portable devices for learning, travel, and presentations." },
    { key: "accessory", label: "Accessories", description: "Chargers, earbuds, cables, adapters, and protection." },
    { key: "part", label: "Spare Parts", description: "Quality replacement parts and upgrade components." }
  ];

  const defaultState = {
    business: {
      companyName: "SmartMe Technology Ltd",
      tagline: "Your Trusted Partner for Electronics Sales and Repairs.",
      phone: "+250 789 295 618",
      email: "byizab27@smartmetechnology.com",
      address: "KN 74 St, Kigali, Rwanda",
      hours: "Mon-Sat, 08:00-18:00",
      whatsapp: "250789295618",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      mapQuery: "KN 74 St Kigali Rwanda"
    },
    products: [
      {
        id: "prod-phone-1",
        name: "Nova X12 Smartphone",
        category: "phone",
        price: 599,
        badge: "New Arrival",
        description: "128GB storage, dual camera, all-day battery, and fast charging.",
        specs: ["Display: 6.5 inch AMOLED", "Memory: 8GB RAM / 128GB ROM", "Warranty: 12 months"],
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-phone-2",
        name: "PixelView S10",
        category: "phone",
        price: 489,
        badge: "Best Seller",
        description: "Excellent everyday phone for messaging, photography, and business use.",
        specs: ["Camera: 50MP dual camera", "Battery: 5000mAh", "Warranty: 12 months"],
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-laptop-1",
        name: "ProLite Business Laptop",
        category: "laptop",
        price: 849,
        badge: "Business Choice",
        description: "15.6 inch display, 16GB RAM, 512GB SSD, and Intel Core i7 performance.",
        specs: ["Use case: Office and remote work", "Storage: 512GB SSD", "Warranty: 12 months"],
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-laptop-2",
        name: "StudyBook 14",
        category: "laptop",
        price: 649,
        badge: "Student Pick",
        description: "Lightweight laptop with great battery life for coursework, browsing, and meetings.",
        specs: ["Display: 14 inch Full HD", "Memory: 8GB RAM / 256GB SSD", "Warranty: 12 months"],
        image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-tablet-1",
        name: "SmartTab Air 11",
        category: "tablet",
        price: 399,
        badge: "Tablet",
        description: "11 inch display, Wi-Fi + LTE, ideal for study, travel, and business.",
        specs: ["Display: 11 inch", "Use case: Learning and field work", "Warranty: 12 months"],
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-accessory-1",
        name: "65W Fast Charger",
        category: "accessory",
        price: 29,
        badge: "Fast Charge",
        description: "USB-C universal charger for phones, tablets, and compact laptops.",
        specs: ["Category: Power accessory", "Compatibility: Multi-device", "Warranty: 6 months"],
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-accessory-2",
        name: "Wireless Earbuds Pro",
        category: "accessory",
        price: 79,
        badge: "Audio Gear",
        description: "Noise reduction, long battery life, and a compact charging case.",
        specs: ["Battery: Up to 24 hours with case", "Connection: Bluetooth 5.3", "Warranty: 6 months"],
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        active: true
      },
      {
        id: "prod-part-1",
        name: "Premium Laptop SSD 1TB",
        category: "part",
        price: 119,
        badge: "Upgrade Ready",
        description: "High-speed storage upgrade for faster boot times and better productivity.",
        specs: ["Category: Spare part", "Installation: Available in-store", "Warranty: 6 months"],
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80",
        active: true
      }
    ],
    reviews: [
      { id: "review-1", reviewer: "Ruth N.", rating: "5 Stars", comment: "My laptop was repaired the same day and the team explained every step clearly." },
      { id: "review-2", reviewer: "Kelvin S.", rating: "5 Stars", comment: "Affordable phone screen replacement and the quality was excellent. Highly recommended." },
      { id: "review-3", reviewer: "Patricia M.", rating: "5 Stars", comment: "Their shop helped us source office laptops quickly and within budget." }
    ],
    bookings: [],
    inquiries: []
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalize(state) {
    const merged = clone(defaultState);
    if (!state || typeof state !== "object") return merged;

    merged.business = { ...merged.business, ...(state.business || {}) };
    merged.products = Array.isArray(state.products) && state.products.length ? state.products : merged.products;
    merged.reviews = Array.isArray(state.reviews) && state.reviews.length ? state.reviews : merged.reviews;
    merged.bookings = Array.isArray(state.bookings) ? state.bookings : [];
    merged.inquiries = Array.isArray(state.inquiries) ? state.inquiries : [];
    return merged;
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normalize(JSON.parse(raw)) : clone(defaultState);
    } catch (error) {
      return clone(defaultState);
    }
  }

  function saveState(state) {
    const normalized = normalize(state);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function resetState() {
    window.localStorage.removeItem(STORAGE_KEY);
    return clone(defaultState);
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  window.SmartMeStore = {
    STORAGE_KEY,
    CATEGORIES,
    defaultState: clone(defaultState),
    loadState,
    saveState,
    resetState,
    createId
  };
})();
