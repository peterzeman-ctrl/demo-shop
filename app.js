// Put your pre-generated hosted payment page redirect URLs here.
// They will be rotated on every page load (refresh).
const HPP_REDIRECT_URLS = [
  "https://computop-paygate.com/paymentpage.aspx?token=40a44c4761af415c9e6c9a571422db4d",
  "https://computop-paygate.com/paymentpage.aspx?token=d72b7b107d474d8e83a4a5e223987cb9",
  "https://computop-paygate.com/paymentpage.aspx?token=82f833981d1d491d9eecc0aa04274a07",
  // ...
];

const STORAGE_KEY = "demoShop_hppUrlIndex";

// ---- Demo cart (unchanged) ----
const cartItems = [
  { name: "Nordic Winter Jacket", desc: "Size L • Color Black", price: 49.90 },
  { name: "Wool Beanie", desc: "One size • Grey", price: 12.90 },
];

const fmt = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "NOK" }).format(n);

// Picks the next URL on each page load and persists the index.
// If you open in a new browser/profile, rotation starts at 0 again.
function pickNextHppUrl() {
  if (!Array.isArray(HPP_REDIRECT_URLS) || HPP_REDIRECT_URLS.length === 0) return "";

  const raw = localStorage.getItem(STORAGE_KEY);
  const lastIndex = raw === null ? -1 : Number(raw);

  // Next index (wrap around)
  const nextIndex = Number.isFinite(lastIndex)
    ? (lastIndex + 1) % HPP_REDIRECT_URLS.length
    : 0;

  localStorage.setItem(STORAGE_KEY, String(nextIndex));

  return HPP_REDIRECT_URLS[nextIndex];
}

// Optional: show which URL index is selected in console (useful for debugging)
const SELECTED_HPP_URL = pickNextHppUrl();
console.log("Selected HPP URL:", SELECTED_HPP_URL);

// ---- UI rendering (unchanged) ----
function renderCart() {
  const cart = document.getElementById("cart");
  cart.innerHTML = cartItems
    .map(
      (i) => `
    <div class="item">
      <div>
        <div class="name">${i.name}</div>
        <div class="desc">${i.desc}</div>
      </div>
      <div class="price">${fmt(i.price)}</div>
    </div>
  `
    )
    .join("");
}

function updateTotals() {
  const subtotal = cartItems.reduce((s, i) => s + i.price, 0);
  const shipping = Number(document.getElementById("shipping").value);

  document.getElementById("subtotal").textContent = fmt(subtotal);
  document.getElementById("shippingCost").textContent = fmt(shipping);
  document.getElementById("total").textContent = fmt(subtotal + shipping);
}

function redirectToHpp() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hidden");

  // Small delay to make the demo feel “real”
  setTimeout(() => {
    window.location.href = SELECTED_HPP_URL;
  }, 600);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateTotals();

  document.getElementById("shipping").addEventListener("change", updateTotals);

  document.getElementById("payBtn").addEventListener("click", () => {
    const terms = document.getElementById("terms").checked;
    if (!terms) {
      alert("Please accept Terms & Conditions.");
      return;
    }

    if (!SELECTED_HPP_URL) {
      alert("No hosted payment page URLs configured. Add URLs to HPP_REDIRECT_URLS in app.js.");
      return;
    }

    // Safety: prevent placeholder usage
    if (SELECTED_HPP_URL.includes("YOUR-REDIRECT-URL")) {
      alert("Replace the placeholder URLs in HPP_REDIRECT_URLS in app.js.");
      return;
    }

    redirectToHpp();
  });
});

