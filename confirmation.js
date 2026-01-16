const cartItems = [
  { name: "Nordic Winter Jacket", desc: "Size L • Color Black", price: 49.90 },
  { name: "Wool Beanie", desc: "One size • Grey", price: 12.90 },
];

const defaultShipping = 4.90;

const fmt = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "NOK" }).format(n);

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function genOrderId() {
  // Simple demo-friendly ID like DS-24001
  const n = Math.floor(10000 + Math.random() * 90000);
  return `DS-${n}`;
}

function setDate() {
  const d = new Date();
  const dateStr = new Intl.DateTimeFormat("de-DE", { year: "numeric", month: "long", day: "2-digit" }).format(d);
  document.getElementById("orderDate").textContent = dateStr;
}

function renderSummaryItems() {
  const wrap = document.getElementById("summaryItems");
  wrap.innerHTML = cartItems.map(i => `
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

  // Optional override from URL params: ?shipping=9.90
  const shippingParam = qs("shipping");
  const shipping = shippingParam ? Number(shippingParam) : defaultShipping;

  document.getElementById("subtotal").textContent = fmt(subtotal);
  document.getElementById("shippingCost").textContent = fmt(shipping);
  document.getElementById("total").textContent = fmt(subtotal + shipping);
}

function setupOrderId() {
  const orderId = qs("orderId") || genOrderId();
  document.getElementById("orderId").textContent = orderId;
}

function setupReceiptDownload() {
  const btn = document.getElementById("downloadBtn");
  btn.addEventListener("click", () => {
    const orderId = document.getElementById("orderId").textContent;
    const total = document.getElementById("total").textContent;
    const date = document.getElementById("orderDate").textContent;

    const content =
`Demo Shop – Receipt
Order: ${orderId}
Date: ${date}
Status: Paid
Total: ${total}

Thank you for your purchase!`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderId}-receipt.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setDate();
  setupOrderId();
  renderSummaryItems();
  updateTotals();
  setupReceiptDownload();
});

