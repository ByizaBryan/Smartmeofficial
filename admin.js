const store = window.SmartMeStore;
let state = store.loadState();

const statProducts = document.getElementById("stat-products");
const statReviews = document.getElementById("stat-reviews");
const statBookings = document.getElementById("stat-bookings");
const statInquiries = document.getElementById("stat-inquiries");
const businessForm = document.getElementById("business-form");
const businessStatus = document.getElementById("business-status");
const productForm = document.getElementById("product-form");
const productStatus = document.getElementById("product-status");
const productList = document.getElementById("product-list");
const reviewAdminForm = document.getElementById("review-admin-form");
const reviewStatus = document.getElementById("review-status");
const reviewListAdmin = document.getElementById("review-list-admin");
const bookingList = document.getElementById("booking-list");
const inquiryList = document.getElementById("inquiry-list");

function saveState(nextState) {
  state = store.saveState(nextState);
  renderAll();
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function populateBusinessForm() {
  const business = state.business;
  for (const [key, value] of Object.entries(business)) {
    const field = businessForm.elements.namedItem(key);
    if (field) field.value = value;
  }
}

function populateProductForm(product = null) {
  productForm.reset();
  productForm.elements.namedItem("active").checked = true;
  if (!product) return;

  productForm.elements.namedItem("id").value = product.id;
  productForm.elements.namedItem("name").value = product.name;
  productForm.elements.namedItem("category").value = product.category;
  productForm.elements.namedItem("price").value = product.price;
  productForm.elements.namedItem("badge").value = product.badge || "";
  productForm.elements.namedItem("image").value = product.image || "";
  productForm.elements.namedItem("description").value = product.description;
  productForm.elements.namedItem("specs").value = (product.specs || []).join("\n");
  productForm.elements.namedItem("active").checked = product.active !== false;
}

function populateReviewForm(review = null) {
  reviewAdminForm.reset();
  if (!review) return;
  reviewAdminForm.elements.namedItem("id").value = review.id;
  reviewAdminForm.elements.namedItem("reviewer").value = review.reviewer;
  reviewAdminForm.elements.namedItem("rating").value = review.rating;
  reviewAdminForm.elements.namedItem("comment").value = review.comment;
}

function renderStats() {
  statProducts.textContent = String(state.products.filter((product) => product.active !== false).length);
  statReviews.textContent = String(state.reviews.length);
  statBookings.textContent = String(state.bookings.length);
  statInquiries.textContent = String(state.inquiries.length);
}

function renderProducts() {
  productList.innerHTML = state.products.map((product) => `
    <article class="list-item">
      <strong>${product.name}</strong>
      <p>${store.CATEGORIES.find((item) => item.key === product.category)?.label || product.category} · $${Number(product.price).toFixed(2)} · ${product.active !== false ? "Visible" : "Hidden"}</p>
      <p>${product.description}</p>
      <div class="list-actions">
        <button class="admin-button secondary" type="button" data-edit-product="${product.id}">Edit</button>
        <button class="admin-button secondary" type="button" data-toggle-product="${product.id}">${product.active !== false ? "Hide" : "Show"}</button>
        <button class="admin-button secondary" type="button" data-delete-product="${product.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

function renderReviews() {
  reviewListAdmin.innerHTML = state.reviews.map((review) => `
    <article class="list-item">
      <strong>${review.reviewer} · ${review.rating}</strong>
      <p>${review.comment}</p>
      <div class="list-actions">
        <button class="admin-button secondary" type="button" data-edit-review="${review.id}">Edit</button>
        <button class="admin-button secondary" type="button" data-delete-review="${review.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

function renderBookings() {
  bookingList.innerHTML = state.bookings.length ? state.bookings.map((booking) => `
    <article class="list-item">
      <strong>${booking.name} · ${booking.device}</strong>
      <p>${booking.phone} · ${booking.date} ${booking.time}</p>
      <p>${booking.issue}</p>
      <p>Submitted: ${formatDate(booking.createdAt)}</p>
    </article>
  `).join("") : '<article class="list-item"><p>No bookings yet.</p></article>';
}

function renderInquiries() {
  inquiryList.innerHTML = state.inquiries.length ? state.inquiries.map((inquiry) => `
    <article class="list-item">
      <strong>${inquiry.name}</strong>
      <p>${inquiry.email}</p>
      <p>${inquiry.message}</p>
      <p>Submitted: ${formatDate(inquiry.createdAt)}</p>
    </article>
  `).join("") : '<article class="list-item"><p>No inquiries yet.</p></article>';
}

function renderAll() {
  renderStats();
  renderProducts();
  renderReviews();
  renderBookings();
  renderInquiries();
  populateBusinessForm();
}

businessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(businessForm);
  const business = Object.fromEntries(formData.entries());
  saveState({ ...state, business });
  businessStatus.textContent = "Business details saved. Refresh the website tab to see the update immediately.";
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const id = formData.get("id") || store.createId("product");
  const product = {
    id,
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    badge: formData.get("badge"),
    image: formData.get("image"),
    description: formData.get("description"),
    specs: String(formData.get("specs") || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    active: formData.get("active") === "on"
  };

  const exists = state.products.some((item) => item.id === id);
  const products = exists
    ? state.products.map((item) => item.id === id ? product : item)
    : [product, ...state.products];

  saveState({ ...state, products });
  populateProductForm();
  productStatus.textContent = exists ? "Product updated successfully." : "Product added successfully.";
});

reviewAdminForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reviewAdminForm);
  const id = formData.get("id") || store.createId("review");
  const review = {
    id,
    reviewer: formData.get("reviewer"),
    rating: formData.get("rating"),
    comment: formData.get("comment")
  };

  const exists = state.reviews.some((item) => item.id === id);
  const reviews = exists
    ? state.reviews.map((item) => item.id === id ? review : item)
    : [review, ...state.reviews];

  saveState({ ...state, reviews });
  populateReviewForm();
  reviewStatus.textContent = exists ? "Review updated successfully." : "Review added successfully.";
});

document.getElementById("product-reset").addEventListener("click", () => populateProductForm());
document.getElementById("review-reset").addEventListener("click", () => populateReviewForm());
document.getElementById("clear-bookings").addEventListener("click", () => saveState({ ...state, bookings: [] }));
document.getElementById("clear-inquiries").addEventListener("click", () => saveState({ ...state, inquiries: [] }));
document.getElementById("reset-demo").addEventListener("click", () => {
  state = store.resetState();
  renderAll();
});

productList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.editProduct) {
    const product = state.products.find((item) => item.id === target.dataset.editProduct);
    if (product) populateProductForm(product);
  }

  if (target.dataset.toggleProduct) {
    const products = state.products.map((item) => item.id === target.dataset.toggleProduct ? { ...item, active: item.active === false } : item);
    saveState({ ...state, products });
  }

  if (target.dataset.deleteProduct) {
    const products = state.products.filter((item) => item.id !== target.dataset.deleteProduct);
    saveState({ ...state, products });
  }
});

reviewListAdmin.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.editReview) {
    const review = state.reviews.find((item) => item.id === target.dataset.editReview);
    if (review) populateReviewForm(review);
  }

  if (target.dataset.deleteReview) {
    const reviews = state.reviews.filter((item) => item.id !== target.dataset.deleteReview);
    saveState({ ...state, reviews });
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === store.STORAGE_KEY) {
    state = store.loadState();
    renderAll();
  }
});

renderAll();
