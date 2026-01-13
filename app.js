// ✅ Put your hosted payment page redirect URL here:
const HPP_REDIRECT_URL = "https://YOUR-PREGENERATED-REDIRECT-URL";

const cartItems = [
  { name: "Nordic Winter Jacket", desc: "Size L • Color Black", price: 49.90 },
  { name: "Wool Beanie", desc: "One size • Grey", price: 12.90 },
];

const fmt = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

function renderCart() {
  const cart = document.getElementById("cart");
  cart.innerHTML = cartItems.map(i => `
    <div class="item">
      <div>
        <div class="name">${i.name}</div>
        <div class="desc">${i.desc}</div>
      </div>
      <div class="price">${fmt(i.price)}</div>
    </div>
  `).join("");
}

function updateTotals() {
  const subtotal = cartItems.reduce((s, i) => s + i.price, 0);
  const shipping = Number(document.getElementById("shipping").value);

  document.getElementById("subtotal").textContent = fmt(subtotal);
  document.getElementById("shippingCost").textContent = fmt(shipping);
  document.getElementById("total").textContent = fmt(subtotal + shipping);
}

function redirectToHpp() {
  // Optional: append some demo-only context (ONLY if your HPP ignores unknown params)
  // If your redirect URL is strict/signed, do NOT append anything.
  const email = document.getElementById("email").value.trim();
  const url = HPP_REDIRECT_URL;

  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hidden");

  // Small delay to make the demo feel “real”
  setTimeout(() => {
    window.location.href = url;
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
    if (!HPP_REDIRECT_URL || HPP_REDIRECT_URL.includes("YOUR-PREGENERATED-REDIRECT-URL")) {
      alert("Set HPP_REDIRECT_URL in app.js first.");
      return;
    }
    redirectToHpp();
  });
});
