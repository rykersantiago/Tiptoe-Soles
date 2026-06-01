/* ============================================
   TipToe Soles — Main Script
   js/main.js
   ============================================ */

/* ── PRODUCT DATA ── */
const PRODUCTS = [
  { id: 1, name: "Gary",          colour: "Tan",      price: 79.00, img: "images/Gary_Tan.jpg",              category: "Men's",   desc: "The Gary in Tan is a classic suede lace-up shoe built for everyday comfort. Features a cushioned insole, breathable lining and a durable rubber sole." },
  { id: 2, name: "Gary",          colour: "Midnight", price: 79.00, img: "images/Gary_Black.jpg",            category: "Men's",   desc: "The Gary in Midnight is a sleek dark suede lace-up perfect for work or casual wear. Same great comfort features as all TipToe Soles designs." },
  { id: 3, name: "Work and Walk", colour: "Chestnut", price: 85.00, img: "images/Work_and_Walk_Chesnut.jpg", category: "Men's",   desc: "The Work and Walk in Chestnut is designed for those long days on your feet. Orthotic-friendly insole and a supportive fit make it ideal for all-day wear." },
  { id: 4, name: "Sally",         colour: "Tan",      price: 75.00, img: "images/Sally_Tan.jpg",             category: "Women's", desc: "The Sally in Tan is a sophisticated tassel loafer with a lightweight platform sole. Elegant enough for the office, comfortable enough for all day." },
  { id: 5, name: "Sally",         colour: "Black",    price: 75.00, img: "images/Sally_Black.jpg",           category: "Women's", desc: "The Sally in Black is a versatile loafer that pairs with everything. Soft leather upper with a cushioned footbed for lasting comfort." },
  { id: 6, name: "Heavenly",      colour: "Black",    price: 90.00, img: "images/Heavenly_Black.jpg",        category: "Women's", desc: "The Heavenly in Black is a wedge slip-on that blends style and support. The elevated sole keeps you comfortable without sacrificing elegance." },
  { id: 7, name: "Clancy",        colour: "Blue",     price: 59.00, img: "images/Clancy_Blue.jpg",           category: "Women's", desc: "The Clancy in Blue is an open-toe slingback sandal with a mesh knit upper. Lightweight and breathable — perfect for warmer days." },
];

const SIZES = ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"];

/* ── CART STATE ── */
let cart = [];

/* ============================================
   NAVIGATION
   ============================================ */
function nav(id, el, polTab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  if (el) {
    el.classList.add('active');
  } else {
    const ne = document.getElementById('nav-' + id);
    if (ne) ne.classList.add('active');
  }
  if (id === 'policies' && polTab) showPol(polTab, null);
  const aside = document.getElementById('aside');
  if (aside) aside.classList.remove('open');
  window.scrollTo(0, 0);
  return false;
}

function showPol(id, btn) {
  document.querySelectorAll('.policy-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  const section = document.getElementById('pol-' + id);
  if (section) section.classList.add('active');
  if (btn) {
    btn.classList.add('active');
  } else {
    document.querySelectorAll('.ptab').forEach(t => {
      if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(id)) t.classList.add('active');
    });
  }
}

function toggleSidebar() {
  const aside = document.getElementById('aside');
  if (aside) aside.classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const aside = document.getElementById('aside');
  const ham   = document.getElementById('ham');
  if (aside && aside.classList.contains('open') && !aside.contains(e.target) && e.target !== ham && !ham.contains(e.target)) {
    aside.classList.remove('open');
  }
});

/* ============================================
   PRODUCT MODAL
   ============================================ */
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modal-img').src         = p.img;
  document.getElementById('modal-img').alt         = p.name + ' ' + p.colour;
  document.getElementById('modal-category').textContent = p.category + "'s Shoes";
  document.getElementById('modal-name').textContent    = p.name + ' — ' + p.colour;
  document.getElementById('modal-price').textContent   = '$' + p.price.toFixed(2);
  document.getElementById('modal-desc').textContent    = p.desc;

  // Build size selector
  const sizeWrap = document.getElementById('modal-sizes');
  sizeWrap.innerHTML = '';
  SIZES.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.textContent = s;
    btn.onclick = () => {
      sizeWrap.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
    sizeWrap.appendChild(btn);
  });

  // Wire up the Add to Cart button inside modal
  document.getElementById('modal-add-btn').onclick = () => {
    const selected = sizeWrap.querySelector('.size-btn.selected');
    if (!selected) { alert('Please select a size first!'); return; }
    addToCart(p, selected.textContent);
    closeModal('product-modal');
  };

  openModal('product-modal');
}

/* ============================================
   CART FUNCTIONS
   ============================================ */
function addToCart(product, size) {
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, size, qty: 1 });
  }
  updateCartBadge();
  showToast(product.name + ' (' + size + ') added to cart!');
}

function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  updateCartBadge();
  renderCart();
}

function updateQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id, size);
  else renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  badge.textContent = total;
  if (total > 0) {
    badge.classList.remove('cart-badge-hidden');
  } else {
    badge.classList.add('cart-badge-hidden');
  }
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function openCart() {
  renderCart();
  openModal('cart-modal');
}

function renderCart() {
  const body = document.getElementById('cart-items');
  if (cart.length === 0) {
    body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    document.getElementById('cart-footer').style.display = 'none';
    return;
  }
  document.getElementById('cart-footer').style.display = 'block';
  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name} <span>${i.colour}</span></div>
        <div class="cart-item-size">Size: ${i.size}</div>
        <div class="cart-item-price">$${(i.price * i.qty).toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQty(${i.id},'${i.size}',-1)">−</button>
        <span>${i.qty}</span>
        <button class="qty-btn" onclick="updateQty(${i.id},'${i.size}',1)">+</button>
        <button class="remove-btn" onclick="removeFromCart(${i.id},'${i.size}')">✕</button>
      </div>
    </div>
  `).join('');
  document.getElementById('cart-total').textContent = '$' + getCartTotal().toFixed(2);
}

/* ============================================
   CHECKOUT
   ============================================ */
function openCheckout() {
  if (cart.length === 0) return;
  closeModal('cart-modal');

  // Populate order summary
  const summary = document.getElementById('checkout-summary');
  summary.innerHTML = cart.map(i => `
    <div class="checkout-line">
      <span>${i.name} (${i.colour}) × ${i.qty} — ${i.size}</span>
      <span>$${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join('');
  document.getElementById('checkout-total').textContent = '$' + getCartTotal().toFixed(2);

  openModal('checkout-modal');
}

function submitCheckout() {
  const name  = document.getElementById('co-name').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const addr  = document.getElementById('co-address').value.trim();
  const card  = document.getElementById('co-card').value.trim();

  if (!name || !email || !addr || !card) {
    alert('Please fill in all fields before placing your order.');
    return;
  }

  closeModal('checkout-modal');
  cart = [];
  updateCartBadge();

  alert(
    '🎉 Order Confirmed!\n\n' +
    'Thank you, ' + name + '!\n' +
    'Your order has been placed and a confirmation will be sent to ' + email + '.\n\n' +
    'TipToe Soles · Australia, Est. 2026'
  );
}

/* ============================================
   MODAL HELPERS
   ============================================ */
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}