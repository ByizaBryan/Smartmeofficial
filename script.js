const store = window.SmartMeStore;
let state = store.loadState();
let cart = [];
const backendOrigin = `${window.location.protocol}//${window.location.hostname}:8001`;
let publicServices = null;
let publicHeadings = null;
let publicFaqs = null;
let publicPolicies = null;

const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const siteSearch = document.getElementById("site-search");
const cartButton = document.getElementById("cart-button");
const closeCartButton = document.getElementById("close-cart");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const bookingForm = document.getElementById("booking-form");
const bookingFeedback = document.getElementById("booking-feedback");
const reviewForm = document.getElementById("review-form");
const reviewFeedback = document.getElementById("review-feedback");
const reviewList = document.getElementById("review-list");
const contactForm = document.getElementById("contact-form");
const contactFeedback = document.getElementById("contact-feedback");
const shopGroups = document.getElementById("shop-groups");
const shopCategories = document.querySelector(".shop-categories");
const heroContact = document.querySelector(".hero-contact");
const contactList = document.querySelector(".contact-list");
const socialLinks = document.querySelector(".social-links");
const mapFrame = document.querySelector(".map-card iframe");
const footerName = document.querySelector(".footer strong");
const footerCopy = document.querySelector(".footer p");
const serviceGrid = document.querySelector(".service-grid");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function categoryMeta(categoryKey) {
  return store.CATEGORIES.find((item) => item.key === categoryKey) || {
    key: categoryKey,
    label: categoryKey,
    description: "SmartMe catalog items"
  };
}

function renderBusinessDetails() {
  const business = state.business;
  document.title = `${business.companyName} | Electronics Sales & Repairs`;

  if (heroContact) {
    heroContact.innerHTML = `
      <li><strong>Call:</strong> ${escapeHtml(business.phone)}</li>
      <li><strong>Email:</strong> ${escapeHtml(business.email)}</li>
      <li><strong>Visit:</strong> ${escapeHtml(business.address)}</li>
    `;
  }

  if (contactList) {
    contactList.innerHTML = `
      <li><strong>Phone:</strong> ${escapeHtml(business.phone)}</li>
      <li><strong>Email:</strong> ${escapeHtml(business.email)}</li>
      <li><strong>Address:</strong> ${escapeHtml(business.address)}</li>
      <li><strong>Hours:</strong> ${escapeHtml(business.hours)}</li>
    `;
  }

  if (socialLinks) {
    socialLinks.querySelectorAll("a")[0]?.setAttribute("href", business.facebook);
    socialLinks.querySelectorAll("a")[1]?.setAttribute("href", business.instagram);
    socialLinks.querySelectorAll("a")[2]?.setAttribute("href", `https://wa.me/${business.whatsapp}`);
  }

  if (mapFrame) {
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`;
  }

  if (footerName) footerName.textContent = business.companyName;
  if (footerCopy) footerCopy.textContent = "Electronics sales, repairs, upgrades, and support for homes and businesses.";
}

function renderManagedSections() {
  if (publicHeadings) {
    const headline = document.querySelector(".hero-copy h1");
    const heroText = document.querySelector(".hero-copy .hero-text");
    const serviceSection = document.getElementById("services");
    const shopSection = document.getElementById("shop");
    const aboutSection = document.getElementById("about");
    const faqSection = document.getElementById("faqs");
    const policySection = document.getElementById("policies");
    const contactSection = document.getElementById("contact");
    const reviewHeading = document.querySelector(".about-reviews .section-heading");
    if (headline && publicHeadings.homepageHeadline) headline.textContent = publicHeadings.homepageHeadline;
    if (heroText && publicHeadings.homepageDescription) heroText.textContent = publicHeadings.homepageDescription;
    if (serviceSection) {
      const heading = serviceSection.querySelector(".section-heading h2");
      const description = serviceSection.querySelector(".section-heading p:not(.eyebrow)");
      if (heading && publicHeadings.servicesHeading) heading.textContent = publicHeadings.servicesHeading;
      if (description && publicHeadings.servicesDescription) description.textContent = publicHeadings.servicesDescription;
    }
    if (shopSection) {
      const heading = shopSection.querySelector(".section-heading h2");
      const description = shopSection.querySelector(".section-heading p:not(.eyebrow)");
      if (heading && publicHeadings.shopHeading) heading.textContent = publicHeadings.shopHeading;
      if (description && publicHeadings.shopDescription) description.textContent = publicHeadings.shopDescription;
    }
    const updateSection = (section, headingText, descriptionText) => {
      if (!section) return;
      const heading = section.querySelector(".section-heading h2");
      const description = section.querySelector(".section-heading p:not(.eyebrow)");
      if (heading && headingText) heading.textContent = headingText;
      if (description && descriptionText) description.textContent = descriptionText;
    };
    updateSection(aboutSection, publicHeadings.aboutHeading, publicHeadings.aboutDescription);
    updateSection(faqSection, publicHeadings.faqsHeading, publicHeadings.faqsDescription);
    updateSection(policySection, publicHeadings.policiesHeading, publicHeadings.policiesDescription);
    updateSection(contactSection, publicHeadings.contactHeading, publicHeadings.contactDescription);
    if (reviewHeading) {
      const heading = reviewHeading.querySelector("h2");
      const description = reviewHeading.querySelector("p:not(.eyebrow)");
      if (heading && publicHeadings.reviewsHeading) heading.textContent = publicHeadings.reviewsHeading;
      if (description && publicHeadings.reviewsDescription) description.textContent = publicHeadings.reviewsDescription;
    }
  }

  if (Array.isArray(publicServices) && serviceGrid) {
    serviceGrid.innerHTML = publicServices.length ? publicServices.map((service) => `
      <article class="service-card">
        ${service.image ? `<img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.name)}" loading="lazy">` : ""}
        <h3>${escapeHtml(service.name)}</h3>
        <p>${escapeHtml(service.description)}</p>
        ${service.startingPrice ? `<span>Starting from $${escapeHtml(service.startingPrice)}</span>` : ""}
        ${service.turnaroundTime ? `<span>${escapeHtml(service.turnaroundTime)}</span>` : ""}
      </article>
    `).join("") : '<article class="service-card"><h3>Services coming soon</h3><p>Please contact us for current repair options.</p></article>';
  }

  if (Array.isArray(publicFaqs)) {
    const faqList = document.querySelector("#faqs .faq-list");
    if (faqList) faqList.innerHTML = publicFaqs.length
      ? publicFaqs.map((faq) => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join("")
      : "<p>Contact us if you have a question.</p>";
  }

  if (Array.isArray(publicPolicies)) {
    const policyGrid = document.querySelector("#policies .policy-grid");
    if (policyGrid) policyGrid.innerHTML = publicPolicies.length
      ? publicPolicies.map((policy) => `<article class="info-card"><h3>${escapeHtml(policy.title)}</h3><p>${escapeHtml(policy.content)}</p></article>`).join("")
      : "<p>Please contact us for current policies.</p>";
  }
}

async function refreshFromBackend() {
  const response = await fetch(`${backendOrigin}/api/public-state/`);
  if (!response.ok) throw new Error("Could not load public site data.");
  const remote = await response.json();
  state = {
    ...state,
    business: { ...state.business, ...remote.business },
    products: remote.products,
    reviews: remote.reviews
  };
  publicServices = remote.services;
  publicHeadings = remote.headings;
  publicFaqs = remote.faqs;
  publicPolicies = remote.policies;
  renderBusinessDetails();
  renderManagedSections();
  renderProducts();
  renderReviews();
}

async function sendPublicSubmission(type, values) {
  const body = new URLSearchParams({ type });
  Object.entries(values).forEach(([key, value]) => {
    if (typeof value === "string") body.set(key, value);
  });
  const response = await fetch(`${backendOrigin}/api/submissions/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "Submission failed.");
}

function getVisibleProducts() {
  const searchValue = (siteSearch?.value || "").trim().toLowerCase();
  const categoryValue = categoryFilter?.value || "all";
  const products = state.products.filter((product) => product.active !== false);

  return products.filter((product) => {
    const haystack = `${product.name} ${product.description} ${(product.specs || []).join(" ")}`.toLowerCase();
    const matchesSearch = !searchValue || haystack.includes(searchValue);
    const matchesCategory = categoryValue === "all" || product.category === categoryValue;
    return matchesSearch && matchesCategory;
  });
}

function sortProducts(products) {
  const selected = sortFilter?.value || "featured";
  const sorted = [...products];
  sorted.sort((a, b) => {
    if (selected === "price-low") return Number(a.price) - Number(b.price);
    if (selected === "price-high") return Number(b.price) - Number(a.price);
    if (selected === "name") return a.name.localeCompare(b.name);
    return 0;
  });
  return sorted;
}

function renderCategoryTiles(products) {
  if (!shopCategories) return;

  const counts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const ordered = store.CATEGORIES.filter((category) => counts[category.key]);
  shopCategories.innerHTML = ordered
    .map((category) => `
      <article class="category-tile">
        <span class="category-label">${escapeHtml(category.label)}</span>
        <p>${escapeHtml(category.description)}</p>
        <strong>${counts[category.key]} item${counts[category.key] === 1 ? "" : "s"}</strong>
      </article>
    `)
    .join("");
}

function productCardTemplate(product) {
  const specs = (product.specs || []).map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
  const imageStyle = product.image
    ? `style="background-image: linear-gradient(135deg, rgba(15,118,110,0.18), rgba(15,118,110,0.04)), url('${escapeHtml(product.image)}');"`
    : "";

  return `
    <article class="product-card" data-category="${escapeHtml(product.category)}" data-name="${escapeHtml(product.name)}" data-price="${escapeHtml(product.price)}">
      <div class="product-image photo" ${imageStyle}></div>
      <span class="product-badge">${escapeHtml(product.badge || categoryMeta(product.category).label)}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.description)}</p>
      <ul class="product-specs">${specs}</ul>
      <div class="product-meta">
        <span>${formatCurrency(product.price)}</span>
        <button type="button" class="button button-secondary add-to-cart" data-product="${escapeHtml(product.name)}" data-price="${escapeHtml(product.price)}">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderProducts() {
  if (!shopGroups) return;
  const filtered = sortProducts(getVisibleProducts());
  renderCategoryTiles(filtered.length ? filtered : state.products.filter((product) => product.active !== false));

  const sections = store.CATEGORIES
    .map((category) => {
      const items = filtered.filter((product) => product.category === category.key);
      if (!items.length) return "";
      return `
        <section class="product-section" data-section-category="${category.key}">
          <div class="product-section-heading">
            <h3>${escapeHtml(category.label)}</h3>
            <p>${escapeHtml(category.description)}</p>
          </div>
          <div class="product-grid">
            ${items.map(productCardTemplate).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  shopGroups.innerHTML = sections || `<div class="checkout-card"><p>No products match your current search or filter. Try another term.</p></div>`;
  bindCartActions();
}

function renderReviews() {
  if (!reviewList) return;
  reviewList.innerHTML = state.reviews
    .map((review) => `
      <article class="review-card">
        <p>"${escapeHtml(review.comment)}"</p>
        <strong>${escapeHtml(review.reviewer)} - ${escapeHtml(review.rating)}</strong>
      </article>
    `)
    .join("");
}

function renderCart() {
  cartItems.innerHTML = "";
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty. Add products to begin checkout.</p>";
    cartTotal.textContent = "$0.00";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += Number(item.price);
    const wrapper = document.createElement("div");
    wrapper.className = "cart-item";
    wrapper.innerHTML = `<div><strong>${escapeHtml(item.name)}</strong><p>${formatCurrency(item.price)}</p></div><button type="button" class="button button-ghost" data-remove-index="${index}">Remove</button>`;
    cartItems.appendChild(wrapper);
  });

  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = String(cart.length);
}

function addToCart(name, price) {
  cart.push({ name, price: Number(price) });
  renderCart();
  openCart();
}

function bindCartActions() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.product, button.dataset.price);
    });
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function saveState(nextState) {
  state = store.saveState(nextState);
}

function handleBookingSubmission() {
  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    sendPublicSubmission("booking", Object.fromEntries(formData.entries()))
      .then(() => {
        bookingFeedback.textContent = "Repair booking received. Our team will contact you.";
        bookingForm.reset();
      })
      .catch(() => { bookingFeedback.textContent = "We could not send your booking. Please try again."; });
  });
}

function handleReviewSubmission() {
  reviewForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    sendPublicSubmission("review", Object.fromEntries(formData.entries()))
      .then(() => refreshFromBackend())
      .then(() => {
        reviewFeedback.textContent = "Thanks for sharing your review.";
        reviewForm.reset();
      })
      .catch(() => { reviewFeedback.textContent = "We could not send your review. Please try again."; });
  });
}

function handleContactSubmission() {
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    sendPublicSubmission("inquiry", Object.fromEntries(formData.entries()))
      .then(() => {
        contactFeedback.textContent = "Your inquiry has been sent. We will get back to you.";
        contactForm.reset();
      })
      .catch(() => { contactFeedback.textContent = "We could not send your message. Please try again."; });
  });
}

function bindFilters() {
  siteSearch?.addEventListener("input", renderProducts);
  categoryFilter?.addEventListener("change", renderProducts);
  sortFilter?.addEventListener("change", renderProducts);
}

cartItems?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const index = target.dataset.removeIndex;
  if (index === undefined) return;
  cart.splice(Number(index), 1);
  renderCart();
});

cartButton?.addEventListener("click", openCart);
closeCartButton?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer?.classList.contains("open")) {
    closeCart();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === store.STORAGE_KEY) {
    state = store.loadState();
    renderBusinessDetails();
    renderProducts();
    renderReviews();
  }
});

renderBusinessDetails();
renderProducts();
renderReviews();
renderCart();
bindFilters();
handleBookingSubmission();
handleReviewSubmission();
handleContactSubmission();
refreshFromBackend().catch(() => {
  console.warn("SmartMe backend is unavailable; showing the saved local catalog.");
});
